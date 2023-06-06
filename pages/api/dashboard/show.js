import mysql from 'mysql2/promise'
import {verify} from 'jsonwebtoken'
import dayjs from "dayjs";

export default async function handler(req, res) {

    const token = req.headers.authorization

    const id = req.body.id

    const week = req.body.week

    try{
        verify(token, process.env.TOKEN_SIGNATURE)

        try{
            const connection = await mysql.createConnection(
                {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                })

            const [rows] = await connection.execute('SELECT `shiftStart`, `shiftEnd`, `dayStart`, `dayEnd` FROM `users` WHERE `id` = ?', [id])

            const [appointmentsUnsorted] = await connection.execute('SELECT `appointments`.`id`, CONCAT(`c`.`name`, \' \', `c`.`lastName`)                      as `customerName`, `s`.`name`, `hour`, `date`, ifnull(`info`, "")                                           as info, TIME(hour) + INTERVAL s.time MINUTE                          as hourEnd, if(ifnull(appointments.multiplier, \'#ffffff\')=\'#ffffff\', s.color, o.color) as color FROM `appointments` INNER JOIN `customers` `c` on `appointments`.`customerID` = `c`.`id` INNER JOIN `services` `s` on `appointments`.`serviceID` = `s`.`id` LEFT JOIN options o on appointments.multiplier = o.id WHERE YEARWEEK(`date`, 1) = YEARWEEK(CURDATE() + INTERVAL ? WEEK, 1) AND appointments.`deleted` = 0 AND `appointments`.`userID` = ? AND (`refID`, `lastChangedDate`) IN (SELECT `refID`, MAX(`lastChangedDate`) FROM `appointments` GROUP BY `refID`) ORDER BY `appointments`.`date`, appointments.hour ASC', [week, id])

            let finalObj = {}

            appointmentsUnsorted.forEach((game) => {
                const dateUnready = dayjs(game.date)
                const date = `${dateUnready.$y}-${dateUnready.$M.toString().length === 1 ? `0${dateUnready.$M+1}` : dateUnready.$M+1}-${dateUnready.$D.toString().length === 1 ? `0${dateUnready.$D}` : dateUnready.$D}`
                if (finalObj[date]) {
                    finalObj[date].push(game);
                } else {
                    finalObj[date] = [game];
                }
            })

            await connection.end()

            res.status(201).json({
                time: rows[0],
                appointments: finalObj
            })
        }
        catch (e){
            res.status(200).json({message: "Problem with database"})
        }
    }
    catch (e){
        res.status(200).json({message: "Bad token"})
    }
}