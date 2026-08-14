import AIHealthProfile from '../models/AIHealthProfile.js';
import AIHealthReport from '../models/AIHealthReport.js';
import { getAirQualityByCity } from '../services/airQualityService.js';
import { generateAIReport, analyzeMedicalImages } from '../services/healthReportService.js';

// @desc    Save or update user's AI health profile
// @route   POST /api/ai-health/profile
// @access  Private
export const saveProfile = async (req, res, next) => {
  try {
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
    const userId = req.user._id;

    // 1. Fetch user's AI health profile
    currentStage = 'fetch_profile';
    const profile = await AIHealthProfile.findOne({ userId });
    if (!profile) {
      console.error(`[generateReport] Failed at stage: ${currentStage}. Reason: Profile not found.`);
      return res.status(400).json({ success: false, error: 'Health profile must be created first.', stage: currentStage });
    }

    if (!profile.primaryCity) {
      console.error(`[generateReport] Failed at stage: ${currentStage}. Reason: Missing primaryCity.`);
      return res.status(400).json({ success: false, error: 'Primary city is required in health profile.', stage: currentStage });
    }

    // Check cache: reuse if < 3 hours old AND profile hasn't changed
    currentStage = 'check_cache';
    const latestReport = await AIHealthReport.findOne({ userId }).sort({ createdAt: -1 });
    if (latestReport) {
      const reportAgeHours = (new Date() - new Date(latestReport.createdAt)) / (1000 * 60 * 60);
      const profileChangedSinceReport = new Date(profile.updatedAt) > new Date(latestReport.createdAt);

      if (reportAgeHours < 3 && !profileChangedSinceReport) {
        return res.status(200).json({ success: true, data: latestReport, cached: true });
      }
    }

    // 2. Fetch current environmental data for the user's primaryCity
    currentStage = 'fetch_environment_data';
    let environmentData;
    try {
        environmentData = await getAirQualityByCity(profile.primaryCity);
    } catch (err) {
        console.error(`[generateReport] Failed at stage: ${currentStage}. Error: ${err.message}`);
        return res.status(500).json({ success: false, error: 'Could not fetch environmental data for the specified city.', details: err.message, stage: currentStage });
    }

    // 3. Process uploaded medical images via OCR/Vision if any
    currentStage = 'process_images_ocr';
    let extractedMedicalContext = '';
    const imageUrls = req.files ? req.files.map(file => file.path) : [];
    
    if (imageUrls.length > 0) {
      extractedMedicalContext = await analyzeMedicalImages(imageUrls);
    }

    // 4. Generate AI report using healthReportService
    currentStage = 'generate_ai_report';
    const aiReportJson = await generateAIReport(profile, environmentData, extractedMedicalContext);

    // 5. Persist the returned report in MongoDB
    currentStage = 'save_report_mongo';
    const report = new AIHealthReport({
      userId,
      environmentSnapshot: environmentData,
      riskLevel: aiReportJson.riskLevel || 'Moderate',
      summary: aiReportJson.summary || 'Summary unavailable.',
      keyConcern: aiReportJson.keyConcern || 'None',
      dosAndDonts: aiReportJson.dosAndDonts || [],
      symptomWatch: aiReportJson.symptomWatch || [],
      bestTimeWindow: aiReportJson.bestTimeWindow || '',
      cityComparisonNote: aiReportJson.cityComparisonNote || null,
      reportImageUrls: imageUrls,
      rawModelResponse: JSON.stringify(aiReportJson)
    });

    await report.save();

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error(`[generateReport] Caught an exception at stage: ${currentStage}. Full error:`, error);
    // Explicitly return 400 if it was an API/Parsing issue from Groq, else 500
    const statusCode = error.message.includes('Groq') || error.message.includes('validation') ? 400 : 500;
    return res.status(statusCode).json({ success: false, error: error.message || 'Internal Server Error', stage: currentStage, details: error.stack });
  }
};

// @desc    Get the most recent AI health report
// @route   GET /api/ai-health/report/latest
// @access  Private
export const getLatestReport = async (req, res, next) => {
  try {
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
