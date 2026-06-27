import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/my-events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load my events:", err);
    } finally {
      setLoading(false);
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

        .me-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background: #151821;
          border-bottom: 1px solid #1e2433;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .me-logo {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .me-logo span { color: #6366f1; }

        .btn-back {
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background: #1e2433;
          color: #a0aec0;
          border: 1px solid #2d3748;
          transition: all 0.2s;
        }

        .btn-back:hover {
          background: #252d3d;
          color: #e2e8f0;
        }

        .me-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .me-heading {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }

        .me-subheading {
          font-size: 15px;
          color: #64748b;
          margin-bottom: 36px;
        }

        .me-badge {
          display: inline-block;
          background: #1e1a3a;
          color: #818cf8;
          border: 1px solid #312e7a;
          font-size: 13px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 28px;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .event-card {
          background: #151821;
          border: 1px solid #1e2433;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, border-color 0.2s;
        }

        .event-card:hover {
          transform: translateY(-4px);
          border-color: #6366f1;
        }

        .event-card-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          background: #1e2433;
          display: block;
        }

        .event-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 8px;
        }

        .event-card-date {
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .event-card-title {
          font-size: 17px;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.4;
        }

        .event-card-desc {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          flex: 1;
        }

        .event-card-footer {
          margin-top: 16px;
        }

        .registered-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          background: #0d2416;
          color: #4ade80;
          border: 1px solid #166534;
        }

        .empty-state {
          text-align: center;
          padding: 100px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .empty-icon {
          font-size: 48px;
          opacity: 0.4;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 600;
          color: #475569;
        }

        .empty-desc {
          font-size: 14px;
          color: #334155;
        }

        .btn-browse {
          margin-top: 8px;
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background: #6366f1;
          color: #fff;
          border: none;
          transition: background 0.2s;
        }

        .btn-browse:hover { background: #4f46e5; }

        .loading-state {
          text-align: center;
          padding: 80px;
          color: #475569;
          font-size: 15px;
        }
      `}</style>

      {/* HEADER */}
      <header className="me-header">
        <div className="me-logo">Event<span>Sphere</span></div>
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </header>

      {/* BODY */}
      <main className="me-body">
        <h1 className="me-heading">My Events</h1>
        <p className="me-subheading">Events you've registered for.</p>

        {!loading && events.length > 0 && (
          <div className="me-badge">🎟 {events.length} event{events.length !== 1 ? "s" : ""} registered</div>
        )}

        {loading ? (
          <div className="loading-state">Loading your events…</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎪</div>
            <p className="empty-title">No events yet</p>
            <p className="empty-desc">You haven't registered for any events.</p>
            <button className="btn-browse" onClick={() => navigate("/dashboard")}>
              Browse Events
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((e) => (
              <div className="event-card" key={e.id}>
                <img
                  className="event-card-img"
                  src={e.poster || "https://via.placeholder.com/400x180?text=Event"}
                  alt={e.title}
                  onError={(ev) => {
                    ev.target.src = "https://via.placeholder.com/400x180?text=Event";
                  }}
                />
                <div className="event-card-body">
                  <span className="event-card-date">📅 {e.date}</span>
                  <h3 className="event-card-title">{e.title}</h3>
                  <p className="event-card-desc">{e.description}</p>
                  <div className="event-card-footer">
                    <div className="registered-badge">✓ Registered</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default MyEvents;
