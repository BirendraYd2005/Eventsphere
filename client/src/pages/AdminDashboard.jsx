import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [regs, setRegs] = useState([]);
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState({ events: false, regs: false, create: false });

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    poster: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not logged in. Please log in again.");
    return { Authorization: `Bearer ${token}` };
  };

  const loadEvents = useCallback(async () => {
    setLoading((prev) => ({ ...prev, events: true }));
    try {
      const res = await axios.get(`${BASE_URL}/events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading((prev) => ({ ...prev, events: false }));
    }
  }, []);

  const loadRegistrations = useCallback(async () => {
    setLoading((prev) => ({ ...prev, regs: true }));
    try {
      const res = await axios.get(`${BASE_URL}/admin/registrations`, {
        headers: getAuthHeaders(),
      });
      setRegs(res.data);
    } catch (err) {
      console.error("Failed to load registrations:", err.response?.data?.message || err.message);
    } finally {
      setLoading((prev) => ({ ...prev, regs: false }));
    }
  }, []);

  useEffect(() => {
    loadEvents();
    loadRegistrations();
  }, [loadEvents, loadRegistrations]);

  const createEvent = async () => {
    setFormMsg({ type: "", text: "" });
    if (!form.title.trim()) return setFormMsg({ type: "error", text: "Event title is required." });
    if (!form.description.trim()) return setFormMsg({ type: "error", text: "Description is required." });
    if (!form.date) return setFormMsg({ type: "error", text: "Date is required." });

    setLoading((prev) => ({ ...prev, create: true }));
    try {
      await axios.post(
        `${BASE_URL}/events`,
        {
          title: form.title.trim(),
          description: form.description.trim(),
          date: form.date,
          poster: form.poster.trim(),
        },
        { headers: getAuthHeaders() }
      );
      setFormMsg({ type: "success", text: "Event created successfully." });
      setForm({ title: "", description: "", date: "", poster: "" });
      loadEvents();
    } catch (err) {
      const msg =
        err.message === "Not logged in. Please log in again."
          ? err.message
          : err.response?.data?.message || `Error ${err.response?.status || "unknown"}: Event creation failed.`;
      setFormMsg({ type: "error", text: msg });
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      await axios.delete(`${BASE_URL}/events/${id}`, { headers: getAuthHeaders() });
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event.");
    }
  };

  const cancelReg = async (id) => {
    if (!window.confirm("Cancel this registration?")) return;
    try {
      await axios.delete(`${BASE_URL}/events/register/${id}`, { headers: getAuthHeaders() });
      loadRegistrations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel registration.");
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0f1117;
          color: #e2e8f0;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          min-height: 100vh;
        }

        .admin-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 32px;
          letter-spacing: -0.5px;
        }

        .title span { color: #6366f1; }

        .create-box {
          background: #151821;
          border: 1px solid #1e2433;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 48px;
        }

        .create-box h2 {
          font-size: 17px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .create-box h2::before {
          content: '';
          display: block;
          width: 4px;
          height: 18px;
          background: #6366f1;
          border-radius: 2px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 18px;
        }

        .form-grid input {
          background: #0f1117;
          border: 1px solid #1e2433;
          border-radius: 10px;
          padding: 11px 15px;
          font-size: 14px;
          color: #e2e8f0;
          outline: none;
          width: 100%;
          transition: border-color 0.2s;
        }

        .form-grid input:focus { border-color: #6366f1; }
        .form-grid input::placeholder { color: #475569; }

        .create-btn {
          padding: 11px 26px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background: #6366f1;
          color: #fff;
          border: none;
          transition: background 0.2s, opacity 0.2s;
        }

        .create-btn:hover:not(:disabled) { background: #4f46e5; }
        .create-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .form-msg {
          margin-top: 12px;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 8px;
        }

        .form-msg.error  { background: #2d1b1b; color: #fc8181; border: 1px solid #4a2020; }
        .form-msg.success { background: #0d2416; color: #4ade80; border: 1px solid #166534; }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #1e2433;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 48px;
        }

        .card {
          background: #151821;
          border: 1px solid #1e2433;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, border-color 0.2s;
        }

        .card:hover {
          transform: translateY(-3px);
          border-color: #6366f1;
        }

        .card img {
          width: 100%;
          height: 165px;
          object-fit: cover;
          background: #1e2433;
          display: block;
        }

        .card-body {
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 6px;
        }

        .card-date {
          font-size: 11px;
          font-weight: 600;
          color: #6366f1;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card h3 {
          font-size: 16px;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.4;
        }

        .card p {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          flex: 1;
        }

        .delete-btn {
          margin-top: 14px;
          width: 100%;
          padding: 9px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          background: #2d1b1b;
          color: #fc8181;
          border: 1px solid #4a2020;
          transition: background 0.2s;
        }

        .delete-btn:hover { background: #3d2020; }

        .reg-card {
          background: #151821;
          border: 1px solid #1e2433;
          border-radius: 14px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: border-color 0.2s;
        }

        .reg-card:hover { border-color: #2d3748; }

        .reg-card h3 {
          font-size: 15px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .reg-card p {
          font-size: 13px;
          color: #64748b;
        }

        .cancel-btn {
          margin-top: 10px;
          width: 100%;
          padding: 9px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          background: #2d1b1b;
          color: #fc8181;
          border: 1px solid #4a2020;
          transition: background 0.2s;
        }

        .cancel-btn:hover { background: #3d2020; }

        .empty-text {
          color: #475569;
          font-size: 14px;
          padding: 20px 0;
          margin-bottom: 48px;
        }

        .loading-text {
          color: #475569;
          font-size: 14px;
          padding: 20px 0;
          margin-bottom: 48px;
        }
      `}</style>

      <div className="admin-page">

        <h1 className="title">Admin <span>Dashboard</span></h1>

        {/* CREATE EVENT */}
        <div className="create-box">
          <h2>Create Event</h2>
          <div className="form-grid">
            <input
              placeholder="Event Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              placeholder="Description *"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <input
              placeholder="Poster URL (optional)"
              value={form.poster}
              onChange={(e) => setForm({ ...form, poster: e.target.value })}
            />
          </div>

          <button className="create-btn" onClick={createEvent} disabled={loading.create}>
            {loading.create ? "Creating…" : "+ Create Event"}
          </button>

          {formMsg.text && (
            <div className={`form-msg ${formMsg.type}`}>{formMsg.text}</div>
          )}
        </div>

        {/* ALL EVENTS */}
        <h2 className="section-title">All Events</h2>

        {loading.events ? (
          <p className="loading-text">Loading events…</p>
        ) : events.length === 0 ? (
          <p className="empty-text">No events yet.</p>
        ) : (
          <div className="grid">
            {events.map((e) => (
              <div className="card" key={e.id}>
                <img
                  src={e.poster || "https://via.placeholder.com/400x165?text=No+Image"}
                  alt={e.title}
                  onError={(ev) => { ev.target.src = "https://via.placeholder.com/400x165?text=No+Image"; }}
                />
                <div className="card-body">
                  <span className="card-date">📅 {e.date}</span>
                  <h3>{e.title}</h3>
                  <p>{e.description}</p>
                  <button className="delete-btn" onClick={() => deleteEvent(e.id)}>
                    🗑 Delete Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REGISTRATIONS */}
        <h2 className="section-title">Registrations</h2>

        {loading.regs ? (
          <p className="loading-text">Loading registrations…</p>
        ) : regs.length === 0 ? (
          <p className="empty-text">No registrations yet.</p>
        ) : (
          <div className="grid">
            {regs.map((r) => (
              <div className="reg-card" key={r.id}>
                <h3>{r.title}</h3>
                <p>{r.name} ({r.email})</p>
                <button className="cancel-btn" onClick={() => cancelReg(r.id)}>
                  Cancel Registration
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}

export default AdminDashboard;
