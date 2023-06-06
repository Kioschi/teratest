import React from 'react';
import NavBar from "../../components/nav/NavBar";
import CalendarContainer from "../../components/dashboard/CalendarContainer";
import mysql from "mysql2/promise";
import {decode} from "jsonwebtoken";

const Index = ({users}) => {

    return (
        <>
            <NavBar/>
            <CalendarContainer users={users}/>
        </>
    );
};


export async function getServerSideProps(context){

    const token = context.req.cookies.JWT

    const connection = await mysql.createConnection(
        {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })

    let [rows] = []

    if(decode(token).admin)
        [rows] = await connection.execute('SELECT CONCAT(`name`, " ", `lastName`) as `name`, `id` FROM `users` WHERE `admin` = 0 AND `deleted` = 0', [])
    else
        [rows] = await connection.execute('SELECT CONCAT(`name`, " ", `lastName`) as `name`, `id` FROM `users` WHERE id = ?', [decode(token).id])

    await connection.end()

    return {
        props: {
            users: rows,
        }
    }

}

export default Index;