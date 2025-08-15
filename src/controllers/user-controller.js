import asyncHandler from '../utils/asyncHandeler.js';
import uploadCloudinary from '../utils/Cloudinary.js';
import { User } from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiRespnse.js';

const register = asyncHandler(async (req, res) => {
  const { userName, email, FullName, Password } = req.body;

  // Validate required fields
  if ([userName, email, FullName, Password].some(field => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existUser) {
    throw new ApiError(408, "User already exists");
  }

  // File paths
  const avatarlocalPath = req.files?.avatar?.[0]?.path;
  const coverImagelocalPath = req.files?.coverImage?.[0]?.path || "";

  if (!avatarlocalPath) {
    throw new ApiError(409, "Avatar is required");
  }

  // Upload images to Cloudinary
  const avatar = await uploadCloudinary(avatarlocalPath);
  const coverImage = coverImagelocalPath
    ? await uploadCloudinary(coverImagelocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(407, "Avatar upload failed");
  }

  // Create user
  const user = await User.create({
    FullName,
    email,
    userName,
    Password,
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
  });

  const newUser = await User.findById(user._id).select("-Password -refreshToken");
  if (!newUser) {
    throw new ApiError(403, "User creation failed");
  }

  return res.status(200).json(
    new ApiResponse("User created successfully", newUser)
  );
});

const Login = asyncHandler(async(req,res)=>{

  const generateAccessTokenAndRefreshToken = async (userId)=>{

   const user = await User.findById(userId);
   const accessToken = user.AccessGeneratorToken()
   const refreshToken = user.RefreshTokenGenerator()

   user.refreshToken = refreshToken;
   await user.save({ validateBeforeSave: false });

   return{accessToken,refreshToken};
  }
  const{email,userName,Password} = req.body;

  if(!(email || userName)){
    throw new ApiError("email or userName is required ",400)
  }

const user = await User.findOne({
    $or:[{email,userName}]
  })

  if(!user){
    throw new ApiError("Enter correct email or userName", 400)
  }

const ValidPassword =  user.IsPasswordCorrect(Password);

if(!ValidPassword){
  throw new ApiError("Password is Incorrect",401);
}

const{accessToken,refreshToken} =await generateAccessTokenAndRefreshToken(user._id);

const logedInuser = await User.findById(user._id).select(
  -Password -refreshToken
);

const options = {
  httpOnly:true,
  secure:true
}

return res
.status(200)
.cookie("refreshToken",refreshToken,options)
.cookie("accessToken",accessToken,options)
.json({
  "user":logedInuser,refreshToken,accessToken
})


})

const Logout = asyncHandler(async(req,res)=>{

 await User.findByIdAndUpdate(req.user._id,{
  $set :{
   refreshToken:undefined
  }
},
  {
    new:true
  }
 
 )

 const options = {
  httpOnly:true,
  secure:true
}

return res
.status(200)
.clearCookie("refreshToken",options)
.clearCookie("accessToken",options)
.json(
  new ApiResponse("User LogedOut",{},200)
)

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
 const incomingRefreshToken = req.cookie?.refreshToken || header.body.Authorization;

 if(!incomingRefreshToken){
  throw new ApiError("RefreshToken is not valid",401)
 }

  const decodedToken =  jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decodedToken._id);

  if(!user){
    throw new ApiError("User is not authorized",401)
  }

  if(incomingRefreshToken !== user?.refreshToken ){
    throw new ApiError("RefreshToken is not authorized",401)
  }

  const{accessToken,newRefreshToken} = generateAccessTokenAndRefreshToken (user._id);

  const options = {
    httpOnly:true,
    secure:true
  }
  
  return res
  .status(200)
  .cookie("refreshToken",newRefreshToken,options)
  .cookie("accessToken",accessToken,options)
  .json(
    new ApiResponse({newRefreshToken,accessToken})
  )


 

})



export {
  register,
  Login,
  Logout,
  refreshAccessToken 
};
