CREATE TABLE users (

  id TEXT PRIMARY KEY,

  first_name TEXT NOT NULL,
  last_name TEXT,

  email TEXT NOT NULL UNIQUE
        CHECK (email = LOWER(email)),

  password_hash TEXT NOT NULL,

  mobile_number TEXT NOT NULL UNIQUE
        CHECK (length(mobile_number) = 10),

  date_of_birth TEXT NOT NULL
        CHECK (date_of_birth <= date('now', '-18 years')),

      role TEXT NOT NULL DEFAULT 'citizen',

  state TEXT NOT NULL,
  district TEXT NOT NULL,

  house_number TEXT,
  street TEXT,
  landmark TEXT,

  pincode TEXT NOT NULL
        CHECK (length(pincode) = 6),

  is_verified INTEGER NOT NULL DEFAULT 0
        CHECK (is_verified IN (0,1)),

  is_active INTEGER NOT NULL DEFAULT 1
        CHECK (is_active IN (0,1)),

  failed_login_attempts INTEGER NOT NULL DEFAULT 0
        CHECK (failed_login_attempts >= 0),

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);