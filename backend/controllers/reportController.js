import Report from '../models/Report.js';
import { checkEscalation, checkEscalations } from '../utils/escalation.js';

export const createReport = async (req, res, next) => {
  try {
    const { category, title, description, lat, lng, address } = req.body;
    let photoUrl = '';

    if (req.file) {
      photoUrl = req.file.path; // Cloudinary URL
    }

    const newReport = new Report({
      category,
      title,
      description,
      location: {
        lat: Number(lat),
        lng: Number(lng),
        address,
      },
      photoUrl,
      createdBy: req.user._id,
    });

    await newReport.save();
    res.status(201).json({ success: true, data: newReport });
  } catch (error) {
    console.error('Create report error:', error);
    next(error);
  }
};

export const getAllReports = async (req, res, next) => {
  try {
    let reports = await Report.find().sort({ createdAt: -1 });
    reports = await checkEscalations(reports);
    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};

export const getMyReports = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized to view these reports' });
    }
    let reports = await Report.find({ createdBy: userId }).sort({ createdAt: -1 });
    reports = await checkEscalations(reports);
    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (req, res, next) => {
  try {
    let report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    report = await checkEscalation(report);
    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    report.status = status;
    await report.save();

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

export const upvoteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    report.upvotes += 1;
    await report.save();

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

export const escalateToCMHelp = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    report.cmHelpForwarded = true;
    report.cmHelpForwardedAt = new Date();
    await report.save();

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

export const acceptEscalation = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    report.status = 'CM Accepted';
    await report.save();

    // Redirect to the frontend application
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/report?accepted=true&id=${report._id}`);
  } catch (error) {
    next(error);
  }
};
