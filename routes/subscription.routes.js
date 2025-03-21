import { Router } from "express";
import verifyJWT from  '../middlewares/auth.middleware.js'
import {
    getUserSubscriptions,  // Gets channels a user is subscribed to
    getChannelSubscribers, // Gets subscribers of a channel
    handleSubscription,    // Toggles subscription
} from '../controllers/subscription.controllers.js'
const router =Router();

router.use(verifyJWT); // middleware,so all can use later
router.route('/user/:userId').get(getUserSubscriptions);
router.route('/channel/:channelId').get(getChannelSubscribers).patch(handleSubscription);




export default router;