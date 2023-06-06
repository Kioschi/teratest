import React, {useState} from 'react';
import NavBar from "../../../components/nav/NavBar";
import {Button, Grid, TextField} from "@mui/material";
import {useSnackbar} from "notistack";
import addCustomer from "../../../scripts/customers/addCustomer";
import BackButton from "../../../components/nav/BackButton";

const Add = () => {

    const [disabled, setDisabled] = useState(false)

    const [data, setData] = useState({})

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    return (
        <>
            <NavBar/>
            <form onSubmit={ e => addCustomer(e, data, setDisabled, enqueueSnackbar)}>
                <Grid container justifyContent={'center'}>
                    <Grid item container xs={12} justifyContent={'center'}>
                        <Grid item md={8}>
                            <BackButton/>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} md={4} spacing={2} sx={{m: 1, mr: 3, p: 0}}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Imie" variant="outlined" required onChange={e => setData({...data, name: e.target.value})}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Nazwisko" variant="outlined" required onChange={e => setData({...data, lastName: e.target.value})}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Email" variant="outlined" required onChange={e => setData({...data, email: e.target.value})}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Telefon" variant="outlined" required onChange={e => setData({...data, tel: e.target.value})}/>
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

export default Add;