import Cookies from "js-cookie";
import axios from "axios";

const getMoreRows = async (id, type, from, setter, getter) => {

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/getRows`, {id, type, from}, config)

    if (request.status === 201)
        return request.data.rows
    else
        return []

}
export default getMoreRows