const { SUCCESS, ERROR, FAIL } = require("../utils/httpStatusText");

const signup = async (req, res, next) => {
  res.json({ data: "signup is working fine...." });
};

const login = async (req, res, next) => {
  res.json({ data: "login is working fine...." });
};

const logout = async (req, res, next) => {
  res.json({ data: "logout is working fine...." });
};

module.exports = { signup, login, logout };
