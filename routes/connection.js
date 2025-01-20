const express = require("express")
const connectionRouter = express.Router()
const {auth} = require("../middleware/auth")
const User = require("../model/user")
const connectionRequest = require("../model/connectionRequest")


connectionRouter.post("/request/send/:status/:toUserId", auth , async (req, res) => {
    try{
        
        const fromUserId =  req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        if(!toUserId || !status)
            throw new Error("Please Enter correct creadential")
        
        const isAllowRequestStatus = ["interasted","ignore"]
        const isStatusAllow = isAllowRequestStatus.includes(status)

        if(!isStatusAllow)
            throw new Error("Request Status not allowed")

        //check user exist or not
        const toUser = await User.findById(toUserId)
        if(!toUser)
            throw new Error("user not found")

        //check connection request already did or not
        const existRequest = await connectionRequest.find(
           { $or:[
                {
                    toUserId:toUser,
                     fromUserId:fromUserId,
                },
                {
                    toUserId:fromUserId,
                    fromUserId:toUserId

                }
            ]}
        )
        
        if(existRequest.length > 0)
            throw new Error("You are not allow to send request")
        
       //handle user connection request
       const requestSend = new connectionRequest({
        toUserId:toUserId,
        fromUserId:fromUserId,
        status:status
       })
       const result = await requestSend.save()
       //Send sucessfull response
       res.status(201).json({
        sucess:true,
        message:"Your request sucessfully sent",
        result
       })
    }
    catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }

})

//Accepted connection request api
connectionRouter.post("/request/review/:status/:reqestId", auth, async(req, res) => {
    try{
        const {status, reqestId} = req.params;
        const logedInUser = req.user;

        const allowStatus = ["accept", "reject"]
        //check status allow or not
        if(!allowStatus.includes(status))
            return res.status(404).json({
            success:false,
            message:"Invalid Status not allowed!"
        })

        //check valid user request
        const connectionRequests = await connectionRequest.findOne({
           _id:reqestId,
            toUserId:logedInUser._id,
            status:"interasted"
            
        })
        if(!connectionRequests)
            return res.status(400).json({
            sucess:false,
            message:"Connection Request not found"
        })
        connectionRequests.status = "accept";
        const result = await connectionRequests.save()

        res.status(200).json({
            sucess:true,
            message:"Request Sucessfully Accepted!"
        })


    }
    catch(err){
        res.status(400).json({
            sucess:false,
            message:err.message
        })
    }
})



module.exports = connectionRouter;