import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postCriseFormDataSchema = new Schema({
    criseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seizure', required: true },
    selectedHours: { type: Number, required: true },
    selectedMinutes: { type: Number, required: true },
    visualAuraChecked: { type: Boolean, required: true },
    sensoryAuraChecked: { type: Boolean, required: true },
    auditoryAuraChecked: { type: Boolean, required: true },
    gustatoryOrOlfactoryAuraChecked: { type: Boolean, required: true },
    headachesChecked: { type: Boolean, required: true },
    excessiveFatigueChecked: { type: Boolean, required: true },
    abnormalMoodChecked: { type: Boolean, required: true },
    sleepDisturbancesChecked: { type: Boolean, required: true },
    concentrationDifficultiesChecked: { type: Boolean, required: true },
    increasedSensitivityChecked: { type: Boolean, required: true },
    triggerFactorsSelection: { type: [Boolean], required: true },
    injured: { type: Boolean },
    conscious: { type: Boolean },
    episodes: { type: Boolean },
    memoryDisturbances: { type: Boolean },
    assistance: { type: Boolean },
    advice: { type: Boolean },
    emotionalStateRating: { type: Number, required: true },
    recoveryRating: { type: Number, required: true },
    stressAnxietyRating: { type: Number, required: true },
    medicalCareRating: { type: Number, required: true },
    response1: { type: String, required: true },
    response2: { type: String, required: true },
    response3: { type: String, required: true },
}, {
    timestamps: true
});

export default model('PostCriseFormData', postCriseFormDataSchema);
