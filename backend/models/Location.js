import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    user: {
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
      required: true,
    },
    area: {
      type: String,
    },
    country: {
      type: String,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
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
locationSchema.index({ user: 1, name: 1 }, { unique: true });

const Location = mongoose.model('Location', locationSchema);

export default Location;
