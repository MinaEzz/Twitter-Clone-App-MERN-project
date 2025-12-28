const User = require("../models/user.model");
const { FAIL, ERROR } = require("../utils/httpStatusText");
const jwt = require("jsonwebtoken");

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      const error = new Error(
        "Unauthorized, you need to login to access this."
      );
      error.status = FAIL;
      error.code = 401;
      return next(error);
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) {
      const error = new Error("Unauthorized, invalid token");
      error.status = FAIL;
      error.code = 401;
      return next(error);
    }
    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) {
      const error = new Error("User doesn't exist");
      error.status = FAIL;
      error.code = 404;
      return next(error);
    }
    req.user = user;
    next();
  } catch (err) {
    const error = new Error(err.message);
    error.status = ERROR;
    error.code = 500;
    return next(error);
  }
};

module.exports = protectedRoute;
