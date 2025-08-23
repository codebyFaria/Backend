import asyncHandler from '../utils/asyncHandeler.js';
import uploadCloudinary from '../utils/Cloudinary.js';
import { User } from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiRespnse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'

const generateAccessTokenAndRefreshToken = async (userId) => {

  const user = await User.findById(userId);
  const accessToken = user.AccessGeneratorToken()
  const refreshToken = user.RefreshTokenGenerator()

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
}

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

const Login = asyncHandler(async (req, res) => {


  const { email, userName, Password } = req.body;

  if (!(email || userName)) {
    throw new ApiError("email or userName is required ", 400)
  }

  const user = await User.findOne({
    $or: [{ email, userName }]
  })

  if (!user) {
    throw new ApiError("Enter correct email or userName", 400)
  }


  console.log("Password from request:", req.body.Password);
  console.log("Hashed password from DB:", user.Password);

  const ValidPassword = await user.IsPasswordCorrect(Password);

  if (!ValidPassword) {
    throw new ApiError("Password is Incorrect", 401);
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  const logedInuser = await User.findById(user._id).select(
    "-Password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json({
      "user": logedInuser, refreshToken, accessToken
    })


})

const Logout = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined
    }
  },
    {
      new: true
    }

  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(
      new ApiResponse("User LogedOut", {}, 200)
    )

})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.headers?.authorization?.split(" ")[1];

  if (!incomingRefreshToken) {
    throw new ApiError("RefreshToken is not valid", 401)
  }

  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError("User is not authorized", 401)
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError("RefreshToken is not authorized", 401)
  }

  const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("refreshToken", newRefreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse({ newRefreshToken, accessToken })
    )




})

const updatePassword = asyncHandler(async (req, res) => {

  // Take oldPassword,newPassword from fontend
  // Validate --empty
  // check the old password match with db
  // generate new Password
  // return response
 
console.log("TOKEN:", req.cookies?.accessToken, req.header("Authorization"));
  const { oldPassword, newPassword } = req.body;


  if ([oldPassword, newPassword].some((field) => {
    if (field.trim() === "") return;
  })) {
    throw new ApiError("All fields are required", 400)
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError("User not found", 400);
  }

  const PasswordValidate = await user.IsPasswordCorrect(oldPassword);

  if (!PasswordValidate) {
    throw new ApiError("Password is not matching with old Password", 400);
  }

  user.Password = newPassword;
  await user.save({ validateBeforeSave: false });


  return res.status(200).json(
    new ApiResponse("Password updated successfully")
  );

})

const forgetPassword = asyncHandler(async (req, res) => {

  // Take data from frontend
  // Find User from db
  // Change Password
  // return response

  const { email, setPassword, confirmPassword } = req.body;

  const user = await User.findOne({email});

  if (!user) {
    throw new ApiError("User is not found", 404)
  }

  if (!(setPassword === confirmPassword)) return;

  user.Password = setPassword;
  console.log("Password set");
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse("Password updated successfully",{user})
  )

})

const getCurrentUser = asyncHandler(async (req, res) => {

   const user = await User.findById(req.user._id).select("-Password -refreshToken");

  return res.status(200).json
    (new ApiResponse("User fetched successfully", user, 200));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email
      }
    },
    { new: true }

  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateAvatar = asyncHandler(async (req, res) => {

  console.log("REQ FILE:", req.file);
  const avatarPath = req.file?.path;

  if (!avatarPath) {
    throw new ApiError("Avatar not found", 400)
  }

  const avatar = await uploadCloudinary(avatarPath);

  if (!avatar) {
    throw new ApiError("Avatar not found", 400)
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        "avatar": avatar.url
      }
    },
    {
      new: true
    }
  ).select(
    "-Password -refreshToken"
  )

  return res.status(200).json(
    new ApiResponse("Avatar updated successfully", user, 200)
  )

})

const updateCoverImage = asyncHandler(async (req, res) => {

  console.log("REQ FILE:", req.file);
  const coverImagePath = req.file?.path;

  if (!coverImagePath) {
    throw new ApiError("coverImage is missing", 400)
  }

  const coverImage = await uploadCloudinary(coverImagePath);

  if (!coverImage.url) {
    throw new ApiError("coverImage not found", 400)
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        "coverImage": coverImage.url
      }
    },
    {
      new: true
    }
  ).select(
    "-Password -refreshToken"
  )

  return res.status(200).json(
    new ApiResponse("coverImage updated successfully", user, 200)
  )

})

const getUserProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  // first check if user exists
  const user = await User.findOne({ userName: userName });

  if (!user) {
    throw new ApiError(404, "User not found till end");
  }

  // now run aggregation using user._id
  const channel = await User.aggregate([
    {
      $match: { _id: user._id }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "Channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "Subscriber",
        as: "subscribed"
      }
    },
    {
      $addFields: {
        totalSubscribers: { $size: "$subscribers" },
        totalSubscribed: { $size: "$subscribed" },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.Subscriber"] },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        FullName: 1,
        userName: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        totalSubscribers: 1,
        totalSubscribed: 1,
        isSubscribed: 1
      }
    }
  ]);

  res.status(200).json(new ApiResponse(200, channel[0], "User profile fetched successfully"));
});


const getWatchHistory = asyncHandler(async (req, res) => {

  const { _id } = req.user._id;

  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(_id)
      }
    },

    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: " Owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                    avatar: 1,
                    FullName: 1
                  }
                }
              ]
            }
          },
          {
           $addFields:{
            owner:{
            $first: "$owner"
            }
           } 
          }
        ]
      }
    }
  ])

  return res.status(200)
  .json(
    new ApiResponse("Watch History of User", user[0].watchHistory,200)
  )


})


export {
  register,
  Login,
  Logout,
  refreshAccessToken,
  updatePassword,
  forgetPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserProfile,
  getWatchHistory
};
