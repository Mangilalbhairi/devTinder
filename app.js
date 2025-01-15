const express = require("express");
const bcrypt =  require("bcrypt")
const app = express();
const { connectDB } = require("./config/database");
const User = require("./model/user");
const {validateSignupUser} = require("./utils/validate")
app.use(express.json());



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
    
    if(isPasswordValid)
      res.send("Login Sucessfully")

    else{
      res.send("Invalid Credentials")
    }

  }
  catch(err){
    res.send(`Error: ${err.message}`)
  }
})

//get user
app.get("/user",async (req, res) => {
  try{
    const  userDetail = req.body;
    //const user = await User.find(userDetail)// fetch all user which are full fill criteria 
    const user = await User.findOne(userDetail)//fetch only one user
    res.send(user)
  }
  catch(err){
    res.send(`Something went wrong ${err.message}`)
  }
})
//update user
app.patch("/update/:userId", async (req, res) => {
  try{
    const id = req.params.userId;
    const userData = req.body;
   

    AllowedUpdated = ['about','gender','age','photoUrl','skill','email']
    
    const isUpdateAllowed = Object.keys(userData).every((k) => AllowedUpdated.includes(k))
    if(!isUpdateAllowed)
      res.send("Sorry You are try to update unathuraized field!")
    else{
      const updatedUser = await User.findByIdAndUpdate(id, userData,{
        new:true,
        runValidators: true
      })
      res.send(updatedUser)
    }
   
  }
  catch(err) {
    res.send(`Something went wrong ${err.message} `)
  }
})
//Delete the user
app.delete("/delete", async (req, res) => {
  try{
    const userId = req.body.id;
    const deletedUser = await User.findByIdAndDelete(userId)
    res.send(deletedUser)
  }
  catch(err){
    res.send(`Something went wrong ${deletedUser}`)
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
