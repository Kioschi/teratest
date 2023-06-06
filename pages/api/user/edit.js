import mysql from 'mysql2/promise'
import {decode, verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const token = req.headers.authorization

    const data = req.body.data

    const id = req.body.id

    const servicesToAdd = req.body.add === undefined ? '' : req.body.add
    const servicesToDelete = req.body.delete === undefined ? '' : req.body.delete

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

            const [rows] = await connection.execute('SELECT `login` FROM `users` WHERE `login` = ? AND `password` = ?', [decode(token).login, password])

            if(rows.length>0){

                try {
                    //begin of transaction
                    await connection.query('START TRANSACTION')


                    //checking if there is no data to edit
                    if(Object.keys(data).length !== 0){
                        //query for user data edit
                        //generating query for adding user
                        const values = []
                        for(const pair of Object.entries(data)){
                            values.push(`\`${pair[0]}\` = '${pair[1]}'`)
                        }

                        const query = `UPDATE \`users\` SET ${values.join()} WHERE \`id\` = ?`

                        await connection.execute(query,[id])
                    }

                    //query for services delete & add

                    for(const x of servicesToDelete){
                        await connection.execute('UPDATE `services` SET `deleted` = 1 WHERE `id` = ?', [x.id])
                    }

                    for(const x of servicesToAdd){
                        await connection.execute('INSERT INTO `services`(`name`, `price`, `userID`, `time`) VALUES (?,?,?,?)', [x.name, x.price, id, x.time])
                    }

                    await connection.query('COMMIT')
                    //end of transaction

                    res.status(201).json({message: "Użytkownik zedytowany"})
                }
                catch (e){
                    await connection.query('ROLLBACK')
                    res.status(200).json({message: "Problem z serwerem"})
                }
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