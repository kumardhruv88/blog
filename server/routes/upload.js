import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Multer setup for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/upload/image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Convert buffer to base64 for Cloudinary upload
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'techscribe',
      resource_type: 'auto'
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

// DELETE /api/upload/:publicId
router.delete('/:publicId', async (req, res) => {
    try {
        const { publicId } = req.params;
        await cloudinary.uploader.destroy(publicId);
        res.json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
});

export default router;
