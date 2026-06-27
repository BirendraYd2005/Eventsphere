import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      const user = res.data.user;
      if (user.isAdmin === 1) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) rotate(var(--r)); opacity: 0.18; }
          50%  { opacity: 0.28; }
          100% { transform: translateY(-110vh) rotate(calc(var(--r) + 15deg)); opacity: 0; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-container {
          min-height: 100vh;
          background: #0a0d14;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }

        /* ── floating images ── */
        .floating-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .float-img {
          position: absolute;
          border-radius: 20px;
          object-fit: cover;
          opacity: 0.22;
          animation: floatUp linear infinite;
          filter: blur(1px) saturate(0.7);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }

        .f1 { width: 160px; height: 160px; left: 5%;  bottom: -180px; --r: -12deg; animation-duration: 18s; animation-delay: 0s;   }
        .f2 { width: 130px; height: 130px; left: 20%; bottom: -180px; --r:   8deg; animation-duration: 22s; animation-delay: 4s;   }
        .f3 { width: 180px; height: 180px; left: 40%; bottom: -200px; --r: -6deg;  animation-duration: 16s; animation-delay: 2s;   }
        .f4 { width: 140px; height: 140px; left: 65%; bottom: -180px; --r:  14deg; animation-duration: 20s; animation-delay: 7s;   }
        .f5 { width: 120px; height: 120px; left: 82%; bottom: -180px; --r:  -9deg; animation-duration: 24s; animation-delay: 1s;   }
        .f6 { width: 150px; height: 150px; left: 55%; bottom: -180px; --r:  11deg; animation-duration: 19s; animation-delay: 10s;  }
        .f7 { width: 110px; height: 110px; left: 30%; bottom: -180px; --r: -15deg; animation-duration: 21s; animation-delay: 13s;  }

        /* ── glow orbs ── */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%);
          top: -100px; left: -100px;
        }

        .orb-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(56,189,248,0.18), transparent 70%);
          bottom: -80px; right: -80px;
        }

        /* ── card ── */
        .auth-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 420px;
          background: rgba(21, 24, 33, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 44px 40px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          animation: fadeInUp 0.6s ease both;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1);
        }

        /* ── brand ── */
        .auth-brand {
          text-align: center;
          margin-bottom: 4px;
        }

        .auth-brand-logo {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
          margin-bottom: 20px;
          opacity: 0.6;
        }

        .auth-brand-logo span { color: #6366f1; }

        .auth-card h2 {
          text-align: center;
          font-size: 26px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.5px;
        }

        .auth-subtitle {
          text-align: center;
          font-size: 14px;
          color: #475569;
          margin-top: -10px;
        }

        /* ── inputs ── */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .input-wrap {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          opacity: 0.4;
          pointer-events: none;
        }

        .auth-card input {
          width: 100%;
          background: rgba(15, 17, 23, 0.8);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 13px 16px 13px 42px;
          font-size: 14px;
          color: #e2e8f0;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .auth-card input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }

        .auth-card input::placeholder { color: #334155; }

        /* ── error ── */
        .auth-error {
          background: rgba(252,129,129,0.08);
          border: 1px solid rgba(252,129,129,0.2);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #fc8181;
          text-align: center;
        }

        /* ── button ── */
        .auth-card button[type="submit"] {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: #fff;
          letter-spacing: 0.3px;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 4px;
          position: relative;
          overflow: hidden;
        }

        .auth-card button[type="submit"]:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .auth-card button[type="submit"]:active:not(:disabled) {
          transform: translateY(0);
        }

        .auth-card button[type="submit"]:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* shimmer on button */
        .auth-card button[type="submit"]::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          background-size: 400px 100%;
          animation: shimmer 2s infinite;
        }

        /* ── divider ── */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #1e2433;
          font-size: 12px;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* ── footer link ── */
        .auth-card p {
          text-align: center;
          font-size: 14px;
          color: #475569;
          cursor: pointer;
          transition: color 0.2s;
        }

        .auth-card p span {
          color: #818cf8;
          font-weight: 600;
        }

        .auth-card p:hover { color: #64748b; }
      `}</style>

      <div className="auth-container">

        {/* glow orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* floating images */}
        <div className="floating-bg">
          <img className="float-img f1" src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300" alt="" />
          <img className="float-img f2" src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300" alt="" />
          <img className="float-img f3" src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=300" alt="" />
          <img className="float-img f4" src="https://images.unsplash.com/photo-1508780709619-79562169bc64?w=300" alt="" />
          <img className="float-img f5" src="https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?w=300" alt="" />
          <img className="float-img f6" src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300" alt="" />
          <img className="float-img f7" src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300" alt="" />
        </div>

        {/* card */}
        <form className="auth-card" onSubmit={handleSubmit}>

          <div className="auth-brand">
            <div className="auth-brand-logo">Event<span>Sphere</span></div>
            <h2>Welcome back</h2>
          </div>
          <p className="auth-subtitle">Sign in to your account</p>

          <div className="input-group">
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p onClick={() => navigate("/register")}>
            Don't have an account? <span>Register</span>
          </p>

        </form>
      </div>
    </>
  );
}

export default Login;
