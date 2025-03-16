import { Router } from "express";
import {UploadVideo,getAllVideos,getVideoById,updateVideo,DeleteVideo} from '../controllers/video.controllers.js';
import upload from "../middlewares/Multer.middleware.js";
const router=Router();

router.route('/').get(getAllVideos)
.post(
upload.fields([
{name:'Video',maxCount:1},{name:'Thumbnail',maxCount:1}]) ,
UploadVideo
);

router.route('/:Videoid').get(getVideoById)
.patch(upload.fields([{name:'Thumbnail',maxCount:1}]),updateVideo)
.delete(DeleteVideo);