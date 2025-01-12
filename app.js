const express = require("express")
const app = express()
const {connectDB} = require("./config/database")
const User = require("./model/user")

//handle user signup
app.post("/signup", async (req, res) =>{
    try{
    const userObj = {
        firstName: "Mangilal",
        lastName : "jat",
        email: "mangilalbhairi@gmail.com",
        password:9588053371,
        gender: "male",
    }
    const user = new User(userObj)
    await user.save()
    res.send("user sucessfully created")
}
catch(err){
    res.send(`Something went wrong ${err.message}`)
}
})

connectDB()
.then(() =>{
    console.log("Database connection sucessfully")
    app.listen(7777, (req, res) => {
        console.log("server is sucessfully running at port: 7777")
    })
})
.catch((err) => console.log("database connection failed", err.message))
