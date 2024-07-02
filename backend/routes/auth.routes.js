const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/auth.controller");

router.route("/signup").get(signup);

router.route("/login").get(login);

router.route("/logout").get(logout);

module.exports = router;
