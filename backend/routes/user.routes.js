const express = require("express");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const {
  getUserProfile,
  followUser,
  getSuggestedUsers,
  updateUser,
} = require("../controllers/user.controller");

router.use(protectedRoute);
router.route("/profile/:username").get(getUserProfile);
router.route("/follow/:id").post(followUser);
router.route("/suggested").get(getSuggestedUsers);
router.route("/update").patch(updateUser);

module.exports = router;
