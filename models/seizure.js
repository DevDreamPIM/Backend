import mongoose from "mongoose";

const { Schema, model } = mongoose;

const seizureSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    startTime: {
        type: String,
        required: true,
        default: Date.now
    },
    endTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number
    },
    location: {
        type: String,
        required: true
    },
    symptoms: {
        type: [String],
        required: true
    },
    preSymptoms: {
        type: String,
        required: true
    },
    emergencyServicesCalled: {
        type: Boolean,
        default: false
    },
    medicalAssistance: {
        type: Boolean,
        required: false
    },
    severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        default: 'mild'
    },
    type: {
        type: String,
        enum: ['partial', 'generalized', 'absence'],
        required: true
    }
},
{
    timestamps: true
});

seizureSchema.pre('save', function (next) {
    if (this.startTime && this.endTime) {
      const durationInMillis = new Date(this.endTime) - new Date(this.startTime);
      this.duration = durationInMillis / 1000; 
    }
    next();
});

export default model('Seizure', seizureSchema);
