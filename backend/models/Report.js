import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  category: { type: String, enum: ['garbage', 'water', 'air'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  photoUrl: { type: String },
  createdBy: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Review', 'Resolved', 'Escalated', 'CM Accepted'], default: 'Pending' },
  deadline: { type: Date },
  upvotes: { type: Number, default: 0 },
  cmHelpForwarded: { type: Boolean, default: false },
  cmHelpForwardedAt: { type: Date }
}, { timestamps: true });

// Pre-save hook to set deadline to 7 days from creation if not set
reportSchema.pre('save', function () {
  if (this.isNew && !this.deadline) {
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 7);
    this.deadline = deadlineDate;
  }
});

export default mongoose.model('Report', reportSchema);
