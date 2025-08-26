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
    getWatchHistory
} from '../controllers/user-controller.js';
import {publishAVideo,getVideoById,updateVideo,deleteVideo,togglePublishStatus,getAllVideos } from '../controllers/video-controller.js'
import { addComment, updateComment, deleteComment, getVideoComments } from '../controllers/comment-controller.js'
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

router.route("/add-comment/:videoId").post(jwtVerify, addComment);
router.route("/update-comment/:commentId").patch(jwtVerify, updateComment);
router.route("/delete-comment/:commentId").delete(jwtVerify, deleteComment);
router.route("/get-video-comments/:videoId").get(jwtVerify, getVideoComments);

export default router;
