import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    healthProfile: {
      age: Number,
      respiratoryCondition: { type: Boolean, default: false },
      asthma: { type: Boolean, default: false },
      heartCondition: { type: Boolean, default: false },
      children: { type: Boolean, default: false },
      elderlyHouseholdMember: { type: Boolean, default: false },
      outdoorWorker: { type: Boolean, default: false },
    },
    alertPreferences: {
      highRisk: { type: Boolean, default: true },
      moderateRisk: { type: Boolean, default: false },
      forecastAlerts: { type: Boolean, default: false },
      improvementAlerts: { type: Boolean, default: true },
    },
    savedLocations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
