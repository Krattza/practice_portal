import jwt from 'jsonwebtoken';

// Access token — short lived, used on every protected request
// Payload carries: id, email, role, type
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id:    user.id,
      email: user.email,
      role:  user.role,
      type:  'access',       
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

// Refresh token — long lived, used ONLY to get a new access token
// Minimal payload — just enough to identify the user
// type: 'refresh' prevents it being used as an access token
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id:   user.id,
      type: 'refresh',       
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// we verify it through th e scret key we signed it woth