const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_development',
        allowed_formats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    },
});

const imageFileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'), false);
    }
    cb(null, true);
};

module.exports = {
    cloudinary,
    storage,
    imageFileFilter
}