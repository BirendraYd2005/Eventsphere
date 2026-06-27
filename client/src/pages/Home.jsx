import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const images = [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b",
  ];

  const [index, setIndex] = useState(0);

  // background slider
  useEffect(() => {
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % images.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // mouse move parallax
  useEffect(() => {
    const handleMove = (e) => {
      setPos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="hero3">

      {/* moving background */}
      <div
        className="bg3"
        style={{
          backgroundImage: `url(${images[index]})`,
          transform: `scale(1.1) translate(${pos.x}px, ${pos.y}px)`
        }}
      />

      {/* glow particles */}
      <div className="glow g1"></div>
      <div className="glow g2"></div>
      <div className="glow g3"></div>

      {/* navbar */}
      <div className="nav3">
        <h2>EventSphere</h2>
        <div>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>

      {/* content */}
      <div className="content3">
        <h1>Build. Manage. Host Events.</h1>
        <p>Next-gen event management platform for modern institutions</p>

        <button onClick={() => navigate("/register")}>
          Get Started
        </button>
      </div>

    </div>
  );
}

export default Home;