import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: { fileSize: 100 * 1024 * 1024 }, // Cho phép file tối đa 100MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("❌ Định dạng file không hợp lệ! Chỉ hỗ trợ ảnh và video."));
    }
    cb(null, true);
  },
});

export default upload;
