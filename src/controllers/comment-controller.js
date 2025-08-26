import mongoose, {isValidObjectId} from "mongoose"
import {Comment} from "../models/Comment.model.js"
import {Video} from "../models/Video.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiRespnse.js"
import asyncHandler from "../utils/asyncHandeler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
 
    let filter = {}

    filter.video = videoId

    const comments = await Comment.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)

        if(!comments){
            throw new ApiError("No comments",404)
        }

    return res.status(200).json(
        new ApiResponse("Comments fetched successfully", 200, comments)
    )
})

const addComment = asyncHandler(async (req, res) => {

      console.log(req.body);
      console.log(req.params);

    const {content} = req.body;
    const {videoId} = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError("Invalid video id",400)
    }

    const video = await Video.findById({_id: videoId})

    if(!video){
        throw new ApiError("Video not found",400)
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    const owner = await Comment.aggregate([
        {
            $match: {
                _id: comment._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                content: 1,
                video: 1,
                "owner._id": 1,
                "owner.FullName": 1,
                "owner.avatar": 1
            }
        }
    ])

    if(!comment){
        throw new ApiError("Comment not found",404)
    }

    return res.status(201).json(
        new ApiResponse("Comment added successfully", 201, owner[0])
    )
})

const updateComment = asyncHandler(async (req, res) => {
   const {commentId} = req.params

   if(!isValidObjectId(commentId)){
   throw new ApiError("Comment does not exist",400)
   }

   const comment = await Comment.findByIdAndUpdate({_id: commentId},{
    $set: {
        content: req.body.content
    }
},
{
    new: true
})

if(!comment){
    throw new ApiError("Comment is not updated",400) 
}

return res.status(200).json(
    new ApiResponse("Comment is updated Successfully",200)
)

})

const deleteComment = asyncHandler(async (req, res) => {
   const {commentId} = req.params

   if(!isValidObjectId(commentId)){
    throw new ApiError("Comment does not exist",400)
   }

   const comment = await Comment.findByIdAndDelete({_id: commentId, })

   if(!comment){
    return res.status(200).json(
        new ApiResponse("Comment is deleted Successfully")
    )
   }
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }