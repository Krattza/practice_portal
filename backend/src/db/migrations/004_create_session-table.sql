-- ============================================================
-- Table: logs (SQLite Version)
-- ============================================================

CREATE TABLE logs (
    id TEXT PRIMARY KEY,  -- UUID stored as string

    user_id TEXT,  -- Nullable (for system events)

    action TEXT NOT NULL,   -- LOGIN, REGISTER, UPDATE_PROFILE, etc.
    entity TEXT,            -- users, orders, applications, etc.
    entity_id TEXT,         -- ID of affected record

    status TEXT NOT NULL,   -- SUCCESS / FAILED

    ip_address TEXT,        -- store as string (e.g. "192.168.1.1")
    user_agent TEXT,

    metadata TEXT,          -- JSON stored as TEXT

    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);