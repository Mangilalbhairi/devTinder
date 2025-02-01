const User = require("../model/user");
const bcrypt = require("bcrypt");

const handleGetProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        sucess: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      sucess: true,
      message: "Your profile get sucessfully!",
      user,
    });
  } catch (err) {
    res.status(400).json({
      sucess: false,
      message: err.message,
    });
  }
};

const handleEditProfile = async (req, res) => {
  try {
    const updateData = req.body;
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        sucess: false,
        message: "You are not authorized",
      });
    }

    const updatePoint = [
      "gender",
      "firstName",
      "lastName",
      "skill",
      "about",
      "age",
      "photoUrl",
    ];
    const isUpdateAllowed = Object.keys(userData).every((e) =>
      updatePoint.includes(e)
    );
    if (!isUpdateAllowed) {
      return res.status(400).json({
        sucess: false,
        message: "update invalid field",
      });
    }

    //  const result = Object.keys(userData).forEach((key) => user[key] = userData.key)

    const result = await User.findByIdAndUpdate(user._id, updateData, {
      newReturn: true,
    });

    res.status(200).json({
      sucess: true,
      message: "Your Profile Updated Sucessfully",
      result,
    });
  } catch (err) {
    res.status(400).json({
      sucess: false,
      message: err.message,
    });
  }
};

const handleForgetPassword = async (req, res) => {
  try {
    const userNewPassword = req.body.password;
    const user = req.user;
    if (!userNewPassword) {
      return res.status(400).json({
        sucess: false,
        message: "Please Enter the new password",
      });
    }

    const hashNewPassword = await bcrypt.hash(userNewPassword, 10);

    const result = await User.findByIdAndUpdate(
      user._id,
      { password: hashNewPassword },
      { runValidators: true }
    );
    res.status(200).json({
      sucess: true,
      message: "Password Updated Sucessfully",
      result,
    });
  } catch (err) {
    res.status(400).json({
      sucess: false,
      message: err.message,
    });
  }
};

module.exports = {
  handleGetProfile,
  handleEditProfile,
  handleForgetPassword,
};
