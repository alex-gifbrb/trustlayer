import { useNavigate, useLocation } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import { useOnboarding } from "../context/OnboardingContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { watchlist } = useWatchlist();
  const { user, openOverlay } = useOnboarding();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-dark-800 border-b border-dark-500 flex items-center justify-between px-6">
      {/* Logo */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          T
        </div>
        <span className="text-white font-semibold text-base tracking-tight">
          Trust<span className="text-violet-400">.net</span>
        </span>
      </button>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/watchlist")}
          className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
            isActive("/watchlist")
              ? "text-white bg-dark-600 border border-dark-400"
              : "text-slate-400 hover:text-white hover:bg-dark-600"
          }`}
        >
          Watchlist
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full transition-colors ${
              watchlist.length > 0
                ? "bg-violet-600/30 text-violet-300 border border-violet-500/30"
                : "bg-dark-500 text-slate-400"
            }`}
          >
            {watchlist.length}
          </span>
        </button>

        <button
          onClick={() => navigate("/portfolio")}
          className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
            isActive("/portfolio")
              ? "text-white bg-dark-600 border border-dark-400"
              : "text-slate-400 hover:text-white hover:bg-dark-600"
          }`}
        >
          Portfolio
        </button>

        {user ? (
          <>
            {/* Boost score */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-3 py-1.5 rounded-lg">
              <span className="text-amber-300">⚡</span>
              {(user.boostScore ?? 2443).toLocaleString()}
            </div>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-85 transition-opacity select-none" title={user.name}>
              {(user.name || "U")[0].toUpperCase()}
            </div>
          </>
        ) : (
          /* Sign In button */
          <button
            onClick={openOverlay}
            className="text-sm font-medium px-4 py-1.5 rounded-lg border border-violet-500/40 text-violet-400 hover:text-violet-300 hover:bg-violet-600/15 hover:border-violet-500/60 transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
