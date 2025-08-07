import {v2} from "cloudinary";
import fs from "fs";

 cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET
    });

    const uploadCloudinary = async(localPath)=>{
        try{
        if(!localPath) return
        
       const response = await cloudinary.uploader.upload(localPath,
            {
                resource_type:"auto"
            })
            console.log("Upload successful:", response.url);
            return response;
        }
        catch(error){
        fs.unlinkSync(localPath);
        return null;
        }
    }


    export default uploadCloudinary