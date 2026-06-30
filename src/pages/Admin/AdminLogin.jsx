import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaUser, FaArrowLeft } from "react-icons/fa";
import { adminLogin } from "../../shared/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard immediately
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminLogin(username, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(15%_0_0)] flex flex-col items-center justify-center px-6 py-12 text-white font-sans selection:bg-primaryPest selection:text-black">
      <Link to="/" className="text-primaryWhite600 hover:text-primaryPest transition-colors flex items-center gap-2 text-sm mb-6 self-center">
        <FaArrowLeft /> Back to Website
      </Link>

      <div className="w-full max-w-md bg-[oklch(17.76%_0_0)] border border-primaryWhite600/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primaryPest to-transparent"></div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-primaryPest bg-clip-text text-transparent">
            Admin Portal
          </h2>
          <p className="text-primaryWhite600 text-xs mt-2">
            Enter credentials to access the portfolio dashboard.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/60 border border-red-500/30 text-red-200 text-xs px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-primaryWhite600 uppercase tracking-widest block">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primaryWhite600 pointer-events-none">
                <FaUser size={13} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-primaryPest transition-colors duration-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-primaryWhite600 uppercase tracking-widest block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primaryWhite600 pointer-events-none">
                <FaLock size={13} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-primaryPest transition-colors duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primaryPest hover:bg-primaryPest/80 text-black py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-primaryPest/10 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border border-black/20 border-t-black animate-spin"></div>
            ) : (
              "Access Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
