import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  try {
    console.log('Testing cloudinary connection...');
    const result = await cloudinary.uploader.upload('https://via.placeholder.com/150', {
      folder: 'airsense_reports'
    });
    console.log('Success!', result.secure_url);
  } catch (error) {
    console.error('Cloudinary Error:', error);
  }
}

testUpload();
