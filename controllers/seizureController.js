// Importer le modèle Seizure
import Seizure from "../models/seizure.js";
import postCriseFormData from "../models/postCriseFormData.js";

export async function createSeizure(req, res) {
    const {formDataId, date, startTime, endTime, duration, location, type, emergencyServicesCalled, medicalAssistance, severity } = req.body;

    if (!date || !startTime || !endTime || !location || !type || !emergencyServicesCalled || !severity) {
        return res.status(400).json({ error: 'date, startTime, endTime, location, emergencyServicesCalled, severity, and type are required fields.' });
    }

    try {
        // Créer une nouvelle instance de crise
        const newSeizure = new Seizure({
            date,
            startTime,
            endTime,
            duration,
            location,
            type,
            emergencyServicesCalled,
            medicalAssistance,
            severity
        });

        // Enregistrer la crise dans la base de données
        const savedSeizure = await newSeizure.save();

        // Créer un nouveau formulaire associé à la crise
        const newFormData = new postCriseFormData({
            criseId: savedSeizure._id,
            // Autres champs de formulaire ici
        });

        // Enregistrer le formulaire dans la base de données
        const savedFormData = await newFormData.save();

        res.status(201).json({ seizure: savedSeizure, formData: savedFormData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Récupérer toutes les crises avec les formulaires associés
export async function getAllSeizures(req, res) {
    try {
        // Utiliser la méthode aggregate pour récupérer toutes les données de formulaire
        const seizures = await Seizure.aggregate([
            {
                $lookup: {
                    from: "postcriseformdatas",
                    localField: "_id",
                    foreignField: "criseId",
                    as: "formData"
                }
            }
        ]);
        res.status(200).json(seizures);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Récupérer une crise par son ID avec le formulaire associé
export async function getSeizureById(req, res) {
    const seizureId = req.params.id;
    try {
        const seizure = await Seizure.findById(seizureId);
        if (!seizure) {
            return res.status(404).json({ error: 'Seizure not found' });
        }
        
        // Récupérer les données du formulaire associées à cette crise
        const formData = await PostCriseFormData.findOne({ criseId: seizureId });
        
        // Retourner les détails de la crise avec les données de formulaire
        res.status(200).json({ seizure, formData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



/*
// Mettre à jour une crise
export async function updateSeizure(req, res) {
    const seizureId = req.params.id;
    const { date, startTime, endTime, duration, location, symptoms, preSymptoms, emergencyServicesCalled, medicalAssistance, severity, type } = req.body;

    try {
        const updatedSeizure = await Seizure.findByIdAndUpdate(seizureId, {
            date,
            startTime,
            endTime,
            duration,
            location,
            type,
            emergencyServicesCalled,
            medicalAssistance,
            severity,
            //formDataId
            
        }, { new: true }); // Retourner la crise mise à jour
        res.status(200).json(updatedSeizure);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}*/

// Supprimer une crise et son formulaire associé
export async function deleteSeizure(req, res) {
    const seizureId = req.params.id;

    // Trouver la crise par son ID et supprimer
    try {
        const deletedSeizure = await Seizure.findByIdAndDelete(seizureId);
        // Supprimer également le formulaire associé
        await PostCriseFormData.findOneAndDelete({ criseId: seizureId });
        res.status(200).json(deletedSeizure);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
