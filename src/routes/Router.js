import {Router} from 'express'
import register from '../controllers/register.js';
import upload from '../middlewares/multer.middleware.js'

const router = Router();

router.route('/register')
    .post(upload.fields(
        [
            {name:"avatar",maxCount:1},
            {name:"coverPhoto",maxCount:1}
        ]
    ), register);

export default router;
