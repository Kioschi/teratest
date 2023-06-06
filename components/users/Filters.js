import React, {useState} from 'react';
import {Button, FormControlLabel, FormGroup, Grid, Switch, TextField} from "@mui/material";
import showUser from "../../scripts/users/showUser";

const Filters = ({setTableState}) => {

    const [visible, setVisible] = useState(false)

    const [data, setData] = useState({})

    return (
        <Grid item container xs={12} sx={{mt: 5}} spacing={2}>
            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel control={<Switch/>} label="Filtry" onChange={()=> setVisible(prevState => !prevState)}/>
                </FormGroup>
            </Grid>
            {
                visible && <>
                    <Grid item xs={12} md={2}>
                        <TextField fullWidth label="Login" variant="outlined" size={'small'} onChange={ e => setData({...data, login: e.target.value})}/>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField fullWidth label="Imie" variant="outlined" size={'small'} onChange={ e => setData({...data, name: e.target.value})}/>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField fullWidth label="Nazwisko" variant="outlined" size={'small'} onChange={ e => setData({...data, lastName: e.target.value})}/>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Button variant="outlined" size={'small'} sx={{mr: 2}} onClick={ () => showUser(data, setTableState)}>Filtruj</Button>
                        <Button variant="outlined" size={'small'} onClick={ () => showUser({}, setTableState)}>Wyczyść filtry</Button>
                    </Grid>
                </>
            }
        </Grid>
    );
};

export default Filters;