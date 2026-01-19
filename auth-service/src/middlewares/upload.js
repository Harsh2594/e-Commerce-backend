const multer = require("multer");
const path = require("path");

// absolute path to uploads folder
const uploadDir = path.join(__dirname, "..", "..", "uploads");

//storege
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

//file filter
const fileFilter = (req, file, cb) => {
  const allowedType = /jpeg|png|jpg/;
  const isValid = allowedType.test(file.mimetype);

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 12 * 1024 * 1024 },
});

module.exports = upload;
