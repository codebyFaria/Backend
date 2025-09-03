import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/Video.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiRespnse.js"
import asyncHandler from "../utils/asyncHandeler.js"
import uploadCloudinary from "../utils/Cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    // 1. Build filter object
    let filter = {};
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },   // search in title
            { description: { $regex: query, $options: "i" } } // search in description
        ];
    }
    if (userId) {
        filter.Owner = userId;  // filter by owner
    }

    // 2. Sorting
    let sort = {};
    sort[sortBy] = sortType === "asc" ? 1 : -1;

    // 3. Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const perPage = parseInt(limit);

    // 4. Fetch videos
    const videos = await Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(perPage);

    // 5. Get total count (for pagination info)
    const totalVideos = await Video.countDocuments(filter);

    // 6. Send response
    res.status(200).json({
        success: true,
        page: parseInt(page),
        limit: perPage,
        totalVideos,
        totalPages: Math.ceil(totalVideos / perPage),
        videos
    });
});


const publishAVideo = asyncHandler(async (req, res) => {

// Take data from frontend
// validate -- empty check
// Take video file from frontend and upload on Cloudinary
// create in database
// return response

    console.log(req.body);
    const { Title, Description} = req.body;

    if(!Title || !Description){
        throw new ApiError("title or description is empty",400)
    }

    const videoExists = await Video.findOne({ title: Title });

    if (videoExists) {
        throw new ApiError("Video with this title already exists", 400);
    }

  console.log(req.files);
    const videoFilePath = req.files?.video?.[0]?.path;
    const thumbnailPath = req.files?.thumbnail?.[0]?.path;

    if(!videoFilePath){
        throw new ApiError("video not found",400)
    }

    if(!thumbnailPath){
        throw new ApiError("thumbnail not found",400)
    }

    const VideoFile =  await uploadCloudinary(videoFilePath);
    const thumbnailFile =  await uploadCloudinary(thumbnailPath);

    if(!VideoFile){
        throw new ApiError("VideoFile is not uploaded on Cloudinary", 400)
    }

    if(!thumbnailFile){
        throw new ApiError("thumbnailFile is not uploaded on Cloudinary", 400)
    }



    const video = await Video.create(
        {
            title: Title,
            description: Description,
            videoUrl: VideoFile?.url,
            thumbnailUrl: thumbnailFile?.url,
            IsPublic: true,
            duration: VideoFile?.duration,
            Owner: req.user._id,
            views: 0
        }
    ) 

    if(!video){
        throw new ApiError("Video is not created", 400)
    }

    const videoDetails = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(video._id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "Owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                videoUrl: 1,
                thumbnailUrl: 1,
                IsPublic: 1,
                duration: 1,
                owner: {
                    _id: "$owner._id",
                    name: "$owner.userName",
                    email: "$owner.email"
                }
            }
        }
    ]);

    if (!videoDetails || videoDetails.length === 0) {
        throw new ApiError("Video aggregation not found", 400);
    }



    return res.status(200).json(
        new ApiResponse("Video is successfully published", 200, videoDetails[0])
    )

})

const views = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError("Invalid video id",400)
    }

    const video = await Video.findById({_id: videoId})

    if(!video){
        throw new ApiError("Video not found",400)
    }

    video.views += 1
    await video.save()

    return res.status(200).json(
        new ApiResponse("Video views incremented", 200, video)
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    console.log(req.params);
    console.log(req.user);
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError("Invalid video id",400)
    }

    const video = await Video.findById({_id: videoId})

    if(!video){
        throw new ApiError("Video not found",400)
    }

    return res.status(200).json(
        new ApiResponse("Video is found successfully", video)
    )
    
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError("Video not found",400)
    }

    console.log(req.body);
    const {title,description} = req.body;

    if(!title || !description){
         throw new ApiError("Title and description not found",400)
    }

    console.log(req.file);
    const thumbnailPath = req.file?.path

    if(!thumbnailPath){
        throw new ApiError("thumbnailPath not found",400)
    }

    const thumbnailFile =  await uploadCloudinary(thumbnailPath);

    if(!thumbnailFile){
       throw new ApiError("thumbnailFile not exist on cloudinary",400)  
    }

    const updatedDetail = await Video.findByIdAndUpdate(videoId,{
        $set: {
            title,
            description,
            thumbnail: thumbnailFile?.url
        },
    }, {
        new: true
    }) 

    if(!updatedDetail){
        throw new ApiError("Video not updated",400)
    }

    return res.status(200).json(
        new ApiResponse("Video is updated successfully",200,updatedDetail)
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!isValidObjectId(videoId)){
       throw new ApiError("Video not found",200) 
    }

   const video = await Video.findByIdAndDelete({_id: videoId})


   if(!video){

   return res.status(200).json(
    new ApiResponse("Video is deleted successfully",200)
   )
 }

   

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    // Find video for which publish status needs to be toggled
    // toggle the status 
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError("video not found",200)
    }

    const video = await Video.findById({_id: videoId})

    if(!video){
        throw new ApiError("video not found",200)
    }

   

    const updatedVideo = await Video.findByIdAndUpdate(videoId,
        {
            $set:{
             "IsPublic": !video.IsPublic,
            } 
        },{
            new: true
        }
    )

    if(!updatedVideo){
        throw new ApiError("Video not found",200)
    }

    console.log(updatedVideo)

    return res.status(200).json(
        new ApiResponse("Video publish status toggled successfully", 200,updatedVideo)
    )
    
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    views
}