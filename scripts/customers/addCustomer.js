import Cookies from "js-cookie";
import axios from "axios";
import Router from "next/router";

const addCustomer =  async (e, data, button, enqueueSnackbar) => {

    e.preventDefault()
    button(true)

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/customer/add`, {data}, config)

    if(request.status === 201)
        Router.push('/dashboard/customers')
    else
        enqueueSnackbar(request.data.message)

    button(false)

}
export default addCustomer