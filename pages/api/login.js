import mysql from 'mysql2/promise'
import jwt, {decode} from 'jsonwebtoken'
import {serialize} from "cookie";
import dayjs from "dayjs";

export default async function handler(req, res) {

    const data = {
        login: req.body.login,
        password: req.body.password
    }

    try {
        const connection = await mysql.createConnection(
            {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            })

        const [rows] = await connection.execute('SELECT `login`, `id`, `admin`, `name`, `lastName` FROM `users` WHERE `login` = ? AND `password` = ? AND `deleted` = 0', [data.login, data.password])

        if(rows.length>0){

            const token = jwt.sign({
                exp: 99999999999999999999999999999999999999999,
                login: rows[0].login,
                id: rows[0].id,
                admin: rows[0].admin,
                name: rows[0].name,
                lastName: rows[0].lastName
            }, process.env.TOKEN_SIGNATURE)

            const serialised = serialize("JWT", token, {
                sameSite: "strict",
                maxAge: 60 * 60 * 24,
                path: "/",
            });

            //searching if user has recurring appointments to renew

            const [[appointments]] = await connection.execute('SELECT IF(date < DATE_ADD(NOW(), INTERVAL 6 MONTH), true, false) as renew, userID, serviceID, customerID, hour, date, recurringID FROM appointments WHERE recurringID IS NOT NULL AND userID = ? AND deleted = 0 group by refID, date order by date desc LIMIT 1', [rows[0].id])
            if(appointments?.renew){

                try{

                    await connection.query('START TRANSACTION')

                    //recurring visits
                    const dateRAW = dayjs(appointments.date)
                    const date = `${dateRAW.$y}-${dateRAW.$M.toString().length === 1 ? `0${dateRAW.$M+1}` : dateRAW.$M+1}-${dateRAW.$D.toString().length === 1 ? `0${dateRAW.$D}` : dateRAW.$D}`
                    const recurringID = appointments.recurringID

                    const newData = appointments
                    delete newData.renew
                    delete newData.recurringID
                    delete newData.date

                    const newKeys = Object.keys(newData).map(key => ` \`${key}\``)
                    const newValues = Object.values(newData).map(value => ` '${value}'`)

                    const byWhoID = decode(token).id

                    //inserting first row to get last inserted id

                    const query = `INSERT INTO \`appointments\` (${newKeys}, \`date\`, \`byWhoID\`, \`lastChangedDate\`, \`recurringID\`) VALUES (${newValues}, DATE_ADD('${date}', INTERVAL 1 WEEK), ${byWhoID}, NOW(), '${recurringID}')`
                    await connection.execute(query, [byWhoID])

                    const [[{id}]] = await connection.execute('SELECT LAST_INSERT_ID() as `id`', [])
                    await connection.execute('UPDATE `appointments` SET `refID` = ? WHERE `id` = ?', [id, id]) //adding refID for first inserted appointment

                    let newQuery = `INSERT INTO \`appointments\` (${newKeys}, \`date\`, \`byWhoID\`, \`lastChangedDate\`, \`refID\`, \`recurringID\`) VALUES `
                    for(let x = 2; x <= 53; x++){

                        const value = `(${newValues}, DATE_ADD('${date}', INTERVAL ${x} WEEK), ${byWhoID}, NOW(), ${Number(id)+(x-1)}, '${recurringID}'),`
                        newQuery += value
                    }
                    //removing last comma
                    await connection.execute(newQuery.substring(0, newQuery.length - 1), [])

                    await connection.query('COMMIT')

                    res.setHeader("Set-Cookie", serialised);
                    res.status(201).json({message: 'Success'})

                }
                catch (e){
                    await connection.query('ROLLBACK')
                    res.status(200).json({message: "Problem z serwerem!"})
                }

            }
            else {
                res.setHeader("Set-Cookie", serialised);
                res.status(201).json({message: 'Success'})
            }

            await connection.end()

        }
        else
            res.status(200).json({message: "Wrong credentials"})

    } catch (e) {
        res.status(200)
    }

}
