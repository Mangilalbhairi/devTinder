const express = require("express");
const bcrypt =  require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const app = express();
const { connectDB } = require("./config/database");
const User = require("./model/user");
const {validateSignupUser} = require("./utils/validate")
const {auth} = require("./middleware/auth")
app.use(express.json());
app.use(cookieParser())



//handle user signup
app.post("/signup", async (req, res)=> {
  try{
    //validate request body
    validateSignupUser(req)

    //Encrypt password

    const {password,firstName,lastName,email,gender} = req.body;
    const hashPassword =await bcrypt.hash(password,10)
    console.log("hash  password",hashPassword)
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

//login user
app.post("/login", async(req, res) => {
  try{
    const  {email,password} = req.body;

    if(!(email&&password))
      throw new Error("Please Enter Credentials")

    const user = await User.findOne({email:email})//find user

    if(!user)//check user available or not
      throw new Error("User Not found")

    const isPasswordValid = await bcrypt.compare(password, user.password)//matching password
    
    if(isPasswordValid){
      const token = await jwt.sign({_id:user._id}, "XXX$SECURE&")
      
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

//get profile
app.get("/profile", auth, (req, res) => {
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


connectDB()
  .then(() => {
    console.log("Database connection sucessfully");
    app.listen(7777, (req, res) => {
      console.log("server is sucessfully running at port: 7777");
    });
  })
  .catch((err) => console.log("database connection failed", err.message));
