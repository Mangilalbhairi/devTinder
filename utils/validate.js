const validator = require("validator")

const validateSignupUser = (req) => {
    const {firstName,lastName,email,password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name must be required")
    }
    else if((firstName.length < 4 || firstName.length > 50) && (lastName.length < 4 || lastName.length > 50) ){
        throw new Error("Character length must be 4-50 charater")
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter Strong Password!")
    }
        
  
}
module.exports ={ validateSignupUser};