import express from 'express';
import upload from '../utils/cloudinaryConfig.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Upload an image
// @route   POST /api/v1/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // req.file.path contains the secure Cloudinary URL
    res.status(200).json({ 
      message: 'Image uploaded successfully', 
      url: req.file.path 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

export default router;
