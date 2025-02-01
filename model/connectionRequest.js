const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["interasted", "ignore", "accept", "reject"],
      message: `{value} invalid request status`,
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // db indexing

connectionRequestSchema.pre("save", function (next) {
  const toUserId = this.toUserId.toString();
  const fromUserId = this.fromUserId.toString();
  if (fromUserId == toUserId)
    return res.status(200).json({
      status: false,
      message: "You are can't send request yourself",
    });
  else {
    next();
  }
});

const connectionRequest = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);
module.exports = connectionRequest;
