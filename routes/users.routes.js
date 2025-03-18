import { Router } from "express";
import { registerUser , LoginUser, LogoutUser} from "../controllers/user.controllers.js";
import upload from "../middlewares/Multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router=Router();

router.route('/register').post(upload.single('avatar'),
registerUser);
router.route('/login').post(LoginUser);
router.route('/logout').post(verifyJWT,LogoutUser);

export default router;