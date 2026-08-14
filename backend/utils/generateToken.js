import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });

  const isProduction = process.env.NODE_ENV === 'production';
  // Set JWT as HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProduction, // Use secure cookies in production
    sameSite: isProduction ? 'none' : 'strict', // Allow cross-domain in prod, strict in dev
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token; // also return it in case frontend prefers header approach
};

export default generateToken;
