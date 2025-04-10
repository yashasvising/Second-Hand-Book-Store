import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import config from './index.js';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookstore',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  }
});

const uploadMiddleware = multer({
  storage: storage,
});

const uploadImage = async (fileString) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileString, {
      folder: 'bookstore',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Image upload failed');
  }
};

export { uploadMiddleware, uploadImage, cloudinary };