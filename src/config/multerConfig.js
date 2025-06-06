import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ hỗ trợ ảnh và video."));
    }
  },
});

export default upload;
