const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8000;
const connectMongoDB = require("./db/connectMongoDB");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { v2: cloudinary } = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const { ERROR } = require("./utils/httpStatusText");

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const notificationRouter = require("./routes/notification.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/notifications", notificationRouter);
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
