const express = require("express")
const userRouter = express.Router()
const {auth} = require("../middleware/auth")
const connectionRequest = require("../model/connectionRequest")

//check received request
userRouter.get("/request/received", auth, async(req, res) => {
   try{
    const logedInUser = req.user;
    const receviedRequest = await connectionRequest.find({
        toUserId:logedInUser._id,
        status:"interasted"
    }).populate("fromUserId", "firstName lastName email age")

    if(!receviedRequest.length > 0)
        throw new Error("No pending request")

    res.status(200).json({
        sucess:true,
        message:"Pending connection request",
        receviedRequest
    })
   }
   catch(err){
    res.status(400).json({
        sucess:true,
        message:err.message
    })
   }
})

//connection list
userRouter.get("/request/connection", auth, async(req, res) => {
    try{
        const logedInUser = req.user;
        const connectionList =  await connectionRequest.find({
            $or:[
                {
                    toUserId:logedInUser._id,
                    status:"accept"
                },
                {
                    fromUserId:logedInUser._id,
                    status:"accept"
                }
            ]
        }).populate("fromUserId", "firstName lastName gender")
        .populate("toUserId", "firstName lastName gender")

        
        if(!(connectionList.length > 0))
            throw new Error("you have no connection")
        
        const userConnection = connectionList.map((row) => {
            if(row.toUserId._id.toString() === logedInUser._id.toString())
            {
                return row.fromUserId
            }
                
            else{
                return row.toUserId
            }
        })
        res.status(200).json({
            sucess:true,
            message:`${userConnection.length} connection in your list`,
            userConnection
        })


    }
    catch(err){
        res.status(400).json({
            sucess:false,
            message:err.message
        })
    }
})

module.exports = userRouter;