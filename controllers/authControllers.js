const express = require("express");
const authRouter = express.Router();
const { validateSignupUser } = require("../utils/validate");
const User = require("../model/user");
const bcrypt = require("bcrypt");

const handleSignup = async (req, res) => {
  try {
    //validate request body
    validateSignupUser(req);

    //Encrypt password
    const { password, firstName, lastName, email, gender } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      gender,
      password: hashPassword,
    });
    const result = await user.save();

    token = await result.getJWT(); // get jwt token
    res.cookie("token", token);
    res.status(201).json({
      sucess: true,
      message: "account created sucessfully!",
      user,
    });
  } catch (err) {
    res.status(400).json({
      sucess: false,
      message: err.message,
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({
        sucess: false,
        message: "Please Enter the Credential",
      });
    }

    const user = await User.findOne({ email: email }); // fetching user

    if (!user)
      return res.status(400).json({
        sucess: false,
        message: "User not found",
      });

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      token = await user.getJWT();
      res.cookie("token", token);
      res.status(200).json({
        sucess: true,
        message: "Login sucessfully!",
        user,
      });
    } else {
      return res.status(400).json({
        sucess: false,
        message: "Invalid Creadential",
      });
    }
  } catch (err) {
    return res.status(400).json({
      sucess: false,
      message: err.message,
    });
  }
};

const handleLogout = async (req, res) => {
    res.cookie.clear()
    res.status(200).json({
      sucess: true,
      message: "User logout sucessfully",
    });
  };

module.exports = {
  handleSignup,
  handleLogin,
  handleLogout
};
