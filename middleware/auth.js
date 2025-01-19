const jwt = require("jsonwebtoken");
const User = require("../model/user")

const auth = async(req ,res, next) => {
    try{
        const token = req.cookies.token;

        if(!token)
            throw new Error("Login Required")

        const decodeToken = await jwt.verify(token, "XXX$SECURE&")

        const userId = decodeToken._id;
       
        const user = await User.findById(userId)

        if(!user)
            throw new Error("user not found")
        req.user = user;
        next()
    }
    catch(err){
        res.send(`Error : ${err.message}`)
    }


}
module.exports = {
    auth
}