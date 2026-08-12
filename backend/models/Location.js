import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    alertThresholdAQI: { type: Number, default: 100 }
}, { timestamps: true });

export default mongoose.model('Location', locationSchema);
