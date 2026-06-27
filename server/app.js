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

  db.run(
    "INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, 0)",
    [name, email, password],
    function (err) {
      if (err) {
        return res.status(400).json({ message: "User already exists" });
      }

      res.json({ message: "Registered ✔" });
    }
  );
});

/* ================= LOGIN ================= */

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
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

  db.run(
    "INSERT INTO events (title, description, date, poster) VALUES (?, ?, ?, ?)",
    [title, description, date, poster || ""],
    function (err) {
      if (err) {
        console.log("DB ERROR:", err.message);

        return res.status(500).json({
          message: "Error creating event",
          error: err.message
        });
      }

      res.json({
        message: "Event created ✔",
        id: this.lastID,
      });
    }
  );
});

app.get("/events", (req, res) => {
  db.all("SELECT * FROM events", [], (err, rows) => {
    if (err) {
      console.log("FETCH ERROR:", err.message);

      return res.status(500).json({
        message: "Error fetching events",
        error: err.message
      });
    }

    res.json(rows);
  });
});

app.delete("/events/:id", auth, admin, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM events WHERE id = ?", [id], function (err) {
    if (err) {
      console.log("DELETE ERROR:", err.message);

      return res.status(500).json({
        message: "Error deleting event",
        error: err.message
      });
    }

    res.json({ message: "Event deleted ✔" });
  });
});

/* ================= REGISTRATION ================= */

app.post("/events/register", auth, (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body;

  db.get(
    "SELECT * FROM event_registrations WHERE user_id=? AND event_id=?",
    [userId, eventId],
    (err, row) => {
      if (row) {
        return res.json({ message: "Already registered" });
      }

      db.run(
        "INSERT INTO event_registrations (user_id, event_id) VALUES (?, ?)",
        [userId, eventId],
        function (err) {
          if (err) {
            return res.status(500).json({ message: "Error registering" });
          }

          res.json({ message: "Registered ✔" });
        }
      );
    }
  );
});

app.get("/my-events", auth, (req, res) => {
  db.all(
    `SELECT events.*
     FROM events
     JOIN event_registrations
     ON events.id = event_registrations.event_id
     WHERE event_registrations.user_id = ?`,
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching my events" });
      }

      res.json(rows);
    }
  );
});

/* ================= ADMIN REGISTRATIONS ================= */

app.get("/admin/registrations", auth, admin, (req, res) => {
  db.all(
    `SELECT event_registrations.id, users.name, users.email, events.title
     FROM event_registrations
     JOIN users ON users.id = event_registrations.user_id
     JOIN events ON events.id = event_registrations.event_id`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching data" });
      }

      res.json(rows);
    }
  );
});

app.delete("/events/register/:id", auth, admin, (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM event_registrations WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Error cancelling registration" });
      }

      res.json({ message: "Registration cancelled ✔" });
    }
  );
});

/* ================= START SERVER ================= */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});