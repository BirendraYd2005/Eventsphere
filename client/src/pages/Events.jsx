import { useEffect, useState } from "react";
import axios from "axios";

function Events() {
  const [events, setEvents] = useState([]);
  const [registered, setRegistered] = useState([]);

  useEffect(() => {
    loadEvents();
    loadMyEvents();
  }, []);

  /* LOAD ALL EVENTS */
  const loadEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/events");
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* LOAD USER REGISTERED EVENTS */
  const loadMyEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/my-events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRegistered(res.data.map((e) => e.id));
    } catch (err) {
      console.log(err);
    }
  };

  /* REGISTER EVENT */
  const handleRegister = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/events/register",
        { eventId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Registered ✔");
      loadMyEvents(); // refresh UI
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="page">
      <h1>Events</h1>

      <div className="grid">
        {events.map((e) => {
          const isRegistered = registered.includes(e.id);

          return (
            <div className="card" key={e.id}>
              {/* EVENT POSTER (fallback if missing) */}
              <img
                src={e.poster || "https://via.placeholder.com/300"}
                alt="event"
              />

              <h3>{e.title}</h3>
              <p>{e.description}</p>
              <small>{e.date}</small>

              <button
                onClick={() => handleRegister(e.id)}
                disabled={isRegistered}
                style={{
                  background: isRegistered ? "#22c55e" : "#38bdf8",
                  cursor: isRegistered ? "not-allowed" : "pointer",
                }}
              >
                {isRegistered ? "Registered ✔" : "Register"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Events;