import { verifyRefreshToken } from "./jwt.js";


export const refreshAccessToken = (req, res) => {
  try {

    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    // generate new access token
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Token refreshed",
    });

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};