import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true, // User-defined label (e.g., "Home", "Office")
        },
        city: {
            type: String,
            required: false,
        },
        area: {
            type: String,
        },
        country: {
            type: String,
        },
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
        alertThresholdAQI: { 
            type: Number, 
            default: 100 
        },
        locationType: {
            type: String,
            enum: ['home', 'work', 'school', 'other'],
            default: 'other',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate names for the same user
locationSchema.index({ userId: 1, name: 1 }, { unique: true });

const Location = mongoose.model('Location', locationSchema);

export default Location;
