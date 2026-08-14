import AirQualitySnapshot from '../models/AirQualitySnapshot.js';
import Location from '../models/Location.js';

export const getSnapshots = async (req, res, next) => {
  try {
    const { locationId } = req.params;

    const location = await Location.findOne({ _id: locationId, user: req.user._id });
    if (!location) {
      return res
        .status(403)
        .json({ success: false, error: { code: 'FORBIDDEN', message: 'Not your location' } });
    }

    const { range = '7d' } = req.query; // 7d, 30d, 90d

    let days = 7;
    if (range === '30d') days = 30;
    else if (range === '90d') days = 90;

    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const snapshots = await AirQualitySnapshot.find({
      locationId,
      timestamp: { $gte: dateLimit },
    }).sort({ timestamp: 1 });

    res.json({
      success: true,
      data: snapshots,
    });
  } catch (error) {
    next(error);
  }
};
