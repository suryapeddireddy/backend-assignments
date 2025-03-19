import { Router } from "express";
import {publishaVideo,getAllVideos,getVideoById,updateVideo,DeleteVideo} from '../controllers/video.controllers.js'
import upload from "../middlewares/Multer.middleware.js";
import verifyJWT from '../middlewares/auth.middleware.js';
const router=Router();

router.route('/').get(getAllVideos)
.post(
upload.fields([
{name:'video',maxCount:1},{name:'thumbnail',maxCount:1}]) , verifyJWT,
publishaVideo
);

router.route('/:Videoid').get(getVideoById)
.patch(upload.fields([{name:'Thumbnail',maxCount:1}]),updateVideo)
.delete(DeleteVideo);


export default router;