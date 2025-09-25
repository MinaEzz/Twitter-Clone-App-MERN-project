const User = require("../models/user.model");
const { SUCCESS, ERROR, FAIL } = require("../utils/httpStatusText");
const bcrypt = require("bcrypt");
const generateTokenAndSetCookie = require("../utils/generateToken");

const signup = async (req, res, next) => {
  const { fullName, username, email, password } = req.body;
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  try {
    if (!emailRegex.test(email)) {
      const error = new Error("Invalid email address");
      error.status = FAIL;
      error.code = 400;
      return next(error);
    }
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (existingUser) {
      const error = new Error("User already exists");
      error.status = FAIL;
      error.code = 409;
      return next(error);
    }
    if (password.length < 6) {
      const error = new Error("Password must be at least 6 characters long");
      error.status = FAIL;
      error.code = 400;
      return next(error);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) {
      const error = new Error("Couldn't Create User, Please Try Again.");
      error.status = FAIL;
      error.code = 500;
      return next(error);
    }
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        status: SUCCESS,
        data: {
          user: {
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
          },
        },
        message: "User Created Successfully",
      });
    } else {
      const error = new Error("Couldn't Create User, Please Try Again.");
      error.status = FAIL;
      error.code = 400;
      return next(error);
    }
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      const error = new Error("User doesn't exist");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser?.password || ""
    );
    if (!isPasswordCorrect) {
      const error = new Error("Incorrect Password");
      error.status = FAIL;
      error.code = 400;
      return next(error);
    }
    generateTokenAndSetCookie(existingUser._id, res);
    res.status(200).json({
      status: SUCCESS,
      data: {
        user: {
          _id: existingUser._id,
          fullName: existingUser.fullName,
          username: existingUser.username,
          email: existingUser.email,
          followers: existingUser.followers,
          following: existingUser.following,
          profileImg: existingUser.profileImg,
          coverImg: existingUser.coverImg,
        },
      },
      message: "Login successful",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV !== "development",
      path: "/",
    });
    res.status(200).json({
      status: SUCCESS,
      data: null,
      message: "Logout successful",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ status: SUCCESS, data: { user: user } });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

module.exports = { signup, login, logout, getMe };
