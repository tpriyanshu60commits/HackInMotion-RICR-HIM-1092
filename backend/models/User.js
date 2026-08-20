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
      required: false, // Optional for OAuth
    },
    googleId: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },

    phone: { type: String, default: '' },
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say',
    },
    profileImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    monitoringActive: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    healthProfile: {
      age: Number,
      height: { type: Number, default: 0 },
      weight: { type: Number, default: 0 },
      gender: { type: String, default: '' },
      activityLevel: { type: String, default: '' },
      healthGoals: { type: String, default: '' },
      diagnosedConditions: { type: [String], default: [] },
      prescribedMedication: { type: [String], default: [] },
      customIssue: { type: String, default: '' },
      lastCheckupDate: { type: String, default: '' },
      wearableConnected: { type: Boolean, default: false },
      respiratoryCondition: { type: Boolean, default: false },
      asthma: { type: Boolean, default: false },
      heartCondition: { type: Boolean, default: false },
      children: { type: Boolean, default: false },
      elderlyHouseholdMember: { type: Boolean, default: false },
      outdoorWorker: { type: Boolean, default: false },
      respiratorySensitivity: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Low' },
      outdoorActivityFrequency: {
        type: String,
        enum: ['Rarely', 'Sometimes', 'Often'],
        default: 'Sometimes',
      },
    },
    preferences: {
      language: { type: String, default: 'en' },
      alertVoiceLanguage: { type: String, default: 'en' },
      region: { type: String, default: '' },
      timezone: { type: String, default: '' },
      temperatureUnit: { type: String, enum: ['celsius', 'fahrenheit'], default: 'celsius' },
      distanceUnit: { type: String, default: 'km' },
      weightUnit: { type: String, default: 'kg' },
      heightUnit: { type: String, default: 'cm' },
    },
    notificationSettings: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      healthAlerts: { type: Boolean, default: true },
      airQualityAlerts: { type: Boolean, default: true },
      weatherAlerts: { type: Boolean, default: true },
      isMuted: { type: Boolean, default: false },
      voiceAlertsEnabled: { type: Boolean, default: false },
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'friends'],
        default: 'private',
      },
      dataSharing: { type: Boolean, default: false },
      analytics: { type: Boolean, default: true },
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
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
