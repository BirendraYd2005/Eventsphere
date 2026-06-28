import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  const images = [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1600",
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setLoaded(true);
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % images.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      setPos({
        x: (e.clientX / window.innerWidth - 0.5) * 16,
        y: (e.clientY / window.innerHeight - 0.5) * 16,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="hero3">
      {images.map((img, i) => (
        <div
          key={img}
          className="bg3"
          style={{
            backgroundImage: `url(${img})`,
            opacity: i === index ? 1 : 0,
            transform: `scale(1.08) translate(${pos.x}px, ${pos.y}px)`,
          }}
        />
      ))}

      <div className="bg-veil" />
      <div className="grain" />

      <div className="glow g1"></div>
      <div className="glow g2"></div>
      <div className="glow g3"></div>

      <div className={`nav3 ${loaded ? "in" : ""}`}>
        <div className="brand-mark">
          <span className="seal">
            <svg viewBox="0 0 48 48" width="30" height="30">
              <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              <path d="M24 11 L27 20 L24 18 L21 20 Z" fill="currentColor" />
            </svg>
          </span>
          <h2>EventSphere</h2>
        </div>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate("/login")}>Login</button>
          <button className="btn-solid" onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>

      <div className={`content3 ${loaded ? "in" : ""}`}>
        <p className="eyebrow">
          <span className="eyebrow-dot" />
          Built for college clubs and committees
        </p>

        <h1>
          Build. Manage.
          <br />
          <span className="hero-accent">Host Events.</span>
        </h1>

        <p className="sub">
          Next-gen event management platform for modern institutions
        </p>

        <div className="cta-row">
          <button className="btn-cta" onClick={() => navigate("/register")}>
            Get Started
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="btn-text" onClick={() => navigate("/login")}>
            I already have an account
          </button>
        </div>
      </div>

      <div className="scroll-hint">
        <span>{images.map((_, i) => (
          <i key={i} className={`dot ${i === index ? "active" : ""}`} />
        ))}</span>
      </div>
    </div>
  );
}

export default Home;