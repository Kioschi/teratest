import Cookies from "js-cookie";
import axios from "axios";
import Router from "next/router";

const addAppointment = async (e, data, hour, date, button, recurrentVisit, enqueueSnackbar) => {

    e.preventDefault()
    button(true)

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/appointments/add`, {data: {...data, hour: hour, date: date}, recurrentVisit: recurrentVisit}, config)

    if(request.status === 201)
        Router.push('/dashboard/')
    else
        enqueueSnackbar(request.data.message)

    button(false)

}
export default addAppointment