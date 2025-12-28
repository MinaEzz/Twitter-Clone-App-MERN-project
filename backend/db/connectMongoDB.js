const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected succesfully to mongoDB ", conn.connection.host);
  } catch (err) {
    console.log("failed to connect to database", err.message);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
