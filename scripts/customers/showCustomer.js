import axios from "axios";
import Cookies from "js-cookie";

const showUser = async (filters, tableList) => {

    let fixedFilters = {}

    const config = {
        headers: {
            authorization: Cookies.get('JWT')
        }
    }

    for(const filter of Object.entries(filters)){
        if(filter[1]!=='')
            fixedFilters = {...fixedFilters, [filter[0]]: filter[1]}
    }

    const request = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/customer/show`, {filters}, config)
    if(request.status === 201)
        tableList(request.data.rows)
    else
        alert('dupa')

}
export default showUser