import express from 'express';
import {createDailyForm,getAllDailyForms,getDailyFormById,updateDailyForm,deleteDailyForm} from '../controllers/dailyFormController.js';   


const router = express.Router();

router.post('/',createDailyForm);
router.post('/',getAllDailyForms);
router.post('/:id',getDailyFormById);
router.post('/:id',updateDailyForm);
router.post('/:id',deleteDailyForm);

export default router;