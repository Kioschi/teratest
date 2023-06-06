import Cookies from "js-cookie";
import axios from "axios";
import Router from "next/router";

const editUser = async (data, servicesDelete, servicesToAdd, e, setButtonDisabled, id, password, enqueueSnackbar) => {

    e.preventDefault()

    setButtonDisabled(true)

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/edit`, {data: data, id: id, delete: servicesDelete, add: servicesToAdd, password: password}, config)

    if (request.status === 201)
        Router.push('/dashboard/users')
    else
        enqueueSnackbar(request.data.message)

    setButtonDisabled(false)
}
export default editUser