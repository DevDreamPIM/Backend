import PostCriseFormData from '../models/postCriseFormData.js';

// Créer un formulaire de crise
export const createPostCriseFormData = async (req, res) => {
  try {
    const { id, selectedHours, selectedMinutes, visualAuraChecked, sensoryAuraChecked, auditoryAuraChecked, gustatoryOrOlfactoryAuraChecked, headachesChecked, excessiveFatigueChecked, abnormalMoodChecked, sleepDisturbancesChecked, concentrationDifficultiesChecked, increasedSensitivityChecked, triggerFactorsSelection, injured, conscious, episodes, memoryDisturbances, assistance, advice, emotionalStateRating, recoveryRating, stressAnxietyRating, medicalCareRating, response1, response2, response3 } = req.body;

    const newFormData = new PostCriseFormData({
      id,
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
      response3
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
  
