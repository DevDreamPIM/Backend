// Importer le modèle Seizure
import Seizure from "../models/seizure.js";

// Créer une nouvelle crise
export async function createSeizure(req, res) {
    const { date, startTime, endTime, duration, location, symptoms, preSymptoms, emergencyServicesCalled, medicalAssistance, severity, type } = req.body;

    // Valider les données d'entrée (vérifier si les champs requis sont présents)
    if (!date || !startTime || !endTime || !location || !emergencyServicesCalled || !severity || !type) {
        return res.status(400).json({ error: 'date, startTime, endTime, location, emergencyServicesCalled, severity, and type are required fields.' });
    }

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
    try {
        const savedSeizure = await newSeizure.save();
        res.status(201).json(savedSeizure);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Récupérer toutes les crises
export async function getAllSeizures(req, res) {
    try {
        const seizures = await Seizure.find();
        res.status(200).json(seizures);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export async function getSeizureById(req, res) {
    const seizureId = req.params.id;
    try {
        const seizure = await Seizure.findById(seizureId);
        if (!seizure) {
            return res.status(404).json({ error: 'Seizure not found' });
        }
        res.status(200).json(seizure);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


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
            
        }, { new: true }); // Retourner la crise mise à jour
        res.status(200).json(updatedSeizure);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Supprimer une crise
export async function deleteSeizure(req, res) {
    const seizureId = req.params.id;

    // Trouver la crise par son ID et supprimer
    try {
        const deletedSeizure = await Seizure.findByIdAndDelete(seizureId);
        res.status(200).json(deletedSeizure);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
