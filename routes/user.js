const express = require("express");
const userRouter = express.Router();
const { auth } = require("../middleware/auth");
const connectionRequest = require("../model/connectionRequest");
const { set } = require("mongoose");
const User = require("../model/user");

//check received request
userRouter.get("/request/received", auth, async (req, res) => {
  try {
    const logedInUser = req.user;
    const receviedRequest = await connectionRequest
      .find({
        toUserId: logedInUser._id,
        status: "interasted",
      })
      .populate("fromUserId", "firstName lastName email age");

    if (!receviedRequest.length > 0) throw new Error("No pending request");

    res.status(200).json({
      sucess: true,
      message: "Pending connection request",
      receviedRequest,
    });
  } catch (err) {
    res.status(400).json({
      sucess: true,
      message: err.message,
    });
  }
});

//connection list
userRouter.get("/request/connection", auth, async (req, res) => {
  try {
    const logedInUser = req.user;
    const connectionList = await connectionRequest
      .find({
        $or: [
          {
            toUserId: logedInUser._id,
            status: "accept",
          },
          {
            fromUserId: logedInUser._id,
            status: "accept",
          },
        ],
      })
      .populate("fromUserId", "firstName lastName gender")
      .populate("toUserId", "firstName lastName gender");

    if (!(connectionList.length > 0)) throw new Error("you have no connection");

    const userConnection = connectionList.map((row) => {
      if (row.toUserId._id.toString() === logedInUser._id.toString()) {
        return row.fromUserId;
      } else {
        return row.toUserId;
      }
    });
    res.status(200).json({
      sucess: true,
      message: `${userConnection.length} connection in your list`,
      userConnection,
    });
  } catch (err) {
    res.status(400).json({
      sucess: false,
      message: err.message,
    });
  }
});

userRouter.get("/request/feed", auth, async (req, res) => {
  try {
    const SAFE_DATA = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "skill",
    ];
    const logedInUser = req.user;

    //fetch already pending request and accepted requested

    const requestConnections = await connectionRequest
      .find({
        $or: [{ fromUserId: logedInUser._id }, { toUserId: logedInUser._id }],
      })
      .select("fromUserId toUserId")
      .populate("toUserId", "firstName")
      .populate("fromUserId", "firstName");

    const hideUserFromFeed = new Set(); //create unique value object

    requestConnections.forEach((req) => {
      hideUserFromFeed.add(req.toUserId._id.toString());
      hideUserFromFeed.add(req.fromUserId._id.toString());
    });

    //fetch Feed user which are not present in your connectionlist
    const userFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: logedInUser._id } },
      ],
    }).select(SAFE_DATA);

    res.status(200).json({
      sucess: true,
      message: "Explore new connections",
      userFeed,
    });
  } catch (err) {
    res.status(400).json({
      sucess: false,
      message: `Error :${err.message}`,
    });
  }
});

module.exports = userRouter;
