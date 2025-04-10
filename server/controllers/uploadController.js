import { uploadImage } from '../config/cloudinary.js';

export const uploadImages = async (req, res, next) => {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide images to upload'
      });
    }

    const uploadPromises = images.map(async (image) => {
      if (image.startsWith('http')) {
        return image;
      }

      const uploadedUrl = await uploadImage(image);
      return uploadedUrl;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: uploadedUrls
    });
  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
};