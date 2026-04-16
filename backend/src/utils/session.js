import crypto from "crypto";
import db from "../config/db.js";

export function generateSessionToken() {
  return crypto.randomBytes(48).toString("hex");
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId, req) {

  const token = generateSessionToken();
  const hashedToken = hashToken(token);


  // Capturing Ip
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;


    // Capturing device Info
  const deviceInfo = req.headers["user-agent"];

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);


  // Validate above items through zod

  const result = db.prepare(`
    INSERT INTO sessions (
      id,
      user_id,
      session_token,
      device_info,
      ip_address,
      created_at,
      expires_at,
      last_activity
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    userId,
    hashedToken,
    deviceInfo,
    ip,
    now.toISOString(),
    expiresAt.toISOString(),
    now.toISOString()
  );

  // console.log(result)

    return { token, expiresAt };

}

  // // Send raw token to client
  // res.cookie("session_token", token, {
  //   httpOnly: true,
  //   secure: true,
  // });
  // jwt.sign({}, 'aadarsh')
  // res.cookies('session-token')

