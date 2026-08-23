import multer from 'multer';
import CloudinaryStorage from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'airsense/avatars',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const uploadAvatar = multer({ storage: storage });

export default uploadAvatar;
