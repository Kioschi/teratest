import mysql from 'mysql2/promise'
import {decode, verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const token = req.headers.authorization

    const id = req.body.id

    const password = req.body.password

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

            const [login] = await connection.execute('SELECT login FROM users WHERE login=? and password=?', [decode(token).login, password])
            if(login.length>0){
                await connection.execute('update appointments set deleted = 1 where refID = (SELECT `refID` FROM ( SELECT * FROM `appointments` ) AS `d` WHERE `id` = ?)', [id])
                res.status(201).json({message: "Wizyta usunieta"})
            }
            else
                res.status(200).json({message: "Złe hasło"})

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