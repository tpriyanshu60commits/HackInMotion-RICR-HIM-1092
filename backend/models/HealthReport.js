import mongoose from 'mongoose';

const healthReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportImageUrl: {
      type: String,
      required: true,
    },
    reportImagePublicId: {
      type: String,
      required: true,
    },
    conditions: {
      type: [String],
      default: [],
    },
    customIssue: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // This gives createdAt automatically
  }
);

const HealthReport = mongoose.model('HealthReport', healthReportSchema);
export default HealthReport;
