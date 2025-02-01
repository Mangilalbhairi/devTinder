const express = require("express");
const profileRouter = express.Router();
const { auth } = require("../middleware/auth");
const {
  handleGetProfile,
  handleEditProfile,
  handleForgetPassword,
} = require("../controllers/profileControllers");

profileRouter.get("/view", auth, handleGetProfile);

profileRouter.patch("/edit", auth, handleEditProfile);

profileRouter.patch("/password", auth, handleForgetPassword);

module.exports = profileRouter;
