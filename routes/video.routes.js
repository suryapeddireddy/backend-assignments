import { Router } from "express";
import {publishaVideo,getAllVideos,getVideoById,updateVideo,DeleteVideo,watchVideo} from '../controllers/video.controllers.js'
import upload from "../middlewares/Multer.middleware.js";
import verifyJWT from '../middlewares/auth.middleware.js';
const router=Router();

router.route('/').get(getAllVideos)
.post(
upload.fields([
{name:'video',maxCount:1},{name:'thumbnail',maxCount:1}]) , verifyJWT,
publishaVideo
);

router.route('/:videoId') 
  .get(getVideoById)
  .patch(verifyJWT, upload.fields([{ name: 'thumbnail', maxCount: 1 }]), updateVideo)
  .delete(verifyJWT, DeleteVideo); // Added verifyJWT to delete as well

router.route('/:videId/watch', watchVideo);

export default router;