const Database = require("better-sqlite3");

const db = new Database("./database/eventsphere.db");
console.log("SQLite connected ✔");

/* USERS */
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    isAdmin INTEGER DEFAULT 0
  )
`);

/* EVENTS WITH POSTER */
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    date TEXT,
    poster TEXT
  )
`);

/* REGISTRATIONS */
db.exec(`
  CREATE TABLE IF NOT EXISTS event_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_id INTEGER
  )
`);

module.exports = db;