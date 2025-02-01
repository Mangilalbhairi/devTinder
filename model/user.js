const mongoose = require("mongoose");
const validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email format not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value))
          throw new Error("Please Enter Strong Password");
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Enter invalid gender!");
        }
      },
    },
    about: {
      type: String,
      default: "Write something about you",
    },
    age: {
      type: String,
      default: "25",
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value))
          throw new Error("Please Enter a valid  Url");
      },
    },
    skill: {
      type: ["String"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function (user) {
  try {
    user = this;
    if (user) {
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECURT);
      return token;
    }
  } catch (err) {
    return err.message;
  }
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  try {
    const hashPassword = this.password;
    isPasswordValid = await bcrypt.compare(userInputPassword, hashPassword);
    return isPasswordValid;
  } catch (err) {
    return err.message;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
