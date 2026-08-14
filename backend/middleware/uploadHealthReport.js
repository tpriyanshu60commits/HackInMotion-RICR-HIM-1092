import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'airsense/health-reports',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
  },
});

const uploadHealthReport = multer({ storage: storage });

export default uploadHealthReport;
