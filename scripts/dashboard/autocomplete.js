import axios from "axios";
import Cookies from "js-cookie";

const autoComplete = async (type, data, setter) => {

    setter([])

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/dashboard/autocomplete`, {data: data, type: type}, config)

    if (request.status === 201)
        setter(request.data.list)
    else
        alert('cos')
}
export default autoComplete