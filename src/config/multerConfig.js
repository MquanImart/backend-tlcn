import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime', ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Định dạng file không hợp lệ! Chỉ hỗ trợ ảnh và video."));
    }
    cb(null, true);

    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ hỗ trợ ảnh và video."));
    }

  },
});

export default upload;
