import mongoose from 'mongoose';

const aiHealthReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    environmentSnapshot: {
      type: Object, // Stores AQI, pollutants, weather at generation time
      default: {},
    },
    riskLevel: {
      type: String,
      enum: ['Good', 'Moderate', 'Unhealthy', 'Hazardous'],
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    keyConcern: {
      type: String,
      required: true,
    },
    dosAndDonts: {
      type: [String],
      default: [],
    },
    symptomWatch: {
      type: [String],
      default: [],
    },
    bestTimeWindow: {
      type: String,
      default: '',
    },
    cityComparisonNote: {
      type: String,
      default: null,
    },
    rawModelResponse: {
      type: String, // Store for debugging/history
      default: '',
    },
  },
  {
    timestamps: true, // Will provide createdAt/updatedAt
  }
);

// TTL index to automatically delete reports after 60 days
aiHealthReportSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 24 * 60 * 60 });

const AIHealthReport = mongoose.model('AIHealthReport', aiHealthReportSchema);

export default AIHealthReport;
