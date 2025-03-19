import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image function
const uploadImage = async (imageUrl, publicId) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(imageUrl, {
            public_id: publicId,
        });
        return uploadResult;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};

// Upload video function
const uploadVideo = async (videoUrl, publicId) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(videoUrl, {
            resource_type: 'video',  // Specifies that the file is a video
            public_id: publicId,
        });
        return uploadResult;
    } catch (error) {
        console.error('Error uploading video:', error);
    }
};

export { uploadImage, uploadVideo };
