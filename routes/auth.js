const express = require("express");
const authRouter = express.Router()
const {validateSignupUser} = require("../utils/validate")
const User = require("../model/user")
const bcrypt = require("bcrypt")

//auth routes

authRouter.post("/signup", async (req, res) =>{
    try{
        //validate request body
        validateSignupUser(req)
    
        //Encrypt password
        const {password,firstName,lastName,email,gender} = req.body;
        const hashPassword = await bcrypt.hash(password,10)
       
        const user = new User({
          firstName,
          lastName,
          email,
          gender,
          password:hashPassword
        });
        const result = await user.save()
        res.status(201).send(result)
    
      }
      catch(err){
        res.send(`Error : ${err.message}`)
      }
    })




authRouter.post("/login", async (req, res) => {
    try{
        const {email,password} = req.body;
    
        if(!(email&&password))
          throw new Error("Please Enter Credentials")
    
        const user = await User.findOne({email:email})//find user
    
        if(!user)//check user available or not
          throw new Error("User Not found")
    
        
        const isPasswordValid = await user.validatePassword(password)
        
        if(isPasswordValid){
          token = await user.getJWT()
          res.cookie("token",token)
          res.send("Login Sucessfully")
        }
    
        else{
          res.send("Invalid Credentials")
        }
    
      }
      catch(err){
        res.send(`Error: ${err.message}`)
      }
    
})

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null,{
    expires: new Date(Date.now())
  })
  res.status(200).json({
    sucess:true,
    message:"User logout sucessfully"
  })

})

module.exports = authRouter;