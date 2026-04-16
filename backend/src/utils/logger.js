import db from "../config/db.js";

export function logEvent({   userId = null,
  action,
  entity = null,
  entity_id = null,
  status,
  metadata,
  req,
  sessionId = null }) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const userAgent = req.headers["user-agent"];

  db.prepare(`
    INSERT INTO logs (
      id, user_id, action, entity, entity_id, status,
      ip_address, user_agent, metadata, session_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    userId,
    action,
    entity,
    entity_id,
    status,
    ip,
    userAgent,
    JSON.stringify(metadata || {}),
    sessionId
  );
}