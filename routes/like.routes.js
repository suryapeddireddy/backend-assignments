import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleVideoLike } from "../controllers/like.controllers.js";
import verifyJWT from '../middlewares/auth.middleware.js';
const router=Router();
router.use(verifyJWT);
//toggle Like on video
router.route('/video/:videoId', toggleVideoLike);
//toggle Like on comment
router.route('/comment/:commentId',toggleCommentLike);
//get all Liked videos
router.route('/', getLikedVideos);

export default router;