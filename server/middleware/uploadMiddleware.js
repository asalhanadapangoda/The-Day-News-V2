import multer from 'multer';

// Storage configuration with multer
const storage = multer.diskStorage({
  // Since we use Cloudinary, we just need to temporarily store the file
  // or use multer memory storage. We'll use memory storage to avoid local temp files.
});

// Use memory storage for direct Cloudinary stream upload or we can use disk and unlink
const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max size
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp|svg|gif)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  },
});

export default upload;
