import User from '../models/User.js';

// @desc    Update extended profile fields (phone, height, weight, gender)
// @route   PATCH /api/users/profile
// @access  Private
export const updateExtendedProfile = async (req, res, next) => {
  try {
    const { phone, height, weight, gender } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (phone !== undefined) user.phone = phone;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (gender !== undefined) user.gender = gender;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        phone: updatedUser.phone,
        height: updatedUser.height,
        weight: updatedUser.weight,
        gender: updatedUser.gender,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile image to Cloudinary
// @route   POST /api/users/profile-image
// @access  Private
export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an image file');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // req.file contains the Cloudinary info from Multer Storage
    user.profileImage = {
      url: req.file.path,
      publicId: req.file.filename,
    };

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and all associated data
// @route   DELETE /api/users/me
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Delete the user from the database
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
