import Cookies from "js-cookie";
import axios from "axios";
import React from "react";

const deleteUser = async (e, password, id, button, backdropState, tableState, setTableState, enqueueSnackbar) => {

    e.preventDefault()

    button(true)

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/delete`, {password, id}, config)

    if (request.status === 201){
        backdropState(false)
        setTableState(tableState.filter( x => x.id !== id))
    }
    else
        enqueueSnackbar(request.data.message)
    button(false)

}
export default deleteUser