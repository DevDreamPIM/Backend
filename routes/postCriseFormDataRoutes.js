import express from 'express';
import { createPostCriseFormData, getPostCriseFormDataByCriseId,  } from '../controllers/postCriseFormDataController.js';



const router = express.Router();

router.post('/',createPostCriseFormData);
router.get('/',getPostCriseFormDataByCriseId);

export default router; 