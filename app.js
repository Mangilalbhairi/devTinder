const express = require("express")
const app = express()

//routes

app.use("/test",(req,res) => {
    res.send("Hello from test route")
})

app.use("/",(req, res, next) => {
    res.send("Hello from server")
    next()
});



app.use("/check",(req, res) => {
    res.send("hello server")
})

//listining port
app.listen(7777, (req, res) => {
    console.log("server is sucessfully running at port: 7777")
})