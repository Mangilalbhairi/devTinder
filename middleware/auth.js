const jwt = require("jsonwebtoken");
const User = require("../model/user");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        sucess: false,
        message: "Please Login",
      });
    }

    const decodeToken = await jwt.verify(token, process.env.JWT_SECURT);

    const userId = decodeToken._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(200).json({
        sucess: false,
        message: "user not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({
      sucess: false,
      message: "Something went wrong",
      err,
    });
  }
};
module.exports = {
  auth,
};
