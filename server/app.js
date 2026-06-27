const express = require("express");
const cors = require("cors");
const db = require("./database/db");
const jwt = require("jsonwebtoken");

const app = express();
const SECRET = "event_secret_key";

app.use(cors());
app.use(express.json());

/* ================= AUTH ================= */

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  try {
    db.prepare(
      "INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, 0)"
    ).run(name, email, password);

    res.json({ message: "Registered ✔" });
  } catch (err) {
    return res.status(400).json({ message: "User already exists" });
  }
});

/* ================= LOGIN ================= */

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user || user.password !== password) {
    return res.status(400).json({ message: "Invalid login" });
  }

  // FIX: ensure number type
  let isAdmin = Number(user.isAdmin);

  // special admin email override
  if (email === "admin@eventsphere.com") {
    isAdmin = 1;
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: isAdmin,
    },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: {
      ...user,
      isAdmin,
    },
  });
});

/* ================= MIDDLEWARE ================= */

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* FIXED ADMIN CHECK */
function admin(req, res, next) {
  if (Number(req.user.isAdmin) !== 1) {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}

/* ================= EVENTS ================= */

app.post("/events", auth, admin, (req, res) => {
  const { title, description, date, poster } = req.body;

  console.log("CREATE EVENT BODY:", req.body);

  // basic validation (prevents silent insert failure)
  if (!title || !description || !date) {
    return res.status(400).json({
      message: "Title, description and date are required"
    });
  }

  try {
    const result = db.prepare(
      "INSERT INTO events (title, description, date, poster) VALUES (?, ?, ?, ?)"
    ).run(title, description, date, poster || "");

    res.json({
      message: "Event created ✔",
      id: result.lastInsertRowid,
    });
  } catch (err) {
    console.log("DB ERROR:", err.message);

    return res.status(500).json({
      message: "Error creating event",
      error: err.message
    });
  }
});

app.get("/events", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM events").all();
    res.json(rows);
  } catch (err) {
    console.log("FETCH ERROR:", err.message);

    return res.status(500).json({
      message: "Error fetching events",
      error: err.message
    });
  }
});

app.delete("/events/:id", auth, admin, (req, res) => {
  const { id } = req.params;

  try {
    db.prepare("DELETE FROM events WHERE id = ?").run(id);
    res.json({ message: "Event deleted ✔" });
  } catch (err) {
    console.log("DELETE ERROR:", err.message);

    return res.status(500).json({
      message: "Error deleting event",
      error: err.message
    });
  }
});

/* ================= REGISTRATION ================= */

app.post("/events/register", auth, (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body;

  const row = db.prepare(
    "SELECT * FROM event_registrations WHERE user_id=? AND event_id=?"
  ).get(userId, eventId);

  if (row) {
    return res.json({ message: "Already registered" });
  }

  try {
    db.prepare(
      "INSERT INTO event_registrations (user_id, event_id) VALUES (?, ?)"
    ).run(userId, eventId);

    res.json({ message: "Registered ✔" });
  } catch (err) {
    return res.status(500).json({ message: "Error registering" });
  }
});

app.get("/my-events", auth, (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT events.*
       FROM events
       JOIN event_registrations
       ON events.id = event_registrations.event_id
       WHERE event_registrations.user_id = ?`
    ).all(req.user.id);

    res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching my events" });
  }
});

/* ================= ADMIN REGISTRATIONS ================= */

app.get("/admin/registrations", auth, admin, (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT event_registrations.id, users.name, users.email, events.title
       FROM event_registrations
       JOIN users ON users.id = event_registrations.user_id
       JOIN events ON events.id = event_registrations.event_id`
    ).all();

    res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching data" });
  }
});

app.delete("/events/register/:id", auth, admin, (req, res) => {
  const { id } = req.params;

  try {
    db.prepare("DELETE FROM event_registrations WHERE id = ?").run(id);
    res.json({ message: "Registration cancelled ✔" });
  } catch (err) {
    return res.status(500).json({ message: "Error cancelling registration" });
  }
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})