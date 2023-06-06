import axios from "axios";
import Cookies from "js-cookie";

const generateSummary = async (button, data, setSummaryData, enqueueSnackbar) => {

    button(true)

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/generateSummary`, data, config)

    if(request.status === 201){
        setSummaryData(request.data.data)
    }
    else{
        enqueueSnackbar(request.data.message)
    }
    button(false)
}
export default generateSummary