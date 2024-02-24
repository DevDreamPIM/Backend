import express from 'express';
import { body } from 'express-validator';
import { addOne, getAllSensors, getAllSensorsOfAUser } from "../controllers/sensorController.js";

const router = express.Router();

router
    .route('/')
    .post(addOne)
    .get(getAllSensors);

router
    .route("/:user")
    .put(getAllSensorsOfAUser);


export default router;