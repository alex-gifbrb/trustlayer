import { createContext, useContext, useState, useCallback } from "react";

// Default watchlist tickers pre-populated on first load
const DEFAULTS = ["XYZ", "MORPHO"];

function loadFromStorage() {
  try {
    const raw = localStorage.getItem("trustnet_watchlist");
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULTS;
}

function saveToStorage(tickers) {
  try {
    localStorage.setItem("trustnet_watchlist", JSON.stringify(tickers));
  } catch {}
}

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(loadFromStorage);

  const toggle = useCallback((ticker) => {
    setWatchlist((prev) => {
      const next = prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker];
      saveToStorage(next);
      return next;
    });
  }, []);

  const isWatched = useCallback(
    (ticker) => watchlist.includes(ticker),
    [watchlist]
  );

  return (
    <WatchlistContext.Provider value={{ watchlist, toggle, isWatched }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used inside WatchlistProvider");
  return ctx;
}
