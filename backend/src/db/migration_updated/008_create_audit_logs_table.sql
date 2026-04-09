CREATE TABLE IF NOT EXISTS audit_logs (
  id          TEXT PRIMARY KEY,

  -- One of these will be filled depending on who performed the action.
  -- Both can be NULL if the action was performed by the system itself
  -- (e.g. automatic account lock after 5 failed attempts).
  user_id     TEXT REFERENCES users(id)  ON DELETE SET NULL,
  admin_id    TEXT REFERENCES admins(id) ON DELETE SET NULL,

  -- Describes what happened.
  -- Examples: 'user_registered', 'email_verified', 'login_success',
  -- 'login_failed', 'password_reset', 'form_submitted',
  -- 'application_forwarded', 'application_approved', 'application_rejected'
  action      TEXT NOT NULL,

  -- Which type of record was affected and its ID.
  -- Lets you pull the full history of any single record.
  entity_type TEXT, -- 'user', 'admin', 'application', 'certificate'
  entity_id   TEXT,

  -- JSON strings capturing state before and after the action.
  -- For a status change: old_value = '{"status":"pending"}'
  --                      new_value = '{"status":"approved"}'
  -- For a registration:  old_value = NULL, new_value = '{"email":"..."}'
  old_value   TEXT,
  new_value   TEXT,

  ip_address  TEXT,
  user_agent  TEXT,

  -- audit_logs are append-only. Rows are NEVER updated or deleted.
  -- This is your permanent tamper-evident record.
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id
  ON audit_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id
  ON audit_logs(admin_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action
  ON audit_logs(action);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity
  ON audit_logs(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON audit_logs(created_at);