import Cookies from "js-cookie";
import axios from "axios";
import Router from "next/router";

const deleteAppointment = async (id, setOpen, setDisabled, enqueueSnackbar, password) => {

    setOpen(true)

    setDisabled(true)

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/appointments/delete`, {id: id, password: password}, config)

    if(request.status === 201){
        Router.reload()
        setOpen(false)
    }
    else
        enqueueSnackbar(request.data.message)

    setDisabled(false)
}
export default deleteAppointment