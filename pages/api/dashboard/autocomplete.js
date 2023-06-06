import mysql from 'mysql2/promise'
import {verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const token = req.headers.authorization

    const data = req.body.data
    const type = req.body.type

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

            let query = ''
            let params = []

            switch (type){
                case 'customers':
                    query = 'SELECT CONCAT(`name`, " ", `lastName`) as `label`, `id` FROM `customers` WHERE `name` LIKE ? OR `lastName` LIKE ? LIMIT 5'
                    params = [`${data}%`, `${data}%`]
                    break

                case 'users':
                    query = 'SELECT CONCAT(`name`, " ", `lastName`) as `label`, `id` FROM `users` WHERE `name` LIKE ? OR `lastName` LIKE ? LIMIT 5'
                    params = [`${data}%`, `${data}%`]
                    break

                case 'services':
                    query = 'SELECT `id`, `name` as `label` FROM `services` WHERE `userID` = ? AND `deleted` = 0'
                    params = [data]
                    break
            }

            const [rows] = await connection.execute(query, params)

            await connection.end()

            res.status(201).json({list: rows})

        }
        catch (e){
            res.status(200).json({message: "Problem z baza danych"})
        }
    }
    catch (e){
        res.status(200).json({message: "Zły token"})
    }
}