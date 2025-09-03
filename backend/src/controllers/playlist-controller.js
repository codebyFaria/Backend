import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/Playlist.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiRespnse.js"
import asyncHandler from "../utils/asyncHandeler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name || !description) {
        throw new ApiError("Name and description are required", 400)
    }

    const playlist = await Playlist.create({
        name,
        description,
        videos: [],
        owner: req.user._id
    })

    if(!playlist) {
        throw new ApiError("Failed to create playlist", 500)
    }

    return res.status(200).json(
        new ApiResponse("Playlist created successfully", playlist, 200)
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!isValidObjectId(userId)){
        throw new ApiError("User is not found",400)
    }

    const getPlaylists = await Playlist.find({owner:userId})

    if(!getPlaylists){
        throw new ApiError("Playlist not found",500)
    }

    return res.status(200).json(
        new ApiResponse("User playlists are these",getPlaylists)
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!isValidObjectId(playlistId)){
        throw new ApiError("Playlist is not found",400)
    }

    const getPlaylist = await Playlist.findById({_id:playlistId})

    if(!getPlaylist){
        throw new ApiError("Playlist does not exist",404)
    }

    return res.status(200).json(
        new ApiResponse("User playlists are these",getPlaylist)
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError("Check your playlistId and videoId",400)
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { 
            $addToSet:
             { videos: videoId }

             },{ new: true }
    )

    if(!playlist){
        throw new ApiError("Playlist not found",500)
    }

    return res.status(200).json(
        new ApiResponse("Video added to playlist",playlist)
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

     if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError("Check your playlistId and videoId",400)
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { 
            $pull:
             { videos: videoId }
        },{ new: true }
    )

    if(!playlist){
        throw new ApiError("Playlist not found",500)
    }

    return res.status(200).json(
        new ApiResponse("Video removed from playlist",playlist)
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!isValidObjectId(playlistId)){
     throw new ApiError("Playlist not found",400)
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete({_id:playlistId})

    if(!deletedPlaylist){
        return res.status(200).json(
            new ApiResponse("Playlist is deleted successfully",200)
        )
    }

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

     if(!isValidObjectId(playlistId)){
     throw new ApiError("Playlist not found",400)
    }

    if(!name || !description){
        throw new ApiError("Name and Description is required")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate({_id:playlistId},
        {
            name,
            description
        },
        {new:true}
    )

    if(!updatedPlaylist){
        throw new ApiError("Failed to update playlist",500)
    }

    return res.status(200).json(
        new ApiResponse("Playlist updated successfully",updatedPlaylist)
    )

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}