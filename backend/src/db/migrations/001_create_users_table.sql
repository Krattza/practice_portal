-- CREATE TABLE users (

--   id TEXT PRIMARY KEY,

--   full_name TEXT NOT NULL,

--   email TEXT NOT NULL UNIQUE CHECK (email = LOWER(email)),

--   password_hash TEXT NOT NULL,

--   mobile_number TEXT UNIQUE NOT NULL CHECK (length(mobile_number) = 10),

--   date_of_birth TEXT NOT NULL CHECK (date_of_birth <= date('now', '-18 years')),

--   state TEXT NOT NULL,
--   district TEXT NOT NULL,
--   address TEXT NOT NULL,

--   pincode TEXT NOT NULL CHECK (length(pincode)= 6),

--   is_verified INTEGER NOT NULL DEFAULT 0,
--   is_active INTEGER NOT NULL DEFAULT 1,

--   failed_login_attempts INTEGER NOT NULL DEFAULT 0 CHECK (failed_login_attempts >= 0),

--   locked_until TEXT,

--   created_at TEXT NOT NULL DEFAULT (datetime('now')),
--   updated_at TEXT NOT NULL DEFAULT (datetime('now'))
-- )

-- CREATE INDEX IF NOT EXISTS idx_users_email
--   ON users(email);

-- CREATE INDEX IF NOT EXISTS idx_users_mobile
--   ON users(mobile_number);

-- 001_create_users_table.sql

CREATE TABLE IF NOT EXISTS users (

  id                    TEXT    PRIMARY KEY,
  full_name             TEXT    NOT NULL,

  -- UNIQUE enforced at DB level. Even if your Node.js code has a bug
  -- and tries to insert a duplicate, PostgreSQL/SQLite rejects it.
  email                 TEXT    NOT NULL UNIQUE
                                CHECK (email = LOWER(email)),

  password_hash         TEXT    NOT NULL,

  -- UNIQUE here too — one account per mobile number
  mobile_number         TEXT    NOT NULL UNIQUE
                                CHECK (length(mobile_number) = 10),

  -- Must be 18+ years old. date('now', '-18 years') computes the cutoff date.
  -- e.g. today is 2026-04-07, cutoff = 2008-04-07
  -- dob must be <= that, meaning they were born on or before 2008-04-07
  date_of_birth         TEXT    NOT NULL
                                CHECK (date_of_birth <= date('now', '-18 years')),

  state                 TEXT    NOT NULL,
  district              TEXT    NOT NULL,
  address               TEXT    NOT NULL,

  -- Fixed: was CHECK(length = 0) which rejects everything
  pincode               TEXT    NOT NULL
                                CHECK (length(pincode) = 6),

  -- 0 = false, 1 = true. SQLite has no BOOLEAN type.
  is_verified           INTEGER NOT NULL DEFAULT 0
                                CHECK (is_verified IN (0, 1)),

  is_active             INTEGER NOT NULL DEFAULT 1
                                CHECK (is_active IN (0, 1)),

  failed_login_attempts INTEGER NOT NULL DEFAULT 0
                                CHECK (failed_login_attempts >= 0),

  -- NULL means account is not locked. That is correct and intentional.
  locked_until          TEXT    DEFAULT NULL,

  created_at            TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email
  ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_mobile
  ON users(mobile_number);