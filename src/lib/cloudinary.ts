import { v2 as cloudinary } from "cloudinary";

/**
 * Singleton Cloudinary Server Configuration
 * 
 * Ensures credentials and upload signatures are handled strictly server-side.
 * Never expose CLOUDINARY_API_SECRET to the client bundle.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };
