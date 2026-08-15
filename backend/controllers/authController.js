import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/emailService.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    const user = await User.create({
      name,
      email,
      password,
      emailVerificationToken: verificationToken,
    });

    const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address - VerdantX',
        html: `<p>Please click this link to verify your email:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
      });
    } catch (emailError) {
      console.error('Registration email failed:', emailError.message);
      // We still return success but maybe the user can request another verification email later.
    }

    if (user) {
      const token = generateToken(res, user._id);
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id);
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token,
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    if (req.user) {
      res.json({
        success: true,
        data: req.user,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.healthProfile) {
        user.healthProfile = { ...user.healthProfile, ...req.body.healthProfile };
      }

      if (req.body.alertPreferences) {
        user.alertPreferences = { ...user.alertPreferences, ...req.body.alertPreferences };
      }

      const updatedUser = await user.save();

      // Convert to object and remove password
      const userObj = updatedUser.toObject();
      delete userObj.password;

      res.json({
        success: true,
        data: userObj,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ emailVerificationToken: req.params.token });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired verification token' });

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'No user with that email' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const clientUrl = process.env.NODE_ENV === 'production' ? (process.env.CLIENT_URL || 'https://hack-in-motion-ricr-him-1092.vercel.app') : (process.env.CLIENT_URL || 'http://localhost:5173');
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset - VerdantX',
        html: `<p>Click here to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
      });
      res.json({ success: true, message: 'Password reset email sent' });
    } catch {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500);
      return next(new Error('Email could not be sent'));
    }
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password = req.body.password; // this triggers the pre-save hook for hashing
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

export const googleAuthCallback = async (req, res, next) => {
  try {
    const token = generateToken(res, req.user._id);
    const clientUrl = process.env.NODE_ENV === 'production' ? (process.env.CLIENT_URL || 'https://hack-in-motion-ricr-him-1092.vercel.app') : (process.env.CLIENT_URL || 'http://localhost:5173');
    const redirectUrl = `${clientUrl}/login?token=${token}`;
    res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
};

// @desc    Update password securely
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { currentPassword, newPassword } = req.body;

    // For users who registered via OAuth and have no password
    if (user.password && !(await user.matchPassword(currentPassword))) {
      res.status(401);
      throw new Error('Incorrect current password');
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
