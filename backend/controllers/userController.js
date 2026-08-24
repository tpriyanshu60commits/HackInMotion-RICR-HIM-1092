import User from '../models/User.js';

// @desc    Update extended profile fields (phone, height, weight, gender)
// @route   PATCH /api/users/profile
// @access  Private
export const updateExtendedProfile = async (req, res, next) => {
  try {
    const { phone, height, weight, gender } = req.body;

    if (req.user?.isGuest) {
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          phone: phone !== undefined ? phone : '',
          height: height !== undefined ? height : 0,
          weight: weight !== undefined ? weight : 0,
          gender: gender !== undefined ? gender : 'Prefer not to say',
        },
      });
    }

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

    if (req.user?.isGuest) {
      return res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: {
          profileImage: {
            url: req.file.path,
            publicId: req.file.filename || '',
          },
        },
      });
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

// @desc    Remove profile image from Cloudinary and database
// @route   DELETE /api/users/profile-image
// @access  Private
export const deleteProfileImage = async (req, res, next) => {
  try {
    if (req.user?.isGuest) {
      return res.status(200).json({
        success: true,
        message: 'Profile image removed successfully',
        data: { profileImage: { url: '', publicId: '' } },
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Delete from Cloudinary if publicId exists
    if (user.profileImage && user.profileImage.publicId) {
      try {
        const cloudinary = (await import('../config/cloudinary.js')).default;
        await cloudinary.uploader.destroy(user.profileImage.publicId);
      } catch (cloudErr) {
        console.error('Cloudinary deletion failed:', cloudErr);
        // Continue even if Cloudinary deletion fails
      }
    }

    user.profileImage = { url: '', publicId: '' };
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile image removed successfully',
      data: { profileImage: updatedUser.profileImage },
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
    if (req.user?.isGuest) {
      return res.status(403).json({
        success: false,
        message: 'Guest users cannot delete accounts',
      });
    }

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
