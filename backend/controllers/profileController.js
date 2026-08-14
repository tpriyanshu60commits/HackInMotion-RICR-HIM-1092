import User from '../models/User.js';

// @desc    Get full user profile
// @route   GET /api/v1/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update basic user profile
// @route   PUT /api/v1/profile
// @access  Private
export const updateBasicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name !== undefined ? req.body.name : user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    // Optional username update if added to root or profile
    if (req.body.username !== undefined) user.username = req.body.username;

    const updatedUser = await user.save();
    res.json({
      success: true,
      message: 'Basic profile updated successfully',
      data: {
        name: updatedUser.name,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get health profile
// @route   GET /api/v1/profile/health
// @access  Private
export const getHealthProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({
      success: true,
      data: user.healthProfile || {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update health profile
// @route   PUT /api/v1/profile/health
// @access  Private
export const updateHealthProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.healthProfile = {
      ...user.healthProfile,
      ...req.body,
    };

    const updatedUser = await user.save();
    res.json({
      success: true,
      message: 'Health profile updated successfully',
      data: updatedUser.healthProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notification settings
// @route   GET /api/v1/profile/notifications
// @access  Private
export const getNotificationSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({
      success: true,
      data: user.notificationSettings || {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update notification settings
// @route   PUT /api/v1/profile/notifications
// @access  Private
export const updateNotificationSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.notificationSettings = {
      ...user.notificationSettings,
      ...req.body,
    };

    const updatedUser = await user.save();
    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: updatedUser.notificationSettings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get preferences
// @route   GET /api/v1/profile/preferences
// @access  Private
export const getPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({
      success: true,
      data: user.preferences || {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update preferences
// @route   PUT /api/v1/profile/preferences
// @access  Private
export const updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.preferences = {
      ...user.preferences,
      ...req.body,
    };

    const updatedUser = await user.save();
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: updatedUser.preferences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get privacy settings
// @route   GET /api/v1/profile/privacy
// @access  Private
export const getPrivacySettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json({
      success: true,
      data: user.privacy || {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update privacy settings
// @route   PUT /api/v1/profile/privacy
// @access  Private
export const updatePrivacySettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.privacy = {
      ...user.privacy,
      ...req.body,
    };

    const updatedUser = await user.save();
    res.json({
      success: true,
      message: 'Privacy settings updated successfully',
      data: updatedUser.privacy,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export user data
// @route   GET /api/v1/profile/export
// @access  Private
export const exportData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const exportData = {
      profile: user,
      exportDate: new Date(),
    };

    res.json({
      success: true,
      data: exportData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/v1/profile
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await User.findByIdAndDelete(req.user._id);

    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
