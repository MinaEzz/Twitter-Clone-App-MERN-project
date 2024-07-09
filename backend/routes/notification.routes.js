const express = require("express");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const {
  getAllNotifications,
  deleteAllNotifications,
} = require("../controllers/notification.controller");

router.use(protectedRoute);
router.route("/").get(getAllNotifications).delete(deleteAllNotifications);

module.exports = router;
