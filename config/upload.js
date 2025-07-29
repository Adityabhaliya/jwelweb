const multer = require('multer');
const path = require('path');

// ✅ Allowed extensions
const allowedExtensions = [
  '.jpeg', '.jpg', '.png', '.gif', '.webp',       // Images
  '.mp4', '.mov', '.avi', '.mkv', '.webm',         // Videos
  '.xls', '.xlsx'                                  // Excel files
];

// ✅ Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  }
});

// ✅ File filter with extension check
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image, video, and Excel files are allowed!'));
  }
};

// ✅ Final multer upload setup
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

module.exports = upload;