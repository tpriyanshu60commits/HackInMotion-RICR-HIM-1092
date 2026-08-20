import CommunityReport from '../models/CommunityReport.js';

// @desc    Get all active community reports (with optional bounding box/city filter)
// @route   GET /api/community
// @access  Public
export const getReports = async (req, res, next) => {
  try {
    const { city, lat, lng, radius = 10 } = req.query; // radius in km

    let query = { status: 'active' };

    if (city) {
      query.city = new RegExp(city, 'i');
    } else if (lat && lng) {
      // Basic bounding box approximation for MongoDB without GeoJSON
      // 1 degree latitude is approx 111km
      const latDelta = radius / 111;
      const lngDelta = radius / (111 * Math.cos(lat * (Math.PI / 180)));

      query.latitude = { $gte: parseFloat(lat) - latDelta, $lte: parseFloat(lat) + latDelta };
      query.longitude = { $gte: parseFloat(lng) - lngDelta, $lte: parseFloat(lng) + lngDelta };
    }

    const reports = await CommunityReport.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(50); // limit to recent 50

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new community report
// @route   POST /api/community
// @access  Private
export const createReport = async (req, res, next) => {
  try {
    const { category, description, latitude, longitude, city } = req.body;

    if (req.user?.isGuest) {
      return res.status(201).json({
        success: true,
        data: {
          _id: 'guest_comm_report_' + Date.now(),
          category,
          description,
          latitude,
          longitude,
          city,
          status: 'active',
          user: { name: req.user.name || 'Guest User' },
        },
      });
    }

    const report = await CommunityReport.create({
      user: req.user._id,
      category,
      description,
      latitude,
      longitude,
      city,
    });

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote a report
// @route   PUT /api/community/:id/upvote
// @access  Private
export const upvoteReport = async (req, res, next) => {
  try {
    const report = await CommunityReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      throw new Error('Report not found');
    }

    if (req.user?.isGuest) {
      return res.json({
        success: true,
        data: report,
      });
    }

    // Check if user already upvoted
    if (report.upvotes.includes(req.user._id)) {
      res.status(400);
      throw new Error('You have already upvoted this report');
    }

    report.upvotes.push(req.user._id);
    await report.save();

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status (e.g. resolved)
// @route   PUT /api/community/:id/status
// @access  Private
export const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await CommunityReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      throw new Error('Report not found');
    }

    if (req.user?.isGuest) {
      return res.json({
        success: true,
        data: report,
      });
    }

    if (report.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this report');
    }

    report.status = status;
    await report.save();

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};
