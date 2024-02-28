import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const postCriseFormDataSchema = new Schema({
    criseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seizure', required: true },
    selectedHours: { type: Number, required: false },
    selectedMinutes: { type: Number, required: false },
    visualAuraChecked: { type: Boolean, required: false },
    sensoryAuraChecked: { type: Boolean, required: false },
    auditoryAuraChecked: { type: Boolean, required: false },
    gustatoryOrOlfactoryAuraChecked: { type: Boolean, required: false },
    headachesChecked: { type: Boolean, required: false },
    excessiveFatigueChecked: { type: Boolean, required: false },
    abnormalMoodChecked: { type: Boolean, required: false },
    sleepDisturbancesChecked: { type: Boolean, required: false },
    concentrationDifficultiesChecked: { type: Boolean, required: false },
    increasedSensitivityChecked: { type: Boolean, required: false },
    triggerFactorsSelection: { type: [Boolean], required: false },
    injured: { type: Boolean },
    conscious: { type: Boolean },
    episodes: { type: Boolean },
    memoryDisturbances: { type: Boolean },
    assistance: { type: Boolean },
    advice: { type: Boolean },
    emotionalStateRating: { type: Number, required: false },
    recoveryRating: { type: Number, required: false },
    stressAnxietyRating: { type: Number, required: false },
    medicalCareRating: { type: Number, required: false },
    response1: { type: String, required: false },
    response2: { type: String, required: false },
    response3: { type: String, required: false },
}, {
    timestamps: true
});

export default model('PostCriseFormData', postCriseFormDataSchema);
