const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const { SUCCESS, ERROR, FAIL } = require("../utils/httpStatusText");
const bcrypt = require("bcrypt");

const getUserProfile = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    res.status(200).json({
      status: SUCCESS,
      data: { user },
      message: "User profile fetched successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const followUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const modifyUser = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (id === currentUser._id.toString()) {
      const error = new Error("You cannot follow yourself");
      error.status = FAIL;
      error.code = 400;
      return next(error);
    }
    if (!modifyUser || !currentUser) {
      const error = new Error("User not found");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      // REVIEW: send a user id in the response
      res.status(200).json({
        status: SUCCESS,
        data: { userId: modifyUser._id },
        message: "Unfollowed successfully",
      });
    } else {
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: modifyUser._id,
      });
      await newNotification.save();
      // REVIEW: send a user id in the response
      res.status(200).json({
        status: SUCCESS,
        data: { userId: modifyUser._id },
        message: "Followed successfully",
      });
    }
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const getSuggestedUsers = async (req, res, next) => {
  const currentUserId = req.user._id;
  try {
    const usersFollowedByMe = await User.findById(currentUserId).select(
      "following"
    );
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: currentUserId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json({
      status: SUCCESS,
      data: { users: suggestedUsers },
      message: "Suggested users fetched successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  const userId = req.user._id;
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  try {
    let user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    if (
      (currentPassword && !newPassword) ||
      (!currentPassword && newPassword)
    ) {
      const error = new Error(
        "Please provide both current password and new password"
      );
      error.status = FAIL;
      error.code = 400;
      return next(error);
    }
    if (currentPassword && newPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordCorrect) {
        const error = new Error("Incorrect Password");
        error.status = FAIL;
        error.code = 400;
        return next(error);
      }
      if (newPassword.length < 6) {
        const error = new Error("Password must be at least 6 characters long");
        error.status = FAIL;
        error.code = 400;
        return next(error);
      }
      const hashNewPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashNewPassword;
    }
    if (req.files) {
      if (req.files.profileImg) {
        if (user.profileImg?.publicId) {
          await cloudinary.uploader.destroy(user.profileImg.publicId);
        }

        user.profileImg = {
          url: req.files.profileImg[0].path,
          publicId: req.files.profileImg[0].filename,
        };
      }
      if (req.files.coverImg) {
        if (user.coverImg?.publicId) {
          await cloudinary.uploader.destroy(user.coverImg.publicId);
        }

        user.coverImg = {
          url: req.files.coverImg[0].path,
          publicId: req.files.coverImg[0].filename,
        };
      }
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    await user.save();
    user.password = null;
    res.status(200).json({
      status: SUCCESS,
      data: { user },
      message: "User updated successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

module.exports = { getUserProfile, followUser, getSuggestedUsers, updateUser };
