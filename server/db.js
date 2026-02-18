const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "bundo.sqlite");
const db = new Database(dbPath);

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT NOT NULL UNIQUE,
    whatsapp TEXT,
    created_at TEXT NOT NULL
  );
`);

module.exports = db;
