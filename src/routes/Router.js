import { Router } from 'express'
import {
    Login,
    Logout,
    register,
    refreshAccessToken,
    updatePassword,
    getCurrentUser,
    forgetPassword,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getUserProfile,
    getWatchHistory,
    addVideoToWatchHistory
} from '../controllers/user-controller.js';


import {
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getAllVideos 
}from '../controllers/video-controller.js'


import {
     addComment, 
     updateComment, 
     deleteComment, 
     getVideoComments 
} from '../controllers/comment-controller.js'


import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} from '../controllers/like-controller.js'


import{
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from '../controllers/playlist-controller.js'

import{
    getChannelStats,
    getChannelVideos
} from '../controllers/dashboard-controller.js'

import { getSubscribedChannels,
        toggleSubscription,
        getUserChannelSubscribers
     } from '../controllers/subscription-controller.js';


import upload from '../middlewares/multer.middleware.js'
import { jwtVerify } from '../middlewares/jwtVerify.middleware.js'


const router = Router();

router.route('/register')
    .post(upload.fields(
        [
            { name: "avatar", maxCount: 1 },
            { name: "coverImage", maxCount: 1 }
        ]
    ), register);

// Secured-routes
router.route("/login").post(Login);

router.route("/logout").post(jwtVerify, Logout);
router.route("/refresh").post(refreshAccessToken);
router.route("/update-password").post(jwtVerify, updatePassword);
router.route("/forget-password").post(forgetPassword);
router.route("/update-account-details").patch(jwtVerify, updateAccountDetails);
router.route("/get-current-user").get(jwtVerify, getCurrentUser)

router.route('/update-avatar')
    .patch(jwtVerify, upload.single("avatar"), updateAvatar);

router.route('/update-cover-image')
    .patch(jwtVerify, upload.single("coverImage"), updateCoverImage);

router.route("/c/:userName").get(jwtVerify, getUserProfile);
router.route("/get-watch-history").get(jwtVerify, getWatchHistory);
router.route("/add-to-watch-history/:videoId").patch(jwtVerify, addVideoToWatchHistory);

router.route("/publish-video").post(jwtVerify, upload.fields(
    [
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]
), publishAVideo);

router.route("/get-video/:videoId").get(jwtVerify, getVideoById);

router.route ("/update/:videoId").patch(jwtVerify,upload.single("thumbnail"),updateVideo);
router.route("/delete/:videoId").delete(jwtVerify,deleteVideo);
router.route("/publish/:videoId").patch(jwtVerify,togglePublishStatus);
router.route("/getAllvideos").get(jwtVerify,getAllVideos);
router.route("/toggle/:videoId").patch(jwtVerify,togglePublishStatus);
router.route("/views/:videoId").patch(jwtVerify,views);

router.route("/add-comment/:videoId").post(jwtVerify, addComment);
router.route("/update-comment/:commentId").patch(jwtVerify, updateComment);
router.route("/delete-comment/:commentId").delete(jwtVerify, deleteComment);
router.route("/get-video-comments/:videoId").get(jwtVerify, getVideoComments);


router.route("/toggle-like/:videoId").patch(jwtVerify, toggleVideoLike);
router.route("/toggle-comment/:commentId").patch(jwtVerify, toggleCommentLike);
router.route("/toggle-tweet/:tweetId").patch(jwtVerify, toggleTweetLike);
router.route("/get-liked-videos").get(jwtVerify, getLikedVideos);

router.route("/create-playlist").post(jwtVerify, createPlaylist);
router.route("/get-user-playlists/:userId").get(jwtVerify, getUserPlaylists);
router.route("/get-playlist/:playlistId").get(jwtVerify, getPlaylistById);
router.route("/add-video-to-playlist/:playlistId/:videoId").patch(jwtVerify, addVideoToPlaylist);
router.route("/remove-video-from-playlist/:playlistId/:videoId").patch(jwtVerify, removeVideoFromPlaylist);
router.route("/delete-playlist/:playlistId").delete(jwtVerify, deletePlaylist);
router.route("/update-playlist/:playlistId").patch(jwtVerify, updatePlaylist);


router.route("/toggle-subscription/:channelId").patch(jwtVerify, toggleSubscription);
router.route("/get-channel-subscribers/:channelId").get(jwtVerify, getUserChannelSubscribers);
router.route("/get-subscribed-channels/:subscriberId").get(jwtVerify, getSubscribedChannels);

router.route("/get-channel-stats/:channelId").get(jwtVerify, getChannelStats);
router.route("/get-channel-videos/:channelId").get(jwtVerify, getChannelVideos);

export default router;
