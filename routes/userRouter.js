import express from 'express';
import { body } from 'express-validator';
import multer from '../middlewares/multer-config-user.js';
import { register,login,sendActivationCode } from '../controllers/userController.js';

const router = express.Router();

router.route('/')
.post( [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('firstName').isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),
    body('lastName').isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),
    body('phoneNumber').isLength({ min: 8,max:8 }).isNumeric().withMessage('Phone number must be at least 8 characters long')
], register);

router.route('/login').post([body("email").isEmpty().withMessage("email is required"), body("password").isEmpty().withMessage("password is required")],login);
router.route('/sendActivationCode').post(sendActivationCode);




export default router;