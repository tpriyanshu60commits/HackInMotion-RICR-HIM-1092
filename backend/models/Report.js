import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if anonymous reporting is allowed, but let's link it
    type: { type: String, enum: ['Smoke', 'Waste burning', 'Dust', 'Industrial emissions', 'Other'], required: true },
    severity: { type: String, enum: ['Low', 'Moderate', 'High'], required: true },
    description: { type: String },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
