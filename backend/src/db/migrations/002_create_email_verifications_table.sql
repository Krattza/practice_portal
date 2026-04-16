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

IF NOT EXISTS (
  SELECT * FROM sysobjects
  WHERE name='email_verifications' AND xtype='U'
)

CREATE TABLE email_verifications (
  id INT IDENTITY(1, 1) PRIMARY KEY,
  user_id INT NOT NULL,
  otp_hash NVARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  attempts INT NOT NULL DEFAULT 0
    CHECK (attempts >-0 AND attempts <= 3),
  
  created_at DATETIME NOT NULL DEFAULT GETDATE()

  CONSTRAINT FK_email_verifications_user
  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE
)

CREATE INDEX idx_email_verifications_user_id
ON email_verifications(user_id)