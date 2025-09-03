import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import  ApiError  from "../utils/ApiError.js"
import  ApiResponse  from "../utils/ApiRespnse.js"
import   asyncHandler  from "../utils/asyncHandeler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError("Invalid video ID", 400)
    }

    const like = await Like.findOne({ video: videoId, likedBy: req.user._id })

    if (like) {
        await like.deleteOne({ _id: like._id })
        return res.status(200).json(
            new ApiResponse("Like is removed Successfully", 200)
        )
    }

    await Like.create({
        video: videoId,
        likedBy: req.user._id
    })

    return res.status(200).json(
        new ApiResponse("Video Liked", 200)
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError("comment not found", 400)
    }

    const like = await Like.findOne({ comment: commentId, likedBy: req.user._id })

    if (like) {
         await like.deleteOne({ _id: like._id })
        return res.status(200).json(
            new ApiResponse("Like is removed Successfully", 200)
        )
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user._id
    })

    return res.status(200).json(
        new ApiResponse("Comment Liked", 200)
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError("Tweet not found", 400)
    }

    const like = await Like.findOne({ tweet: tweetId, likedBy: req.user._id })

    if (like) {
         await like.deleteOne({ _id: like._id })
        return res.status(200).json(
            new ApiResponse("Like is removed Successfully", 200)
        )
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    })

    return res.status(200).json(
        new ApiResponse("Tweet Liked", 200)
    )

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: { $ne: null }
    }).populate("video")

    if (!likedVideos) {
        throw new ApiError("You dont like any video yet", 404)
    }




    return res.status(200).json(
        new ApiResponse("Liked videos fetched successfully", likedVideos, 200)
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}