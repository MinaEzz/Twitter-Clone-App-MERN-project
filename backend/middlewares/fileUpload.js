const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const MIME_TYPE_MAP = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: Object.values(MIME_TYPE_MAP),
    public_id: (req, file) =>
      Date.now() + "-" + file.originalname.split(".")[0],
  },
});

const fileUpload = multer({ storage: storage });

module.exports = fileUpload;

// const multer = require("multer");
// const { v4: uuidv4 } = require("uuid");
// const MIME_TYPE_MAP = {
//   "image/jpg": "jpg",
//   "image/jpeg": "jpeg",
//   "image/png": "png",
// };
// const fs = require("fs");
// const path = require("path");
// console.log(__dirname + "../uploads/images");

// // Ensure the directory exists or create it
// const uploadDir = path.join(__dirname, "..", "uploads", "images");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const fileUpload = multer({
//   limits: 5 * 1000 * 1000,
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       const ext = MIME_TYPE_MAP[file.mimetype];
//       cb(null, uuidv4() + "." + ext);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const isValid = !!MIME_TYPE_MAP[file.mimetype];
//     const error = isValid ? null : new Error("Invalid Mime Type");
//     cb(error, isValid);
//   },
// });

// module.exports = fileUpload;
