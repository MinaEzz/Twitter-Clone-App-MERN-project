const express = require("express");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const fileUpload = require("../middlewares/fileUpload");
const {
  createPost,
  deletePost,
  likePost,
  commentPost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getPostsByUserId,
} = require("../controllers/post.controller");

router.use(protectedRoute);
router.route("/create").post(fileUpload.single("img"), createPost);
router.route("/").get(getAllPosts);
router.route("/following").get(getFollowingPosts);
router.route("/:userId").get(getPostsByUserId);
router.route("/:postId").delete(deletePost);
router.route("/likes/:userId").get(getLikedPosts);
router.route("/comment/:postId").post(commentPost);
router.route("/like/:postId").post(likePost);

module.exports = router;
