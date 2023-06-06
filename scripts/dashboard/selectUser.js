import axios from "axios";
import Cookies from "js-cookie";

const selectUser = async (id, setData, week) => {

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/dashboard/show`, {id: id, week: week}, config)

    if (request.status === 201)
        setData(request.data)
}
export default selectUser