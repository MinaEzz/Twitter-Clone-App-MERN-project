const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8000;
const connectMongoDB = require("./db/connectMongoDB");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { ERROR } = require("./utils/httpStatusText");

const authRouter = require("./routes/auth.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRouter);
// GLOBAL MIDDLEWARE FOR NOT FOUND ROUTERS
app.all("*", (req, res, next) => {
  const error = new Error("This Resource Is Not Available");
  error.status = ERROR;
  error.code = 404;
  return next(error);
});
// DEFAULT ERROR HANDLER
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500).json({
    status: error.status || "Error",
    data: null,
    message: error.message || "Unkown Error Occured.",
    code: error.code || 500,
  });
});
app.listen(port, () => {
  console.log("> Server is up and running on port : " + port);
  connectMongoDB();
});
