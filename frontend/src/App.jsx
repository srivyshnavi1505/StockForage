import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Leaderboard from "./pages/Leaderboard";
import TradeHistory from "./pages/TradeHistory";
import { useAuth } from "./stores/authStore";

// Blocks render until the initial session check completes.
// Shows a spinner while verifySession() is in-flight, then either
// renders the child or redirects to /login.
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const sessionLoading = useAuth((s) => s.sessionLoading);

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Verifying session…</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const { verifySession } = useAuth();
  useEffect(() => { verifySession(); }, []);

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/history" element={<ProtectedRoute><TradeHistory /></ProtectedRoute>} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;