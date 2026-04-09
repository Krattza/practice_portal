-- ============================================================
-- Table: user_sessions (SQLite Version)
-- ============================================================

CREATE TABLE sessions (
    id TEXT PRIMARY KEY,  -- UUID stored as string

    user_id TEXT NOT NULL,
    session_token TEXT NOT NULL UNIQUE,

    device_info TEXT,
    ip_address TEXT,  -- e.g. "192.168.1.1"

    is_active INTEGER NOT NULL DEFAULT 1
        CHECK (is_active IN (0,1)),

    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    last_activity TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);