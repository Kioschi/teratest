import mysql from 'mysql2/promise'
import {verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const token = req.headers.authorization

    const data = req.body.data

    const services = req.body.services

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

            try{

                //generating query for adding user
                const userKeys = Object.keys(data)
                const userValues = Object.values(data).map( value => `'${value}'`)

                const userQuery = `INSERT INTO \`users\`(${userKeys}) VALUES (${userValues})`

                //begin of transaction
                await connection.query('START TRANSACTION')

                await connection.execute(userQuery,[])

                const [[{id}]] = await connection.execute('SELECT LAST_INSERT_ID() AS `id`', [])

                for(const service of services)
                    await connection.execute('INSERT INTO `services`(`userID`, `name`, `price`, `time`, `color`) VALUES (?,?,?,?,?)', [id, service.name, service.price, service.time, service.color])

                await connection.query('COMMIT')
                //end of transaction

                res.status(201).json({message: "Użytkownik dodany"})
            }
            catch (e){
                await connection.query('ROLLBACK')
                res.status(200).json({message: "Problem z serwerem"})
            }

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