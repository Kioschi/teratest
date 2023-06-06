import mysql from 'mysql2/promise'
import {verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const token = req.headers.authorization

    const data = req.body.data

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

            //generating query for adding customer
            const keys = Object.keys(data)
            const values = Object.values(data).map( value => `'${value}'`)

            const userQuery = `INSERT INTO \`customers\`(${keys}) VALUES (${values})`

            await connection.execute(userQuery,[])

            await connection.end()

            res.status(201).json({message: "Pacjent dodany"})

        }
        catch (e){
            res.status(200).json({message: "Problem z bazą danych"})
        }
    }
    catch (e){
        res.status(200).json({message: "Zły token"})
    }
}