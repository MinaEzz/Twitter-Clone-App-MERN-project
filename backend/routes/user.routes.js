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
router.route("/profile/:username").get(getUserProfile); // DONE
router.route("/follow/:id").post(followUser); // DONE
router.route("/suggested").get(getSuggestedUsers); // DONE
router.route("/update").patch(updateUser); // TODO

module.exports = router;
