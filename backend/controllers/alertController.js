import Alert from '../models/Alert.js';

// @desc    Get user alerts
// @route   GET /api/alerts
// @access  Private
export const getAlerts = async (req, res, next) => {
  try {
    if (req.user?.isGuest) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const alerts = await Alert.find({ user: req.user._id })
      .populate('location', 'name city')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark alert as read
// @route   PUT /api/alerts/:id/read
// @access  Private
export const markAlertAsRead = async (req, res, next) => {
  try {
    if (req.user?.isGuest) {
      return res.json({
        success: true,
        data: { _id: req.params.id, read: true },
      });
    }

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      res.status(404);
      throw new Error('Alert not found');
    }

    if (alert.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    alert.read = true;
    await alert.save();

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private
export const deleteAlert = async (req, res, next) => {
  try {
    if (req.user?.isGuest) {
      return res.json({
        success: true,
        message: 'Alert removed',
      });
    }

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      res.status(404);
      throw new Error('Alert not found');
    }

    if (alert.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await alert.deleteOne();

    res.json({
      success: true,
      message: 'Alert removed',
    });
  } catch (error) {
    next(error);
  }
};
