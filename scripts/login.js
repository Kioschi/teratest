import axios from "axios";
import Router from "next/router";

const login = async (errorState, data, e) => {

    e.preventDefault()

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/login`, data)

    if(request.status === 201)
        Router.push('/dashboard')
    else
        errorState(true)

}
export default login