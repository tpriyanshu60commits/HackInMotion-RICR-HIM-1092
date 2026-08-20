import mongoose from 'mongoose';

const aiHealthProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    ageGroup: {
      type: String,
      enum: ['child', 'adult', 'senior'],
      required: true,
    },
    conditions: {
      type: [String],
      default: [],
    },
    sensitivityLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    outdoorActivity: {
      type: String,
      enum: ['jogging', 'commute', 'sports', 'mostly indoors'],
      default: 'mostly indoors',
    },
    activityTimeWindow: {
      type: String,
      default: '',
    },
    medicationReminder: {
      type: Boolean,
      default: false,
    },
    primaryCity: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const AIHealthProfile = mongoose.model('AIHealthProfile', aiHealthProfileSchema);

export default AIHealthProfile;
