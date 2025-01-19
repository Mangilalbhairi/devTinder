const express = require("express")
const profileRouter = express.Router()
const {auth} =  require("../middleware/auth")
const User = require("../model/user")
const bcrypt = require("bcrypt")

profileRouter.get("/view",auth, async(req, res)=> {
  try {
    const user = req.user;
    if(!user)
      throw new Error("User not found")
    res.send(user)
  }
  catch(err){
    res.send(`Error : ${err.message}`)
  }
})
profileRouter.patch("/edit", auth, async(req, res) => {
  try{
    const userData = req.body;
    const user = req.user;
    if(!user)
      throw new Error("Access denied")
    const updatePoint = ["gender", "firstName", "lastName", "skill", "about"]
   const isUpdateAllowed = Object.keys(userData).every((e) => updatePoint.includes(e))
   if(!isUpdateAllowed)
    throw new Error("Update not allowed")

  //  const result = Object.keys(userData).forEach((key) => user[key] = userData.key)

   const result = await User.findByIdAndUpdate(user._id , userData, {newReturn:true})

   res.status(200).json({
    sucess:true,
    message:"Your Profile Updated Sucessfully",
    result
   })


  }
  catch(err){
    res.status(400).json({
      sucess:false,
      message:err.message
    })
  }
})

//forgot password
profileRouter.patch("/password", auth, async(req, res) => {
  try{
    const userNewPassword  =  req.body.password;
    const user = req.user;
    if(!userNewPassword)
      throw new Error("Please Enter New Password")
    const hashPassword = await bcrypt.hash(userNewPassword, 10)
    
    const result = await User.findByIdAndUpdate(user._id, {password:hashPassword},{runValidators:true})
    res.status(200).json({
      sucess:true,
      message:"Password Updated Sucessfully",
      result
    })
  }
  catch(err){
    res.status(400).json({
      sucess:false,
      message:err.message
    })
  }
})

module.exports = profileRouter;