import Cookies from "js-cookie";
import axios from "axios";
import Router from "next/router";

const setOptions = async (button, data, enqueueSnackbar)=> {

    button(true)

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/options/`, data, config)

    if(request.status === 201)
        Router.push('/dashboard')
    else
        enqueueSnackbar(request.data.message)

    button(false)
}
export default setOptions