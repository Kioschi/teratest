import React, {useEffect} from 'react';
import {CircularProgress, Grid} from "@mui/material";
import Cookies from 'js-cookie'
import Router from "next/router";

const Logout = () => {

    useEffect(()=>{
        Cookies.remove('JWT')
       Router.push('/')
    }, [])

    return (
        <Grid container alignContent={'center'} justifyContent={'center'} sx={{height: '100vh'}}>
            <CircularProgress/>
        </Grid>
    );
};

export default Logout;