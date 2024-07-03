const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  getMe,
} = require("../controllers/auth.controller");
const protectedRoute = require("../middlewares/protectedRoute");

router.route("/me").get(protectedRoute, getMe);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

module.exports = router;
