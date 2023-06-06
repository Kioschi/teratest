import mysql from 'mysql2/promise'
import {verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const token = req.headers.authorization

    const data = req.body.data

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

            //generating query for adding user
            const values = []
            for(const pair of Object.entries(data)){
                values.push(`\`${pair[0]}\` = '${pair[1]}'`)
            }

            const query = `UPDATE \`customers\` SET ${values.join()} WHERE \`id\` = ?`

            await connection.execute(query,[id])

            await connection.end()

            res.status(201).json({message: "Customer edited"})
        }
        catch (e){
            res.status(200).json({message: "Problem with database"})
        }
    }
    catch (e){
        res.status(200).json({message: "Bad token"})
    }

}