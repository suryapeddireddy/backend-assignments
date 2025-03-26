import { Router } from "express";
import verifyJWT from '../middlewares/auth.middleware.js';
import {AddVideotoPlayList,RemoveVideofromPlayList,CreatePlayList,UpdatePlayList,DeletePlayList,GetPlayListById,GetUserPlayLists} from "../controllers/playlist.controllers.js";
const router=Router();

router.route(verifyJWT);
router.route('/').post(CreatePlayList).get(GetPlayListById);
router.route('/:playListId').patch(UpdatePlayList).delete(DeletePlayList);
router.route('/:userId').get(GetUserPlayLists);
router.route('/add/:playListId/:videoId').post(AddVideotoPlayList).patch(RemoveVideofromPlayList);
export default router;