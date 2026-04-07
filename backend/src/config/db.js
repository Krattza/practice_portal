import dotenv from 'dotenv'
dotenv.config()

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// In ES Modules, __dirname doesn't exist. This is the standard
// workaround to get the current file's directory.
const db = new Database('factorysync.db')

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all();
console.log('Tables:', tables.map(t => t.name));

export default db;