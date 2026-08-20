import AIHealthProfile from '../models/AIHealthProfile.js';
import AIHealthReport from '../models/AIHealthReport.js';
import { getAirQualityByCity } from '../services/airQualityService.js';
import { generateAIReport } from '../services/healthReportService.js';

let guestHealthProfile = {
  ageGroup: 'adult',
  conditions: [],
  sensitivityLevel: 'medium',
  outdoorActivity: 'mostly indoors',
  activityTimeWindow: '',
  medicationReminder: false,
  primaryCity: 'Delhi',
};

let guestLatestReport = null;

// @desc    Save or update user's AI health profile
// @route   POST /api/ai-health/profile
// @access  Private
export const saveProfile = async (req, res, next) => {
  try {
    if (req.user?.isGuest) {
      guestHealthProfile = {
        userId: 'guest_id',
        ageGroup: req.body.ageGroup || guestHealthProfile.ageGroup || 'adult',
        conditions: Array.isArray(req.body.conditions)
          ? req.body.conditions
          : req.body.conditions
          ? [req.body.conditions]
          : guestHealthProfile.conditions,
        sensitivityLevel: req.body.sensitivityLevel || guestHealthProfile.sensitivityLevel || 'medium',
        outdoorActivity: req.body.outdoorActivity || guestHealthProfile.outdoorActivity || 'mostly indoors',
        activityTimeWindow: req.body.activityTimeWindow !== undefined ? req.body.activityTimeWindow : guestHealthProfile.activityTimeWindow,
        medicationReminder: typeof req.body.medicationReminder === 'boolean' ? req.body.medicationReminder : !!req.body.medicationReminder,
        primaryCity: req.body.primaryCity || guestHealthProfile.primaryCity || 'Delhi',
        updatedAt: new Date(),
      };

      return res.status(200).json({
        success: true,
        data: guestHealthProfile,
      });
    }

    const userId = req.user._id;
    const profileData = { ...req.body, userId };

    const profile = await AIHealthProfile.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's AI health profile
// @route   GET /api/ai-health/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    if (req.user?.isGuest) {
      return res.status(200).json({ success: true, data: guestHealthProfile });
    }

    const userId = req.user._id;
    const profile = await AIHealthProfile.findOne({ userId });

    if (!profile) {
      return res.status(200).json({ success: true, data: null, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate a new AI health report
// @route   POST /api/ai-health/report/generate
// @access  Private
export const generateReport = async (req, res, next) => {
  let currentStage = 'init';
  try {
    currentStage = 'user_auth';

    // Handle Guest Users
    if (req.user?.isGuest) {
      currentStage = 'guest_generation';
      const primaryCity =
        req.body.primaryCity || guestHealthProfile.primaryCity || 'Delhi';

      let conditions = guestHealthProfile.conditions || [];
      if (req.body['conditions[]']) {
        conditions = Array.isArray(req.body['conditions[]'])
          ? req.body['conditions[]']
          : [req.body['conditions[]']];
      } else if (req.body.conditions) {
        conditions = Array.isArray(req.body.conditions)
          ? req.body.conditions
          : [req.body.conditions];
      }

      const profile = {
        primaryCity,
        ageGroup: req.body.ageGroup || guestHealthProfile.ageGroup || 'adult',
        conditions,
        sensitivityLevel: req.body.sensitivityLevel || guestHealthProfile.sensitivityLevel || 'medium',
        outdoorActivity: req.body.outdoorActivity || guestHealthProfile.outdoorActivity || 'mostly indoors',
        activityTimeWindow: req.body.activityTimeWindow || guestHealthProfile.activityTimeWindow || '',
        medicationReminder:
          req.body.medicationReminder === 'true' ||
          req.body.medicationReminder === true ||
          guestHealthProfile.medicationReminder,
      };

      // Update in-memory guest profile with latest values
      guestHealthProfile = {
        ...guestHealthProfile,
        ...profile,
        userId: 'guest_id',
        updatedAt: new Date(),
      };

      // Fetch real environmental data
      currentStage = 'fetch_environment_data';
      let environmentData;
      try {
        environmentData = await getAirQualityByCity(primaryCity);
      } catch (err) {
        console.error(`[generateReport] Guest env fetch failed: ${err.message}`);
        res.status(500);
        return next(new Error('Could not fetch environmental data for the specified city.'));
      }

      // Generate real AI report via Groq healthReportService
      currentStage = 'generate_ai_report';
      const aiReportJson = await generateAIReport(profile, environmentData);

      const report = {
        _id: 'guest_report_' + Date.now(),
        userId: 'guest_id',
        environmentSnapshot: environmentData,
        riskLevel: aiReportJson.riskLevel || 'Moderate',
        summary: aiReportJson.summary || 'Summary unavailable.',
        keyConcern: aiReportJson.keyConcern || 'None',
        dosAndDonts: aiReportJson.dosAndDonts || [],
        symptomWatch: aiReportJson.symptomWatch || [],
        bestTimeWindow: aiReportJson.bestTimeWindow || '',
        cityComparisonNote: aiReportJson.cityComparisonNote || null,
        reportImageUrls: [],
        rawModelResponse: JSON.stringify(aiReportJson),
        createdAt: new Date().toISOString(),
      };

      guestLatestReport = report;

      return res.status(201).json({
        success: true,
        data: report,
      });
    }

    const userId = req.user._id;

    // 1. Fetch user's AI health profile (or sync from req.body)
    currentStage = 'fetch_profile';
    let profile = await AIHealthProfile.findOne({ userId });

    const primaryCity =
      req.body.primaryCity ||
      profile?.primaryCity ||
      req.user.preferences?.region;

    if (!primaryCity) {
      console.error(
        `[generateReport] Failed at stage: ${currentStage}. Reason: Missing primaryCity.`
      );
      return res.status(400).json({
        success: false,
        error: 'Primary city is required to generate a health report.',
        stage: currentStage,
      });
    }

    let conditions = profile?.conditions || [];
    if (req.body['conditions[]']) {
      conditions = Array.isArray(req.body['conditions[]'])
        ? req.body['conditions[]']
        : [req.body['conditions[]']];
    } else if (req.body.conditions) {
      conditions = Array.isArray(req.body.conditions)
        ? req.body.conditions
        : [req.body.conditions];
    }

    const profileData = {
      userId,
      primaryCity,
      ageGroup: req.body.ageGroup || profile?.ageGroup || 'adult',
      conditions,
      sensitivityLevel: req.body.sensitivityLevel || profile?.sensitivityLevel || 'medium',
      outdoorActivity: req.body.outdoorActivity || profile?.outdoorActivity || 'mostly indoors',
      activityTimeWindow:
        req.body.activityTimeWindow !== undefined
          ? req.body.activityTimeWindow
          : profile?.activityTimeWindow || '',
      medicationReminder:
        req.body.medicationReminder === 'true' ||
        req.body.medicationReminder === true ||
        !!profile?.medicationReminder,
    };

    profile = await AIHealthProfile.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true, upsert: true }
    );

    // 2. Fetch current environmental data for the user's primaryCity
    currentStage = 'fetch_environment_data';
    let environmentData;
    try {
      environmentData = await getAirQualityByCity(profile.primaryCity);
    } catch (err) {
      console.error(`[generateReport] Failed at stage: ${currentStage}. Error: ${err.message}`);
      return res.status(404).json({
        success: false,
        error: `Could not fetch environmental data for "${profile.primaryCity}".`,
        stage: currentStage,
      });
    }

    // 3. Generate AI report using healthReportService
    currentStage = 'generate_ai_report';
    const aiReportJson = await generateAIReport(profile, environmentData);

    // 4. Persist the returned report in MongoDB
    currentStage = 'save_report_mongo';
    const report = new AIHealthReport({
      userId,
      environmentSnapshot: environmentData,
      riskLevel: aiReportJson.riskLevel || 'Moderate',
      summary: aiReportJson.summary || 'Summary unavailable.',
      keyConcern: aiReportJson.keyConcern || 'None',
      dosAndDonts: Array.isArray(aiReportJson.dosAndDonts) ? aiReportJson.dosAndDonts : [],
      symptomWatch: Array.isArray(aiReportJson.symptomWatch) ? aiReportJson.symptomWatch : [],
      bestTimeWindow: aiReportJson.bestTimeWindow || '',
      cityComparisonNote: aiReportJson.cityComparisonNote || null,
      reportImageUrls: [],
      rawModelResponse: JSON.stringify(aiReportJson),
    });

    await report.save();

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error(
      `[generateReport] Caught an exception at stage: ${currentStage}. Full error:`,
      error?.response?.data || error?.message || error
    );
    // Explicitly return 400 if it was an API/Parsing issue from Groq, else 500
    const errorMessage = error?.message || '';
    const statusCode =
      errorMessage.includes('Groq') || errorMessage.includes('validation') ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Failed to generate report',
      stage: currentStage,
    });
  }
};

// @desc    Get the most recent AI health report
// @route   GET /api/ai-health/report/latest
// @access  Private
export const getLatestReport = async (req, res, next) => {
  try {
    if (req.user?.isGuest) {
      if (guestLatestReport) {
        return res.status(200).json({ success: true, data: guestLatestReport });
      }
      return res.status(200).json({ success: true, data: null, message: 'No report found.' });
    }

    const userId = req.user._id;
    const report = await AIHealthReport.findOne({ userId }).sort({ createdAt: -1 });

    if (!report) {
      return res.status(200).json({ success: true, data: null, message: 'No report found.' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};
