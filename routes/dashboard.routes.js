import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {GetchannelVideos } from "../controllers/dashboard.controllers";

const router=Router();
router.use(verifyJWT);

router.route('/channelvideos/:channelId').get(GetchannelVideos);


export default router;