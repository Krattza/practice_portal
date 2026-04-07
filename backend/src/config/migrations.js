import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = () => {
  // Step 1: Create the migrations tracking table if it doesn't exist.
  // This table lives inside your factorysync.db file itself.
  // It records which migration files have already been executed.
  // This is exactly what tools like Flyway and Liquibase do internally.
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      filename  TEXT NOT NULL UNIQUE,
      run_at    TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Step 2: Read all .sql files from the migrations folder, sorted by name.
  // Sorting ensures 001_ always runs before 002_, which is critical because
  // 002_create_email_verifications_table.sql has a FK pointing to users,
  // so users table must exist first.
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort(); // alphabetical = numerical order given your 001_, 002_ naming

  console.log(`Found ${files.length} migration file(s)`);

  for (const file of files) {
    // Step 3: Check if this file has already been run.
    // If it's in _migrations, skip it — never run a migration twice.
    const alreadyRun = db
      .prepare('SELECT id FROM _migrations WHERE filename = ?')
      .get(file);

    if (alreadyRun) {
      console.log(`  ⏭  Skipping (already run): ${file}`);
      continue;
    }

    // Step 4: Read the SQL file contents
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

    // Step 5: Run the migration inside a transaction.
    // A transaction means: either ALL statements in the file succeed,
    // or NONE of them do. If your SQL file has 3 CREATE TABLE statements
    // and the 3rd one has a typo, the transaction rolls back and your DB
    // stays clean. Without a transaction, you'd have a half-created schema.
    const runMigration = db.transaction(() => {
      // db.exec() runs multi-statement SQL — perfect for .sql files
      // that may contain multiple CREATE TABLE, CREATE INDEX statements.
      db.exec(sql);

      // Record that this file has been run
      db.prepare('INSERT INTO _migrations (filename) VALUES (?)').run(file);
    });

    try {
      runMigration();
      console.log(`  ✅ Migrated: ${file}`);
    } catch (err) {
      console.error(`  ❌ Failed: ${file}`);
      console.error(`     Reason: ${err.message}`);
      // Stop immediately — don't run subsequent migrations if one fails.
      // A broken migration means your schema is in an unknown state.
      process.exit(1);
    }
  }

  console.log('Migration complete.');
};

export default runMigrations;