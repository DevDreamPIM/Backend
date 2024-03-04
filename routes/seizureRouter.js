import express from 'express';
import { createSeizure, deleteSeizure,getSeizureById, getAllSeizures } from '../controllers/seizureController.js';
// Importer les fonctions du contrôleur Seizure

const router = express.Router();

// Routes
router.get('/', getAllSeizures);
router.get('/:id', getSeizureById);
router.post('/', createSeizure);
//router.put('/:id', updateSeizure);
router.delete('/:id', deleteSeizure);


export default router;
