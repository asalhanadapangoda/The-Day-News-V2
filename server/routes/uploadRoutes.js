import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'thedaynewsglobal' },
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Image upload failed' });
        }
        res.json({
          message: 'Image Uploaded successfully',
          url: result.secure_url,
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

export default router;
