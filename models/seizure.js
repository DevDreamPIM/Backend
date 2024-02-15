import mongoose from "mongoose";

const { Schema, model } = mongoose;

const seizureSchema = new Schema({
    realSeizure: {
        type: Boolean,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    firstSigns: {
        type: Date,
        required: true
    },
    preSymptoms: {
        type: String,
        required: true
    },
    tookMedication: {
        type: Boolean,
        required: true
    },
    ingury: {
        type: String,
        required: true
    },
    postDisconfort: {
        type: String,
        required: true
    },
    otherDescription: {
        type: String,
        required: true
    },
    medicalAssistance: {
        type: Boolean,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
},
{
    timestamps: true
});

export default model('Seizure', seizureSchema);
