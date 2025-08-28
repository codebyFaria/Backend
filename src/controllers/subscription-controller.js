import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/User.model.js"
import { Subscription } from "../models/Subscription.mode.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiRespnse.js"
import asyncHandler from "../utils/asyncHandeler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!isValidObjectId(channelId)){
        throw new ApiError("Channel's Id is incorrect",404)
    }

    const subscribed = await Subscription.findOne({Subscriber:req.user._id})
    
    if(subscribed){
        await Subscription.deleteOne(subscribed._id);
        return res.status(200).json(
            new ApiResponse("You Unsubscribed the channel",200)
        )
    }

    const subscription = await Subscription.create({
       Channel:channelId,
        Subscriber:req.user._id 
    }) 

    if(!subscription){
        throw new ApiError("Subscription not found",404)
    }

     return res.status(200).json(
            new ApiResponse("You Subscribed the channel",200)
        )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

     if(!isValidObjectId(channelId)){
        throw new ApiError("Channel's Id is incorrect",404)
    }

    const subscribers = await Subscription.find({Channel:channelId}).populate("Subscriber");


    if(!subscribers.length){
       return res.status(200).json(
        new ApiResponse("no subscribers",)
    )
    }

    return res.status(200).json(
        new ApiResponse("Subscribers are here",subscribers)
    )

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

 if(!isValidObjectId(subscriberId)){
        throw new ApiError("Channel's Id is incorrect",404)
    }

    const subscribedChannel = await Subscription.find({Subscriber:subscriberId}).populate("Channel");
    console.log(subscribedChannel);

    if(!subscribedChannel.length ){
       throw new ApiError("Subscribers not found",500)
    }

    return res.status(200).json(
        new ApiResponse("Subscribers are here",subscribedChannel)
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}