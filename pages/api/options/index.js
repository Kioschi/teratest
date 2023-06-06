import mysql from 'mysql2/promise'
import {verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const token = req.headers.authorization

    const toAdd = req.body.add

    const toDelete = req.body.delete

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

            for(const x of toDelete){
                await connection.execute('UPDATE `options` SET `deleted` = 1 WHERE `id` = ?', [x.id])
            }
            for(const x of toAdd){
                await connection.execute('INSERT INTO `options`(`name`, `multiplier`, `color`) VALUES (?, ?, ?)', [x.name, x.multiplier, x.color])
            }

            await connection.end()

            res.status(201).json({message: "Opcja dodana"})
        }
        catch (e){
            res.status(200).json({message: "Problem z baza danych"})
        }
    }
    catch (e){
        res.status(200).json({message: "Zły token"})
    }

}