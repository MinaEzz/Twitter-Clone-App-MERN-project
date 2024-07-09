const Post = require("../models/post.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const { SUCCESS, ERROR, FAIL } = require("../utils/httpStatusText");
const { v2: cloudinary } = require("cloudinary");

const createPost = async (req, res, next) => {
  const userId = req.user._id.toString();
  const { text } = req.body;
  let { img } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User doesn't exist");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    if (!text && !img) {
      const error = new Error(
        "Post can't be empty, post must have text or image."
      );
      error.status = FAIL;
      error.code = 400;
      return next(error);
    }
    if (img) {
      const uploadResult = await cloudinary.uploader.upload(img);
      img = uploadResult.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });
    await newPost.save();
    res.status(201).json({
      status: SUCCESS,
      data: { post: newPost },
      message: "Post created successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const deletePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post doesn't exist");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    if (post.user.toString() !== req.user._id.toString()) {
      const error = new Error("Unauthorized to delete post");
      error.status = FAIL;
      error.code = 401;
      return next(error);
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[1];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).json({
      status: SUCCESS,
      data: { post },
      message: "Post deleted successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const updatePost = async (req, res, next) => {
  const { postId } = req.params;
  const { text } = req.body;
  let { img } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post doesn't exist");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    if (post.user.toString() !== req.user._id.toString()) {
      const error = new Error("Unauthorized to update post");
      error.status = FAIL;
      error.code = 401;
      return next(error);
    }
    if (img) {
      const uploadResult = await cloudinary.uploader.upload(img);
      img = uploadResult.secure_url;
      if (post.img) {
        const imgId = post.img.split("/").pop().split(".")[1];
        await cloudinary.uploader.destroy(imgId);
      }
    }
    post.text = text;
    post.img = img;
    await post.save();
    res.status(200).json({
      status: SUCCESS,
      data: { post },
      message: "Post updated successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const likePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post doesn't exist");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    if (post.likes.includes(req.user._id.toString())) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: req.user._id } });
      await post.save();
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { likedPosts: postId } }
      );
      res
        .status(200)
        .json({ status: SUCCESS, data: null, message: "Unlike successfully" });
    } else {
      await Post.updateOne({ _id: postId }, { $push: { likes: req.user._id } });
      await post.save();
      await User.updateOne(
        { _id: req.user._id },
        { $push: { likedPosts: postId } }
      );
      const newNotification = new Notification({
        type: "like",
        from: req.user._id,
        to: post.user,
      });
      await newNotification.save();
      res
        .status(200)
        .json({ status: SUCCESS, data: null, message: "Like successfully" });
    }
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const commentPost = async (req, res, next) => {
  const { postId } = req.params;
  const { text } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post doesn't exist");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    if (!text) {
      const error = new Error("Comment can't be empty");
      error.status = FAIL;
      error.code = 400;
      return next(error);
    }
    post.comments.push({
      user: req.user._id,
      text,
    });
    await post.save();
    res.status(201).json({
      status: SUCCESS,
      data: { post },
      message: "Comment added successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");
    if (!posts) {
      const error = new Error("No posts found");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    if (posts.length === 0) {
      return res.status(200).json({
        status: SUCCESS,
        data: { posts },
        message: "no posts in the database",
      });
    }
    res.status(200).json({
      status: SUCCESS,
      data: { posts },
      message: "Posts fetched successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const getPostsByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");
    if (!posts) {
      const error = new Error("No posts found");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    if (posts.length === 0) {
      return res.status(200).json({
        status: SUCCESS,
        data: { posts },
        message: "User have no posts",
      });
    }
    res.status(200).json({
      status: SUCCESS,
      data: { posts },
      message: "Posts fetched successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const getFollowingPosts = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    const followingPosts = await Post.find({
      user: { $in: user.following },
    })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");
    if (!followingPosts) {
      const error = new Error("No posts found");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    if (followingPosts.length === 0) {
      return res.status(200).json({
        status: SUCCESS,
        data: { followingPosts },
        message: "no posts in the database",
      });
    }
    res.status(200).json({
      status: SUCCESS,
      data: { followingPosts },
      message: "Following posts fetched successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

const getLikedPosts = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate("user", "-password")
      .populate("comments.user", "-password");
    if (!likedPosts) {
      const error = new Error("No posts found");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    if (likedPosts.length === 0) {
      return res.status(200).json({
        status: SUCCESS,
        data: { likedPosts },
        message: "no posts in the database",
      });
    }
    res.status(200).json({
      status: SUCCESS,
      data: { likedPosts },
      message: "Liked posts fetched successfully",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

module.exports = {
  createPost,
  deletePost,
  updatePost,
  likePost,
  commentPost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getPostsByUserId,
};
