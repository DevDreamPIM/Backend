import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: false
    },
    resetCode: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
        enum: ['patient', 'doctor'],
    },

    numP: {
        type: [Number],
        required: false,

    },
    weight:{
        type: Number,
        required: false,
    },

    height:{
        type: Number,
        required: false,
    },
    doctor:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
},
{
    timestamps: true
});

export default model('User', userSchema);
