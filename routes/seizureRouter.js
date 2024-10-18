import express from 'express';
import { createSeizure, deleteSeizure, getSeizureById, getAllSeizures, updateSeizure,getNumbercrisesLastThreeMonths } from '../controllers/seizureController.js';


const router = express.Router();

// Routes
router.get('/numberCrisesLastThreeMonths', getNumbercrisesLastThreeMonths);
router.get('/', getAllSeizures);
router.get('/:id', getSeizureById);
router.post('/', createSeizure);
router.put('/:id', updateSeizure);
router.delete('/:id', deleteSeizure);



export default router;
