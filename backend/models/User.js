import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    healthProfile: {
        respiratorySensitivity: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Low' },
        outdoorActivityFrequency: { type: String, enum: ['Rarely', 'Sometimes', 'Often'], default: 'Sometimes' }
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
