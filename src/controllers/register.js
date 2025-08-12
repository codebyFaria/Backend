import asyncHandler from '../utils/asyncHandeler.js';
import uploadCloudinary from '../utils/Cloudinary.js'
import {User} from '../models/User.model.js'
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiRespnse.js'
import upload from '../middlewares/multer.middleware.js';

const register = asyncHandler(async (req, res) => {

 
  // Take data from the frontEnd 
  // validate data -- no empty
  // Check if the user already exist or not -- email and username
  // Check for images Check for avatar
  // Upload them on cloudinary
  // Create User Object -- create entry in database
  // Check for creation
  // Remove Password and refresh token from response 
  // Return response

  const{userName, email,FullName, Password} = req.body

  console.log("Username :", userName,"Email :", email,"Fullname :",FullName,"Password :", Password)

  if([userName, email,FullName, Password].some((field)=>{
   return field?.trim() === ""
  })){
      console.log("All fields are required");
      throw new ApiError(400, "All fields are required");  
  }

const existUser = await User.findOne({
    $or : [{userName},{email}]
  })

  if(existUser){
    throw new ApiError(408,"User already exists" );
  }

 const avatarlocalPath =  req.files?.avatar[0].path;
 const coverImagelocalPath =  req.files?.coverImage[0].path;
 console.log("Avatar Local Path:", avatarlocalPath);
 console.log("Cover Image Local Path:", coverImagelocalPath);

 if(!avatarlocalPath){
    throw new ApiError(409," avatarlocalPath does not exist" );
 }

const avatar = await uploadCloudinary(avatarlocalPath)
console.log("Avatar URL:", avatar?.url || "nothing in avatar");
const coverImage = await uploadCloudinary(coverImagelocalPath)

if(!avatar){
  throw new ApiError(407," avatar does not exist" );
}

const user = await User.create({
  FullName,
  email,
  userName, 
  Password,
  avatar:avatar.url,
  coverImage:coverImage?.url || ""
})

const newUser = await User.findById(user._id).select(
  "-Password -refreshToken"
)
if(!newUser){
  throw new ApiError(403,"User creation failed");
}

return res.status(200).json(
 new ApiResponse( "User created successfully", newUser)
)




});



export default register;