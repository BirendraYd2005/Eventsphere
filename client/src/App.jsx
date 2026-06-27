import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyEvents from "./pages/MyEvents";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* MAIN USER DASHBOARD (ALL EVENTS HERE) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* USER REGISTERED EVENTS */}
        <Route path="/my-events" element={<MyEvents />} />

        {/* ADMIN PANEL */}
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;