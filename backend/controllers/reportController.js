import Report from '../models/Report.js';
import { checkEscalation, checkEscalations } from '../utils/escalation.js';

export const createReport = async (req, res) => {
  try {
    const { category, title, description, lat, lng, address, createdBy } = req.body;
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
        address
      },
      photoUrl,
      createdBy
    });

    await newReport.save();
    res.status(201).json({ success: true, data: newReport });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ success: false, error: 'Failed to create report', details: error.stack });
  }
};

export const getAllReports = async (req, res) => {
  try {
    let reports = await Report.find().sort({ createdAt: -1 });
    reports = await checkEscalations(reports);
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch reports' });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const { userId } = req.params;
    let reports = await Report.find({ createdBy: userId }).sort({ createdAt: -1 });
    reports = await checkEscalations(reports);
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user reports' });
  }
};

export const getReportById = async (req, res) => {
  try {
    let report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    report = await checkEscalation(report);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch report' });
  }
};

export const updateStatus = async (req, res) => {
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
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
};

export const upvoteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    
    report.upvotes += 1;
    await report.save();
    
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to upvote report' });
  }
};

export const escalateToCMHelp = async (req, res) => {
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
    res.status(500).json({ success: false, error: 'Failed to escalate report' });
  }
};

export const acceptEscalation = async (req, res) => {
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
    res.status(500).json({ success: false, error: 'Failed to accept escalation' });
  }
};
