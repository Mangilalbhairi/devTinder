const token = "xyz";

//auth middleware 

const userAuth = (req, res, next) => {
    console.log("verifying user token")

    const userToken = "xyz";
    const isUserAuthorized = userToken === token;
    if(!isUserAuthorized)
        res.send("Please Enter correct credential")
    else{
        next()
    }
}

const isAdmin = (req, res, next) => {
    console.log("verifying user token")
    const adminToken = "xyz";
    const isUserAuthorized = adminToken === token;
    if(!isUserAuthorized)
        res.send("You have not admin access")
    else{
        next()
    }
}

module.exports = {
    userAuth,
    isAdmin
}