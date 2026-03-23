import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";

function formatVolume(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function formatFDV(n) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

function ChangeCell({ value }) {
  const isPositive = value >= 0;
  return (
    <span className={`text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
      {isPositive ? "+" : ""}
      {value}%
    </span>
  );
}

const chainColors = {
  ETH: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
  BASE: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400" },
  SOL: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
};

export default function PreSalesTable({ projects }) {
  const navigate = useNavigate();
  const { isWatched, toggle } = useWatchlist();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h2 className="text-base font-semibold text-white">All Pre-Sales</h2>
          <span className="text-xs bg-dark-500 border border-dark-400 text-slate-400 px-2 py-0.5 rounded-full">
            {projects.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs text-slate-400 hover:text-slate-200 bg-dark-600 border border-dark-500 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter
          </button>
        </div>
      </div>

      <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-500">
                <th className="w-8 px-4 py-3" />
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Coin</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Chain</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">1h %</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">24h %</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">24h Volume</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">FDV</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Added</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, idx) => {
                const chain = chainColors[project.chain] || chainColors.ETH;
                const watched = isWatched(project.ticker);
                return (
                  <tr
                    key={project.id}
                    onClick={() => navigate(`/project/${project.ticker}`)}
                    className="border-b border-dark-600 last:border-0 hover:bg-dark-600/50 transition-colors cursor-pointer group"
                  >
                    {/* Star */}
                    <td className="pl-4 pr-1 py-3.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggle(project.ticker); }}
                        title={watched ? "Remove from watchlist" : "Add to watchlist"}
                        className={`transition-colors ${watched ? "text-amber-400 hover:text-slate-400" : "text-slate-700 hover:text-amber-400"}`}
                      >
                        <svg className="w-4 h-4" fill={watched ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                          style={{ backgroundColor: project.color + "33", border: `1px solid ${project.color}55`, color: project.color }}
                        >
                          {project.logo}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                            {project.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">{project.ticker}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-semibold text-white">{project.priceFormatted}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${chain.bg} ${chain.border} ${chain.text}`}>
                        {project.chain}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right"><ChangeCell value={project.change1h} /></td>
                    <td className="px-4 py-3.5 text-right"><ChangeCell value={project.change24h} /></td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm text-slate-300 font-medium">{formatVolume(project.volume24h)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm text-slate-300 font-medium">{formatFDV(project.fdv)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-xs text-slate-500">{project.lastAdded}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
