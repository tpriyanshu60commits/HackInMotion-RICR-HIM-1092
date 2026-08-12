import mongoose from 'mongoose';

const communityReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: String,
      enum: [
        'smoke',
        'waste burning',
        'heavy pollution',
        'unusual odor',
        'dust',
        'industrial emission',
        'other',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'dismissed'],
      default: 'active',
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CommunityReport = mongoose.model('CommunityReport', communityReportSchema);

export default CommunityReport;
