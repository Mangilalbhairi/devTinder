const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
        

    },
    status:{
        type:String,
        enum:["interasted","ignore","accept","reject"],
        message: `{value} invalid status type`
    }


},
{
    timestamps:true
}
)

connectionRequestSchema.index({fromUserId:1, toUserId:1})

connectionRequestSchema.pre("save", function (next) {
    const toUserId = this.toUserId.toString();
    const fromUserId = this.fromUserId.toString();
    if(fromUserId == toUserId)
        throw new Error("can not send connection request yourself")
    else{
        next()

    }
   
})

const connectionRequest = mongoose.model("connectionRequest", connectionRequestSchema);
module.exports = connectionRequest;