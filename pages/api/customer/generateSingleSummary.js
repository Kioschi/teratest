import mysql from 'mysql2/promise'
import {verify} from 'jsonwebtoken'

export default async function handler(req, res) {

    const token = req.headers.authorization

    const data = req.body

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

            const query = 'select name, GROUP_CONCAT(serviceName, \' ( \', price, \' x \', quantity, \' ) \', IF(multiplier is not null, concat(multiplier, \' MNOŻNIK POWÓD: \', optionName), \'\')) as OPIS, sum(sum)                                                                                         as RAZEM from (select name, serviceName, price, (count(name) * (price * ifnull(multiplier, 1))) as sum, count(name)                                     as quantity, multiplier, optionName, customerID from (SELECT concat(c.name, \' \', c.lastName) as name, s.id                            as serviceID, o.multiplier, s.price, s.name                          as serviceName, o.name                          as optionName, a.customerID                    as customerID FROM appointments a INNER JOIN services s on a.serviceID = s.id inner join customers c on a.customerID = c.id inner join users u on a.userID = u.id left join options o on a.multiplier = o.id WHERE date BETWEEN DATE(?) AND DATE(?) and a.deleted = 0 and a.customerID = ? and (`refID`, `lastChangedDate`) IN (SELECT `refID`, MAX(`lastChangedDate`) FROM `appointments` GROUP BY `refID`)) as ascuo group by serviceID, multiplier, customerID) as a2 group by customerID'

            const [rows] = await connection.execute(query, [data.fromDate, data.toDate, data.id])

            await connection.end()

            res.status(201).json({data: rows})
        }
        catch (e){
            res.status(200).json({message: "Problem z bazą danych"})
        }
    }
    catch (e){
        res.status(200).json({message: "Zły token"})
    }

}