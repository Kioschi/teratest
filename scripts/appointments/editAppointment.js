import Cookies from "js-cookie";
import axios from "axios";
import Router from "next/router";

const editAppointment = async (e, data, hour, date, button, enqueueSnackbar, id, multiplier, isRecurring, editAll, recurringID) => {

    e.preventDefault()
    button(true)

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/appointments/edit`,
        {
            data: {...data, hour: hour, date: date},
            id: id,
            multiplier: multiplier,
            isRecurring: isRecurring,
            recurringID: recurringID,
            editAll: editAll
        },
        config)

    if(request.status === 201)
        Router.push('/dashboard/')
    else
        enqueueSnackbar(request.data.message)

    button(false)

}
export default editAppointment