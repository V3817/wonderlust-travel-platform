const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wonderlust/listings', // Folder name in Cloudinary
        allowedFormats: ['jpeg', 'jpg', 'png', 'webp'], // Allowed image formats
        transformation: [
            { width: 1200, height: 800, crop: 'limit' }, // Resize images
            { quality: 'auto' } // Auto optimize quality
        ]
    }
});

module.exports = {
    cloudinary,
    storage
};
