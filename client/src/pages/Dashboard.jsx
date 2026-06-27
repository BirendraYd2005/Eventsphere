import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadEvents();
    loadMyEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  };

  const loadMyEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/my-events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistered(res.data.map((e) => e.id));
    } catch (err) {
      console.error("Failed to load my events:", err);
    }
  };

  const handleRegister = async (id) => {
    setLoadingId(id);
    try {
      await axios.post(
        `${BASE_URL}/events/register`,
        { eventId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadMyEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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

        .db-header {
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

        .db-logo {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .db-logo span {
          color: #6366f1;
        }

        .db-nav {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .btn-nav {
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .btn-myevents {
          background: #1e2433;
          color: #a0aec0;
          border: 1px solid #2d3748;
        }

        .btn-myevents:hover {
          background: #252d3d;
          color: #e2e8f0;
        }

        .btn-logout {
          background: #2d1b1b;
          color: #fc8181;
          border: 1px solid #4a2020;
        }

        .btn-logout:hover {
          background: #3d2020;
        }

        .db-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .db-heading {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }

        .db-subheading {
          font-size: 15px;
          color: #64748b;
          margin-bottom: 36px;
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
          transition: transform 0.2s, border-color 0.2s;
          display: flex;
          flex-direction: column;
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

        .btn-register {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .btn-register-active {
          background: #6366f1;
          color: #fff;
        }

        .btn-register-active:hover {
          background: #4f46e5;
        }

        .btn-register-done {
          background: #0d2416;
          color: #4ade80;
          border: 1px solid #166534;
          cursor: not-allowed;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #475569;
        }

        .empty-state p {
          font-size: 16px;
        }
      `}</style>

      {/* HEADER */}
      <header className="db-header">
        <div className="db-logo">Event<span>Sphere</span></div>
        <nav className="db-nav">
          <button className="btn-nav btn-myevents" onClick={() => navigate("/my-events")}>
            My Events
          </button>
          <button className="btn-nav btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      {/* BODY */}
      <main className="db-body">
        <h1 className="db-heading">Upcoming Events</h1>
        <p className="db-subheading">Browse and register for events happening near you.</p>

        {events.length === 0 ? (
          <div className="empty-state"><p>No events available yet.</p></div>
        ) : (
          <div className="events-grid">
            {events.map((e) => {
              const isRegistered = registered.includes(e.id);
              const isLoading = loadingId === e.id;

              return (
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
                      <button
                        className={`btn-register ${isRegistered ? "btn-register-done" : "btn-register-active"}`}
                        onClick={() => !isRegistered && handleRegister(e.id)}
                        disabled={isRegistered || isLoading}
                      >
                        {isLoading ? "Registering…" : isRegistered ? "✓ Registered" : "Register Now"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default Dashboard;
