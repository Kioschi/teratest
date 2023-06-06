import axios from "axios";
import Cookies from "js-cookie";

const generateSingleSummary = async (button, data, setSummaryData, enqueueSnackbar) => {

    button(true)

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/customer/generateSingleSummary`, data, config)

    if(request.status === 201){
        setSummaryData(request.data.data)
    }
    else{
        enqueueSnackbar(request.data.message)
    }
    button(false)
}
export default generateSingleSummary