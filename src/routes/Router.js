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

export default router;
