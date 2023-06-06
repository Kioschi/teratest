import mysql from 'mysql2/promise'
import {decode, verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const token = req.headers.authorization

    const password = req.body.password

    const id = req.body.id

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

            const [rows] = await connection.execute('SELECT `login` FROM `users` WHERE `login` = ? AND `password` = ? AND `deleted` = 0', [decode(token).login, password])

            if(rows.length>0){

                await connection.execute('UPDATE `customers` SET `deleted` = 1 WHERE `id` = ?', [id])

                res.status(201).json({message: "User deleted"})
            }
            else
                res.status(200).json({message: "Bad password"})

            await connection.end()
        }
        catch (e){
            res.status(200).json({message: "Problem with database"})
        }
    }
    catch (e){
        res.status(200).json({message: "Bad token"})
    }

}