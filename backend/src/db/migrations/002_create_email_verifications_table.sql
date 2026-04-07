-- CREATE TABLE email_verifications (

--   id TEXT PRIMARY KEY,

--   user_id TEXT NOT NULL CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),

--   otp_hash TEXT NOT NULL,

--   created_at TEXT DEFAULT (datetime('now')),

--   expires_at TEXT DEFAULT (datetime('now', '+15 minutes')),

--   attempts INTEGER DEFAULT 0,

--   attempts_created_at INTEGER DEFAULT (datetime('now'))
-- )

  -- id, user_id, otphash, expiresAT, attempts, created_at

  -- 002_create_email_verifications_table.sql

CREATE TABLE IF NOT EXISTS email_verifications (

  id         TEXT    PRIMARY KEY,

  -- NOT NULL added. ON DELETE CASCADE added.
  -- Without CASCADE: delete a user → their OTP row stays forever (orphan).
  -- With CASCADE: delete a user → their OTP rows are automatically deleted too.
  user_id    TEXT    NOT NULL
                     REFERENCES users(id) ON DELETE CASCADE,

  otp_hash   TEXT    NOT NULL,

  -- No default — expires_at is always passed explicitly from Node.js.
  -- You calculate: new Date(Date.now() + 15 * 60 * 1000).toISOString()
  -- Being explicit prevents silent bugs where you forget to pass it.
  expires_at TEXT    NOT NULL,

  -- Max 3 OTP attempts before lockout
  attempts   INTEGER NOT NULL DEFAULT 0
                     CHECK (attempts >= 0 AND attempts <= 3),

  created_at TEXT    NOT NULL DEFAULT (datetime('now'))

  -- Removed: attempts_created_at (redundant with created_at, wrong type)
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id
  ON email_verifications(user_id);