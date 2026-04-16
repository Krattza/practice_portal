import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
  try {
    // Read access token from cookie instead of Authorzation
    // Verify user identity
    const token = req.cookies?.access_token;
    console.log(req.cookies)
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not logged in",
      });
    }

    const decoded = verifyAccessToken(token);

    // Reject if someone sends a refresh token here by mistake
    if (decoded.type !== "access") {
      return res.status(401).json({
        success: false,
        message: "Invalid token type",
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      type: decoded.type,
    };

    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
        code: "TOKEN_EXPIRED",
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. Please log in again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};
