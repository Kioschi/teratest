import Cookies from "js-cookie";
import axios from "axios";
import Router from "next/router";

const editCustomer = async (e, button, data, enqueueSnackbar, id) => {

    e.preventDefault()
    button(true)

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    if(Object.keys(data).length === 0)
        return button(false)

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/customer/edit`, {data: data, id: id}, config)

    if(request.status === 201)
        Router.push('/dashboard/customers')
    else
        enqueueSnackbar(request.data.message)

    button(false)
}
export default editCustomer