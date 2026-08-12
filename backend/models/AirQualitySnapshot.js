import mongoose from 'mongoose';

const airQualitySnapshotSchema = new mongoose.Schema(
  {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location', // Can be null if it's a general city snapshot, but for MVP let's bind it to location searches or coordinates
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    aqi: {
      type: Number,
      required: true,
    },
    pm25: Number,
    pm10: Number,
    co: Number,
    no2: Number,
    so2: Number,
    o3: Number,
    temperature: Number,
    humidity: Number,
    wind: Number,
    weather: String,
    riskLevel: {
      type: String,
      enum: ['GOOD', 'MODERATE', 'UNHEALTHY', 'HIGH_RISK', 'HAZARDOUS'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient historical querying
airQualitySnapshotSchema.index({ city: 1, timestamp: -1 });
airQualitySnapshotSchema.index({ latitude: 1, longitude: 1, timestamp: -1 });

const AirQualitySnapshot = mongoose.model('AirQualitySnapshot', airQualitySnapshotSchema);

export default AirQualitySnapshot;
