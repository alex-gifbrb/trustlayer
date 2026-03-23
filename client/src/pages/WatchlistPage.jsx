import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import TrustAiCard from "../components/TrustAiCard";

const AI_SUMMARY =
  "Your watchlist currently spans DeFi lending and metaverse infrastructure — two high-conviction sectors with different risk profiles. Morpho's fundamentals are strong with deep liquidity, making it a lower-volatility anchor. Xyzverse is an early-stage bet with higher upside potential but more execution risk. Combined sentiment across your watchlist is 73% bullish. Consider setting price alerts for XYZ around the $0.009 resistance level.";

function SentimentBar({ bullish, bearish }) {
  return (
    <div className="w-32">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-emerald-400 font-medium">{bullish}%</span>
        <span className="text-red-400 font-medium">{bearish}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-dark-400 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          style={{ width: `${bullish}%` }}
        />
      </div>
    </div>
  );
}

function ChangeCell({ value }) {
  const pos = value >= 0;
  return (
    <span className={`text-xs font-semibold ${pos ? "text-emerald-400" : "text-red-400"}`}>
      {pos ? "+" : ""}{value}%
    </span>
  );
}

function formatVolume(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const chainColors = {
  ETH: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
  BASE: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400" },
  SOL: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
};

export default function WatchlistPage() {
  const navigate = useNavigate();
  const { watchlist, toggle } = useWatchlist();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((json) => {
        setProjects(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const watched = projects.filter((p) => watchlist.includes(p.ticker));

  return (
    <div className="p-6 max-w-[1200px]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-white">Watchlist</h1>
          <span className="text-xs bg-dark-500 border border-dark-400 text-slate-400 px-2 py-0.5 rounded-full">
            {watchlist.length}
          </span>
        </div>
        <p className="text-sm text-slate-500">Projects you're tracking</p>
      </div>

      {/* Trust.ai card */}
      <TrustAiCard summary={AI_SUMMARY} />

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : watched.length === 0 ? (
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-dark-600 border border-dark-400 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-400 mb-1">Your watchlist is empty</p>
          <p className="text-xs text-slate-600 mb-4">Star projects from the Projects page to track them here</p>
          <button
            onClick={() => navigate("/")}
            className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            Discover Projects →
          </button>
        </div>
      ) : (
        <>
          <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-500">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-8" />
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Coin</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Chain</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">1h %</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">24h %</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">24h Volume</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {watched.map((p) => {
                  const chain = chainColors[p.chain] || chainColors.ETH;
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-dark-600 last:border-0 hover:bg-dark-600/40 transition-colors group"
                    >
                      {/* Star / remove */}
                      <td className="pl-4 pr-2 py-3.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggle(p.ticker); }}
                          className="text-amber-400 hover:text-slate-400 transition-colors"
                          title="Remove from watchlist"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        </button>
                      </td>
                      {/* Coin */}
                      <td
                        className="px-4 py-3.5 cursor-pointer"
                        onClick={() => navigate(`/project/${p.ticker}`)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                            style={{ backgroundColor: p.color + "33", border: `1px solid ${p.color}55`, color: p.color }}
                          >
                            {p.logo}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                              {p.name}
                            </p>
                            <p className="text-xs text-slate-500">{p.ticker}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm font-semibold text-white">{p.priceFormatted}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${chain.bg} ${chain.border} ${chain.text}`}>
                          {p.chain}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right"><ChangeCell value={p.change1h} /></td>
                      <td className="px-4 py-3.5 text-right"><ChangeCell value={p.change24h} /></td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm text-slate-300 font-medium">{formatVolume(p.volume24h)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <SentimentBar bullish={p.bullish} bearish={p.bearish} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Discover more projects →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
