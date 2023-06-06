import mysql from 'mysql2/promise'
import {verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const data = req.body

    const token = req.headers.authorization

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

            let rows = []

            switch (data.type){
                case 'users':
                    [rows] = await connection.execute('SELECT `appointments`.`id` AS `id`, CONCAT(`customers`.`name`, \' \', `customers`.lastName) AS \'customerName\', `services`.`name` AS \'serviceName\', `appointments`.`hour`, DATE_FORMAT(`appointments`.`date`, \'%d-%m-%Y\') AS \'date\' from `appointments` INNER JOIN `customers` ON `appointments`.`customerID` = `customers`.`id` INNER JOIN `services` ON `appointments`.`serviceID` = `services`.`id` WHERE `appointments`.`deleted` = 0 AND `appointments`.`userID` = ? AND `appointments`.date < ADDDATE(NOW(), INTERVAL 1 MONTH) AND (`appointments`.`refId`, `appointments`.`lastChangedDate`) IN (SELECT `appointments`.`refId`, MAX(`appointments`.`lastChangedDate`) FROM `appointments` GROUP BY `appointments`.`refID`) ORDER BY `appointments`.`date` DESC LIMIT ?, 25', [data.id, `${data.from}`])
                    break;
                case 'customers':
                    [rows] = await connection.execute('SELECT `appointments`.`id` AS `id`, CONCAT(`customers`.`name`, \' \', `customers`.lastName) AS \'customerName\', `services`.`name` AS \'serviceName\', `appointments`.`hour`, DATE_FORMAT(`appointments`.`date`, \'%d-%m-%Y\') AS \'date\' from `appointments` INNER JOIN `customers` ON `appointments`.`customerID` = `customers`.`id` INNER JOIN `services` ON `appointments`.`serviceID` = `services`.`id` WHERE `appointments`.`deleted` = 0 AND `appointments`.`customerID` = ? AND `appointments`.date < ADDDATE(NOW(), INTERVAL 1 MONTH) AND (`appointments`.`refId`, `appointments`.`lastChangedDate`) IN (SELECT `appointments`.`refId`, MAX(`appointments`.`lastChangedDate`) FROM `appointments` GROUP BY `appointments`.`refID`) ORDER BY `appointments`.`date` DESC LIMIT ?, 25', [data.id, `${data.from}`])
                    break;
            }

            res.status(201).json({rows})

            await connection.end()
        }
        catch (e){
            res.status(200).json({message: "Problem z bazą danych"})
        }
    }
    catch (e){
        res.status(200).json({message: "Zły token"})
    }
}