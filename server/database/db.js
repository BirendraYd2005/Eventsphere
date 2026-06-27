const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/eventsphere.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("SQLite connected ✔");
  }
});

/* USERS */
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    isAdmin INTEGER DEFAULT 0
  )
`);

/* EVENTS WITH POSTER */
db.run(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    date TEXT,
    poster TEXT
  )
`);

/* REGISTRATIONS */
db.run(`
  CREATE TABLE IF NOT EXISTS event_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_id INTEGER
  )
`);

module.exports = db;