import sha256 from "crypto-js/sha256";

const passwordValidation = (password, dataSetter, data, error) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if (regex.test(password)){
        dataSetter({...data, password: sha256(password).toString()})
        error(false)
    }
    else
        error(true)
}
export default passwordValidation