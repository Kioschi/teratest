import React, {useState} from 'react';
import {useSnackbar} from "notistack";
import NavBar from "../../../components/nav/NavBar";
import {Button, Grid, TextField} from "@mui/material";
import mysql from "mysql2/promise";
import editCustomer from "../../../scripts/customers/editCustomer";
import BackButton from "../../../components/nav/BackButton";

const Edit = ({dataStart, id}) => {

    const [disabled, setDisabled] = useState(false)

    const [data, setData] = useState({})

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    return (
        <>
            <NavBar/>
            <form onSubmit={ e => editCustomer(e, setDisabled, data, enqueueSnackbar, id)}>
                <Grid container justifyContent={'center'}>
                    <Grid item container xs={12} justifyContent={'center'}>
                        <Grid item md={8}>
                            <BackButton/>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} md={4} spacing={2} sx={{m: 1, mr: 3, p: 0}}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Imie"
                                variant="outlined"
                                required
                                onChange={e => setData({...data, name: e.target.value})}
                                defaultValue={dataStart.name}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Nazwisko"
                                variant="outlined"
                                required
                                onChange={e => setData({...data, lastName: e.target.value})}
                                defaultValue={dataStart.lastName}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                required
                                onChange={e => setData({...data, email: e.target.value})}
                                defaultValue={dataStart.email}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Telefon"
                                variant="outlined"
                                required
                                onChange={e => setData({...data, tel: e.target.value})}
                                defaultValue={dataStart.tel}
                            />
                        </Grid>
                        <Grid item container xs={12} justifyContent={'flex-end'}>
                            <Grid item xs={12} md={4}>
                                <Button fullWidth variant="contained" type={'submit'} disabled={disabled}>Dodaj</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </>
    );
};
export async function getServerSideProps(context){

    const {id} = context.query

    const connection = await mysql.createConnection(
        {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })

    const [rows] = await connection.execute('SELECT `id`, `name`, `lastName`, `tel`, `email` FROM `customers` WHERE `id` = ?', [id])

    await connection.end()

    return {
        props: {
            dataStart: rows[0],
            id: id
        }
    }
}


export default Edit;