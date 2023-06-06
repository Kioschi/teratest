import {decode, verify} from "jsonwebtoken";


//api endpoint for middleware verification
export default async function verifyToken(req, res) {

    const token = req.body.token

    try{
        verify(token, process.env.TOKEN_SIGNATURE)

        res.status(200).json({message: "ok", admin: decode(token).admin})
    }
    catch(e){
        res.status(200).json({message: "token invalid"})
    }


}