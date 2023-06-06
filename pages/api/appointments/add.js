import mysql from 'mysql2/promise'
import {decode, verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const token = req.headers.authorization

    const data = req.body.data

    const recurrentVisit = req.body.recurrentVisit

    if(!data.userID || !data.customerID || !data.serviceID || !data.hour || !data.date)
        return res.status(200).json({message: "Złe zapytanie"})

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

            try {

                //checking if visit is recurring
                if(recurrentVisit){

                    await connection.query('START TRANSACTION')

                    //generating keys and values
                    const keys = Object.keys(data).map(key => ` \`${key}\``)
                    const values = Object.values(data).map(value => ` '${value}'`)

                    //generating recurringID for identifying appointments
                    const recurringID = Array(5).fill().map(n=>(Math.random()*36|0).toString(36)).join('')

                    const query = `INSERT INTO \`appointments\` (${keys}, \`byWhoID\`, \`lastChangedDate\`, \`recurringID\`) VALUES (${values}, ?, NOW(), '${recurringID}')`
                    await connection.execute(query, [decode(token).id])
                    const [[{id}]] = await connection.execute('SELECT LAST_INSERT_ID() as `id`')
                    await connection.execute('UPDATE `appointments` SET `refID` = ? WHERE `id` = ?', [id, id])

                    //recurring visits
                    const date = data.date
                    const newData = data
                    delete newData.date
                    delete newData.info

                    const newKeys = Object.keys(newData).map(key => ` \`${key}\``)
                    const newValues = Object.values(newData).map(value => ` '${value}'`)

                    const byWhoID = decode(token).id

                    let newQuery = `INSERT INTO \`appointments\` (${newKeys}, \`date\`, \`byWhoID\`, \`lastChangedDate\`, \`refID\`, \`recurringID\`) VALUES `
                    for(let x = 1; x <= 53; x++){

                        const value = `(${newValues}, DATE_ADD('${date}', INTERVAL ${x} WEEK), ${byWhoID}, NOW(), ${Number(id)+x}, '${recurringID}'),`
                        newQuery += value
                    }
                    //removing last comma
                    await connection.execute(newQuery.substring(0, newQuery.length - 1), [])

                    await connection.query('COMMIT')

                }
                else{

                    await connection.query('START TRANSACTION')

                    //generating keys and values
                    const keys = Object.keys(data).map(key => ` \`${key}\``)
                    const values = Object.values(data).map(value => ` '${value}'`)

                    const query = `INSERT INTO \`appointments\` (${keys}, \`byWhoID\`, \`lastChangedDate\`) VALUES (${values}, ?, NOW())`
                    await connection.execute(query, [decode(token).id])
                    const [[{id}]] = await connection.execute('SELECT LAST_INSERT_ID() as `id`')

                    await connection.execute('UPDATE `appointments` SET `refID` = ? WHERE `id` = ?', [id, id])

                    await connection.query('COMMIT')

                }

                res.status(201).json({message: "Wizyta dodana"})
            }
            catch (e) {
                res.status(200).json({message: "Problem z bazą danych"})
                await connection.query('ROLLBACK')
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