import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
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

    export{uploadImage};