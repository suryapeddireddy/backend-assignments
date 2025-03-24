import { Router } from "express";
import { deletecomment ,updatecomment,postcomment,getallComments,GetCommentId} from "../controllers/comment.controllers.js";
import verifyJWT from '../middlewares/auth.middleware.js'
const router=Router();

router.route('/video/:videoId').get(verifyJWT,getallComments).post(verifyJWT,postcomment);
router.route('/video/:commentId').patch(verifyJWT,updatecomment).delete(verifyJWT,deletecomment);
router.route('/video/c/:videoId').get(verifyJWT,GetCommentId);
export default router;