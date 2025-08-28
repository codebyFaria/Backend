import mongoose from "mongoose"
import {Video} from "../models/Video.model.js"
import {Subscription} from "../models/Subscription.model.js"
import {Like} from "../models/Like.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiRespnse.js"
import asyncHandler from "../utils/asyncHanedler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.params.id;

    const totalViews = await Video.aggregate([
        { $match: { channel: mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);

    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
    const totalVideos = await Video.countDocuments({ Owner: channelId });
    const totalLikes = await Like.countDocuments({ video: { $in: await Video.find({ Owner: channelId }).select("_id") } });

    res.status(200).json(new ApiResponse({
        totalViews: totalViews[0]?.totalViews || 0,
        totalSubscribers,
        totalVideos,
        totalLikes
    }));
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} = req.params

const videos = await Video.find({Owner:channelId})

if(!videos){
   throw new ApiError("You have not upload any video",400)
}

 return res.status(200).json(
        new ApiResponse("Videos fetched successfully", videos)
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }