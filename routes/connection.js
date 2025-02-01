const express = require("express");
const connectionRouter = express.Router();
const {auth} = require("../middleware/auth")

const {
  handleSendRequest,
  handleReviewRequest,
} = require("../controllers/connectionControllers");

connectionRouter.post(
  "/request/send/:status/:toUserId",
  auth,
  handleSendRequest
);

//Accepted connection request api
connectionRouter.post(
  "/request/review/:status/:reqestId",
  auth,
  handleReviewRequest
);

module.exports = connectionRouter;
