import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandeler.js";
import jwt from "jsonwebtoken";
import {User} from '../models/User.model.js'

const jwtVerify = asyncHandler(async (req,res,next)=>{

  const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "");

  if(!token){
    throw new ApiError("Token is not found",400)
  }

  const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

 const user = await User.findById(decodedToken?._id);

 if(!user){
    throw new ApiError("User is not found",400)
 }

 req.user = user;
 next();
})

export {
    jwtVerify
}