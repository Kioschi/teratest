import mysql from 'mysql2/promise'
import {decode, verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const token = req.headers.authorization

    const data = req.body.data

    const multiplier = req.body.multiplier

    const editAll = req.body.editAll

    const recurringVisit = req.body.isRecurring

    const recurringID = req.body.recurringID

    const id = req.body.id

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

            const [[{wasRecurring}]] = await connection.execute('SELECT ISNULL(recurringID) as "wasRecurring" FROM appointments WHERE id=?', [id])

            if(data.info===null)
                delete data.info

            try {
                if(recurringVisit && !wasRecurring){ //visit was recurring and it's still has to be recurring

                    if(editAll){ //editing only one appointment or all

                        await connection.query('START TRANSACTION')

                        //generating keys and values
                        const keys = Object.keys(data).map(key => ` \`${key}\``)
                        const values = Object.values(data).map(value => ` '${value}'`)

                        //updating this appointment
                        const query = `INSERT INTO \`appointments\` (${keys}, \`byWhoID\`, \`lastChangedDate\`, \`multiplier\`, \`refID\`, \`recurringID\`) SELECT ${values}, ?, NOW(), ${multiplier ? multiplier : null}, \`refID\`, \`recurringID\` FROM appointments WHERE id = ?`
                        await connection.execute(query, [decode(token).id, id])

                        //deleting all appointments ahead
                        await connection.execute('DELETE FROM appointments WHERE recurringID = ? AND refID > (SELECT refID FROM (SELECT * FROM appointments) as tb1 WHERE id = ? LIMIT 1)', [recurringID, id])

                        //recurring visits
                        const date = data.date
                        const newData = data
                        delete newData.date
                        delete newData.info
                        delete newData.multiplier

                        const newKeys = Object.keys(newData).map(key => ` \`${key}\``)
                        const newValues = Object.values(newData).map(value => ` '${value}'`)

                        const byWhoID = decode(token).id

                        const [[{refIDs}]] = await connection.execute('SELECT LAST_INSERT_ID() as `refIDs`')

                        let newQuery = `INSERT INTO \`appointments\` (${newKeys}, \`date\`, \`byWhoID\`, \`lastChangedDate\`, \`refID\`, \`recurringID\`) VALUES `
                        for(let x = 1; x <= 53; x++){

                            const value = `(${newValues}, DATE_ADD('${date}', INTERVAL ${x} WEEK), ${byWhoID}, NOW(), ${Number(refIDs)+x}, '${recurringID}'),`
                            newQuery += value
                        }
                        //removing last comma
                        await connection.execute(newQuery.substring(0, newQuery.length - 1), [])

                        await connection.query('COMMIT')

                        res.status(201).json({message: "Wizyta edytowana"})

                    }
                    else{

                        await connection.query('START TRANSACTION')

                        //generating keys and values
                        const keys = Object.keys(data).map(key => ` \`${key}\``)
                        const values = Object.values(data).map(value => ` '${value}'`)

                        const query = `INSERT INTO \`appointments\` (${keys}, \`byWhoID\`, \`lastChangedDate\`, \`multiplier\`, \`refID\`, \`recurringID\`) SELECT ${values}, ?, NOW(), ${multiplier ? multiplier : null}, \`refID\`, \`recurringID\` FROM appointments WHERE id = ?`
                        await connection.execute(query, [decode(token).id, id])

                        await connection.query('COMMIT')

                        res.status(201).json({message: "Wizyta edytowana"})

                    }

                }
                else if(!recurringVisit && !wasRecurring){ //visit was recurring and it has to be no longer recurring

                    await connection.query('START TRANSACTION')

                    //generating keys and values
                    const keys = Object.keys(data).map(key => ` \`${key}\``)
                    const values = Object.values(data).map(value => ` '${value}'`)

                    //deleting every future appointment
                    await connection.execute('DELETE FROM appointments WHERE recurringID = ? AND date > (SELECT date FROM (SELECT * FROM appointments) as tb1 WHERE id = ? LIMIT 1)', [recurringID, id])

                    //removing from the rest of appointments recurringID and generating a new version of appointment
                    const query = `INSERT INTO \`appointments\` (${keys}, \`byWhoID\`, \`lastChangedDate\`, \`multiplier\`, \`refID\`) SELECT ${values}, ?, NOW(), ${multiplier ? multiplier : null}, \`refID\` FROM appointments WHERE id = ?`

                    await connection.execute(query, [decode(token).id, id])

                    await connection.execute('UPDATE appointments SET recurringID = null WHERE recurringID = (SELECT recurringID FROM (SELECT * FROM appointments) as tb1 WHERE id = ? LIMIT 1)', [id])

                    await connection.query('COMMIT')

                    res.status(201).json({message: "Wizyta edytowana"})

                }
                else if(recurringVisit && wasRecurring){ //appointment has to be recurring but it wasn't

                    await connection.query('START TRANSACTION')

                    //generating keys and values
                    const keys = Object.keys(data).map(key => ` \`${key}\``)
                    const values = Object.values(data).map(value => ` '${value}'`)

                    //generating recurringID for identifying appointments
                    const recurringID = Array(5).fill().map(n=>(Math.random()*36|0).toString(36)).join('')

                    const query = `INSERT INTO \`appointments\` (${keys}, \`byWhoID\`, \`lastChangedDate\`, \`multiplier\`, \`refID\`, \`recurringID\`) SELECT ${values}, ?, NOW(), ${multiplier ? multiplier : null}, \`refID\`, ? FROM appointments WHERE id = ?`
                    await connection.execute(query, [decode(token).id, recurringID, id])

                    //recurring visits
                    const date = data.date
                    const newData = data
                    delete newData.date
                    delete newData.info
                    delete newData.multiplier

                    const newKeys = Object.keys(newData).map(key => ` \`${key}\``)
                    const newValues = Object.values(newData).map(value => ` '${value}'`)

                    const byWhoID = decode(token).id

                    const [[{refIDs}]] = await connection.execute('SELECT LAST_INSERT_ID() as `refIDs`')

                    let newQuery = `INSERT INTO \`appointments\` (${newKeys}, \`date\`, \`byWhoID\`, \`lastChangedDate\`, \`refID\`, \`recurringID\`) VALUES `
                    for(let x = 1; x <= 53; x++){

                        const value = `(${newValues}, DATE_ADD('${date}', INTERVAL ${x} WEEK), ${byWhoID}, NOW(), ${Number(refIDs)+x}, '${recurringID}'),`
                        newQuery += value
                    }
                    //removing last comma
                    await connection.execute(newQuery.substring(0, newQuery.length - 1), [])

                    await connection.query('COMMIT')

                    res.status(201).json({message: "Wizyta edytowana"})

                }
                else if(!recurringVisit && wasRecurring){ //just editing single appointment...
                    await connection.query('START TRANSACTION')

                    //generating keys and values
                    const keys = Object.keys(data).map(key => ` \`${key}\``)
                    const values = Object.values(data).map(value => ` '${value}'`)

                    const query = `INSERT INTO \`appointments\` (${keys}, \`byWhoID\`, \`lastChangedDate\`, \`multiplier\`, \`refID\`) SELECT ${values}, ?, NOW(), ${multiplier ? multiplier : null}, \`refID\` FROM appointments WHERE id = ?`
                    await connection.execute(query, [decode(token).id, id])

                    await connection.query('COMMIT')

                    res.status(201).json({message: "Wizyta edytowana"})
                }
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