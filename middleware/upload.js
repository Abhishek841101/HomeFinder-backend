const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ ensure uploads folder exists
const uploadPath = "uploads/";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const name =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, name + path.extname(file.originalname));
  },
});

module.exports = multer({ storage });