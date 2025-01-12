const express = require("express")
const app = express()
const {userAuth, isAdmin} = require("./middleware/auth")

//Middleware and request handler method
app.use(express.json())//parse body

app.post("/user/login/", (req, res)=>{
   const {user,password} = req.body;
   res.send({
    message:"User Sucessfully login!",
    userName:`Hello ${user}`
   
   })
})
app.use("/admin",isAdmin)
app.use("/user",userAuth)//middleware for user authentigation

app.get("/admin/dashboard", (req, res) => {
    res.send("Dashboard Page")
})

app.get("/user/alluser",(req, res)=> {
    res.send("all user")
})
app.delete("/user/deleteuser",(req, res) =>{
    res.send("User Delete Sucessfully")
})




//listining port
app.listen(7777, (req, res) => {
    console.log("server is sucessfully running at port: 7777")
})