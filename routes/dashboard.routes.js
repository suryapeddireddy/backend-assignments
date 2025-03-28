import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {GetchannelVideos ,GetAllUserComments} from "../controllers/dashboard.controllers";

const router=Router();
router.use(verifyJWT);

router.route('/channelvideos/:channelId').get(GetchannelVideos);
router.route('/channelcomments').get(GetAllUserComments);


export default router;