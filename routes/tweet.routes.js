import { Router } from "express";
const router=Router();
import {createTweet,deleteTweet, getTweetbyId,getuserTweets,updateTweet} from '../controllers/tweet.controllers.js'
import verifyJWT from '../middlewares/auth.middleware.js'
router.use(verifyJWT);
router.route('/').post(createTweet).get(getTweetbyId);
router.route('/:id').delete(deleteTweet).patch(updateTweet);
router.route('/user').get(getuserTweets);