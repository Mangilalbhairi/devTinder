const express = require("express");
const authRouter = express.Router();

const {
  handleSignup,
  handleLogin,
  handleLogout,
} = require("../controllers/authControllers");

//auth routes
authRouter.post("/signup", handleSignup);
authRouter.post("/login", handleLogin),
  authRouter.post("/logout", handleLogout);

module.exports = authRouter;
