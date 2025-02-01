const express = require("express");
const userRouter = express.Router();
const { auth } = require("../middleware/auth");
const {
  handleShowPendingRequest,
  handleConnectionList,
  handleFeedList,
} = require("../controllers/userControllers");

userRouter.get("/request/received", auth, handleShowPendingRequest);

userRouter.get("/request/connection", auth, handleConnectionList);

userRouter.get("/request/feed", auth, handleFeedList);

module.exports = userRouter;
