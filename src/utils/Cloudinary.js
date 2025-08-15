
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Log to confirm Cloudinary is loading credentials
console.log("Cloudinary config loaded for:", cloudinary.config().cloud_name);

const uploadCloudinary = async (localPath) => {
  try {
    if (!localPath) {
      console.error("No file path provided for upload.");
      return null;
    }

    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });

     console.log("✅ Upload successful:", response);
     if (fs.existsSync(localPath)) {
       fs.unlinkSync(localPath);
     }
    return response;

    

  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);

    // Clean up local file on failure
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    return null;
  }
};

export default uploadCloudinary;
