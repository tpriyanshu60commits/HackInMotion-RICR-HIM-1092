import HealthReport from '../models/HealthReport.js';
import User from '../models/User.js';
import PDFDocument from 'pdfkit';

// @desc    Upload Health Report
// @route   POST /api/health/report
// @access  Private
export const uploadHealthReport = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a report image file');
    }

    const { conditions, customIssue } = req.body;
    
    // Parse conditions if sent as stringified JSON array from FormData
    let parsedConditions = [];
    if (conditions) {
      try {
        parsedConditions = JSON.parse(conditions);
      } catch (e) {
        parsedConditions = Array.isArray(conditions) ? conditions : [conditions];
      }
    }

    const report = new HealthReport({
      user: req.user._id,
      reportImageUrl: req.file.path,
      reportImagePublicId: req.file.filename,
      conditions: parsedConditions,
      customIssue: customIssue || '',
    });

    const savedReport = await report.save();

    // Set monitoringActive to true on user
    const user = await User.findById(req.user._id);
    if (user) {
      user.monitoringActive = true;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Health report uploaded successfully',
      data: savedReport,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download Health Report as PDF
// @route   GET /api/health/report/pdf
// @access  Private
export const downloadReportPDF = async (req, res, next) => {
  try {
    const report = await HealthReport.findOne({ user: req.user._id }).sort({ createdAt: -1 }).populate('user', 'name phone healthProfile');
    
    if (!report) {
      res.status(404);
      throw new Error('Health report not found');
    }

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="health-report-${report._id}.pdf"`);
    
    doc.pipe(res);
    
    // Header
    doc.fontSize(20).text('VerdantX Health Report', { align: 'center' });
    doc.moveDown();
    
    // User Details
    doc.fontSize(14).text('Patient Information', { underline: true });
    doc.fontSize(12)
       .text(`Name: ${report.user.name}`)
       .text(`Phone: ${report.user.phone || 'N/A'}`)
       .text(`Age: ${report.user.healthProfile?.age || 'N/A'}`);
    doc.moveDown();
    
    // Report Details
    doc.fontSize(14).text('Report Details', { underline: true });
    doc.fontSize(12)
       .text(`Date Submitted: ${new Date(report.createdAt).toLocaleDateString()}`)
       .text(`Conditions: ${report.conditions.length > 0 ? report.conditions.join(', ') : 'None selected'}`)
       .text(`Custom Issue: ${report.customIssue || 'None'}`);
    doc.moveDown();
       
    // Footer
    doc.moveDown(5);
    doc.fontSize(10).fillColor('gray').text('This is an automatically generated document based on user submission.', { align: 'center' });

    doc.end();

  } catch (error) {
    next(error);
  }
};
