const express = require("express")
const app = express()

//routes
app.use("/",(req, res, next) => {
    res.send("Hello from server")
    next()
});
app.use("/",(req, res, next) => {
    res.send("Hello from server2")
    next()
});


app.use("/test",(req,res) => {
    res.send("Hello from test route")
})

app.use("/test/3", (req, res) => {
    res.send("hello from test 2 case")
})

app.use("/user", (req, res) => {
    res.send("hello from hello route")
})

//handle different http request method like Get POST or Delete Patch

app.get("/user", (req,res) => {
    res.send({
      name:"Mangilal",
      userId : "9588"

    })
})

app.post("/user/:name/:id/signup",(req, res) => {
    res.send({
        meassage:"User signup sucessfully!",
        name : req.params.name,
        userId : req.params.id
    })
})

app.delete("/user", (req, res) => {
    res.send("User deleted sucessfully")
})

//listining port
app.listen(7777, (req, res) => {
    console.log("server is sucessfully running at port: 7777")
})