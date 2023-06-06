import mysql from 'mysql2/promise'
import {decode, verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const token = req.headers.authorization

    const filters = req.body.filters

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

            //generating a filter query

            const values = []
            for (const filter of Object.entries(filters)){
                values.push(`\`${filter[0]}\` LIKE '${filter[1]}%' AND`)
            }

            const query = `SELECT \`id\`, \`name\`, \`lastName\`, \`login\` FROM \`users\` WHERE ${values.join(' ')} \`deleted\` = 0`
            const params = []

            const [rows] = await connection.execute(query, params)

            await connection.end()

            res.status(201).json({rows: rows})
        }
        catch (e){
            res.status(200).json({message: "Problem with database"})
        }
    }
    catch (e){
        res.status(200).json({message: "Bad token"})
    }
}