const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./model/user");
app.use(express.json());


//handle user signup
app.post("/signup", async (req, res)=> {
  try{
    const userObj = req.body;
    const user = new User(userObj);
    const result = await user.save()
    res.status(201).send(result)

  }
  catch(err){
    res.send(`Something went wrong ${err.message}`)
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
