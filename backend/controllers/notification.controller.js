const Notification = require("../models/notification.model");
const { SUCCESS, ERROR, FAIL } = require("../utils/httpStatusText");

const getAllNotifications = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const notifications = await Notification.find({ to: userId })
      .sort({
        createdAt: -1,
      })
      .populate({ path: "from", select: "username profileImg" });
    if (!notifications) {
      const error = new Error("No notifications found");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    if (notifications.length === 0) {
      return res.status(200).json({
        status: SUCCESS,
        data: { notifications: [] },
        message: "No notifications found",
      });
    }
    await Notification.updateMany({ to: userId }, { $set: { read: true } });
    res.status(200).json({
      status: SUCCESS,
      data: { notifications },
      message: "Notifications fetched successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const deleteAllNotifications = async (req, res, next) => {
  const userId = req.user._id;
  try {
    await Notification.deleteMany({ to: userId });
    res.status(200).json({
      status: SUCCESS,
      message: "All notifications deleted successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

module.exports = { getAllNotifications, deleteAllNotifications };
