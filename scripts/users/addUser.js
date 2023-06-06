import {Snackbar} from "@mui/material";
import axios from "axios";
import Router from 'next/router'
import Cookies from 'js-cookie'

const addUser = async (data, services, e, button, enqueueSnackbar) => {

    e.preventDefault()
    button(true)

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/add`, {data, services}, config)

    if(request.status === 201)
        Router.push('/dashboard')
    else
        enqueueSnackbar(request.data.message)

    button(false)

}
export default addUser