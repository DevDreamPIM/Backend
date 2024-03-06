import PostCriseFormData from '../models/postCriseFormData.js';
import seizure from '../models/seizure.js';


// Créer un formulaire de crise
export const createPostCriseFormData = async (req, res) => {
  try {
    const {
      criseId, 
      selectedHours,
      selectedMinutes,
      visualAuraChecked,
      sensoryAuraChecked,
      auditoryAuraChecked,
      gustatoryOrOlfactoryAuraChecked,
      headachesChecked,
      excessiveFatigueChecked,
      abnormalMoodChecked,
      sleepDisturbancesChecked,
      concentrationDifficultiesChecked,
      increasedSensitivityChecked,
      triggerFactorsSelection,
      injured,
      conscious,
      episodes,
      memoryDisturbances,
      assistance,
      advice,
      emotionalStateRating,
      recoveryRating,
      stressAnxietyRating,
      medicalCareRating,
      response1,
      response2,
      response3,
    } = req.body;

    const newFormData = new PostCriseFormData({
      criseId, 
      selectedHours,
      selectedMinutes,
      visualAuraChecked,
      sensoryAuraChecked,
      auditoryAuraChecked,
      gustatoryOrOlfactoryAuraChecked,
      headachesChecked,
      excessiveFatigueChecked,
      abnormalMoodChecked,
      sleepDisturbancesChecked,
      concentrationDifficultiesChecked,
      increasedSensitivityChecked,
      triggerFactorsSelection,
      injured,
      conscious,
      episodes,
      memoryDisturbances,
      assistance,
      advice,
      emotionalStateRating,
      recoveryRating,
      stressAnxietyRating,
      medicalCareRating,
      response1,
      response2,
      response3,
    });

    await newFormData.save();
    res.status(201).json(newFormData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Récupérer le formulaire de crise par l'ID de la crise
export const getPostCriseFormDataByCriseId = async (req, res) => {
    const criseId = req.params.id;
    try {
      const formData = await PostCriseFormData.findOne({ id: criseId });
      if (!formData) {
        return res.status(404).json({ message: 'Form data for the specified crise not found' });
      }
      res.status(200).json(formData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  

// Mettre à jour les données du formulaire de crise
export const updatePostCriseFormData = async (req, res) => {
  const { id } = req.params; // L'id du formulaire de crise à mettre à jour
  const updateData = req.body; // Les nouvelles données du formulaire

  try {
    const formData = await PostCriseFormData.findByIdAndUpdate(id, updateData, { new: true });

    if (!formData) {
      return res.status(404).json({ message: 'Form data not found' });
    }

    // Si la mise à jour a réussi, mettez à jour également la référence dans la crise associée
    // Supposons que vous ayez un champ `formDataId` dans le modèle de crise pour stocker l'ID du formulaire
    const seizure = await seizure.findOneAndUpdate({ formDataId: id }, { formDataId: formData._id }, { new: true });

    res.status(200).json({ formData, seizure });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  
