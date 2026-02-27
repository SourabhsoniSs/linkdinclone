import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

const uploadOnCloudinary = async (filepath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  try {
    if (!filepath) return null;

    const uploadResult=await cloudinary.uploader.upload(filepath,{resource_type:"auto"})
     
      if(fs.existsSync(filepath))
         fs.unlinkSync(filepath)

      console.log(uploadResult.secure_url);
      
      return uploadResult
      
  } catch (error) {
    fs.unlinkSync(filepath)
    console.log(error);
    
  }
};


export default uploadOnCloudinary