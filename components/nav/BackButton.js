import React from 'react';
import {Button} from "@mui/material";
import { useRouter } from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = () => {
    const router = useRouter()

    return (
        <Button variant={"text"} onClick={()=> router.back()} sx={{mt: 1, mb: 1, color: 'gray'}}>
            <ArrowBackIcon fontSize={'20px'}/>BACK
        </Button>
    );
};

export default BackButton;