import cloudinary from '../utils/cloudinaryConfig.js';
import fs from 'fs';

/**
 * Middleware to upload single image to Cloudinary with dynamic folder
 */
export const uploadToCloudinaryMiddleware = (folder = 'general') => async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
    });

    fs.unlinkSync(file.path); // Remove temp file after upload
    req.imageUrl = result.secure_url;
    next();
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    res.status(500).json({ message: 'Cloudinary upload error', error: err.message });
  }
};

/**
 * Direct upload function (used directly inside controller)
 */
export const uploadToCloudinaryDirect = async (file, folder = 'general') => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder,
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  });

  fs.unlinkSync(file.path); // Clean up temp file
  return result;
};

//video upload 

export const uploadVideoToCloudinary = async (file, folder = 'general') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'video',
      folder,
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
    });

    fs.unlinkSync(file.path); // Clean up temp file
    return result;

  } catch (error) {
    console.error('Cloudinary Video Upload Error:', error);
    throw new Error('Failed to upload video to Cloudinary');
  }
};




