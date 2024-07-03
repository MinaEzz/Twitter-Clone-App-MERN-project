const jwt = require("jsonwebtoken");
const { ERROR } = require("./httpStatusText");

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2d",
  });
  if (!token) {
    return res
      .status(500)
      .json({ status: ERROR, message: "Error signing token" });
  }
  res.cookie("token", token, {
    maxAge: 2 * 24 * 60 * 60 * 1000,
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    httpOnly: true, // prevent XSS (cross-site scripting) attacks
    sameSite: "strict", // CSRF (cross-site request forgery) attacks
    secure: process.env.NODE_ENV !== "development",
    path: "/",
  });
};

module.exports = generateTokenAndSetCookie;
