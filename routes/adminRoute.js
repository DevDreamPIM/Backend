import express from 'express';
import {
    addFeedback,
    getUsers,
    getFeedback
} from '../controllers/adminController.js';
const router = express.Router();

router.route('/addFeedback').post(addFeedback);
router.route('/getUsers').get(getUsers);
router.route('/getFeedback/:id').get(getFeedback);

export default router;