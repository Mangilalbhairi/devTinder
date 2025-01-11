const express = require("express")
const app = express()


//Multiple route handler
app.use("/user",[ (req, res, next) => {
    console.log("handle the route user 1")
    // res.send("Response from user 1")
    next()
},
(req, res, next) => {
    console.log("handle the route user 2")
    next()
    // res.send("Response form user 2")

}],
(req, res,next) => {
    console.log("handle the route user 3")
    // res.send("Response from user 3")
    next()

},
(req, res, next) => {
    console.log("handle the route user 4");
    // next()
    res.send("Response from user 4")
    next()
    res.send("huuuuuu")

})

//listining port
app.listen(7777, (req, res) => {
    console.log("server is sucessfully running at port: 7777")
})