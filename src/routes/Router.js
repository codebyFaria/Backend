import {Router} from 'express'
import {Login,Logout,register,refreshAccessToken} from '../controllers/user-controller.js';
import upload from '../middlewares/multer.middleware.js'
import {jwtVerify} from '../middlewares/jwtVerify.middleware.js'

const router = Router();

router.route('/register')
    .post(upload.fields(
        [
            {name:"avatar",maxCount:1},
            {name:"coverImage",maxCount:1}
        ]
    ), register);

    // Secured-routes
 router.route("/login").post(Login);
 
 router.route("/logout").post(jwtVerify,Logout);
 router.route("/refresh").post(refreshAccessToken);

export default router;
