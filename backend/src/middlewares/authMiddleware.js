import { verifyAccessToken, generateAccessToken } from "../utils/jwt.js";
import db from "../config/db.js";
import { hashToken } from "../utils/session.js";

export const authMiddleware = (req, res, next) => {
  try {
    const sessionToken = req.cookies?.session_token;

    if (!sessionToken) {
      return res.status(401).json({ error: "No session" });
    }
    
    // 1. verify session in DB    
    const hashed = hashToken(sessionToken);

    const session = db.prepare(`
      SELECT * FROM sessions WHERE session_token = ?
    `).get(hashed);

    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    // 2. check expiry
    if (new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ error: "Session expired" });
    }

    // 3. get user from DB
    const user = db.prepare(`
      SELECT id, email, role FROM users WHERE id = ?
    `).get(session.user_id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 4. generate JWT access token
    const accessToken = generateAccessToken(user);

    // 5. attach everything to request
    req.user = user;
    req.accessToken = accessToken;
    req.session = session;

    next();

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Auth failed" });
  }
};

// authentication