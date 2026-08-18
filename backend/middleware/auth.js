import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if token is in cookies
  token = req.cookies?.jwt;

  // Fallback to Bearer token in headers if cookie not present
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  // ALLOW GUEST ACCESS
  if (token === 'guest_token') {
    req.user = {
      _id: 'guest_id',
      name: 'Guest User',
      email: 'guest@verdantx.com',
      role: 'guest',
      isGuest: true
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
