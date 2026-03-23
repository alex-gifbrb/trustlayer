import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";

function StarButton({ ticker }) {
  const { isWatched, toggle } = useWatchlist();
  const watched = isWatched(ticker);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggle(ticker); }}
      title={watched ? "Remove from watchlist" : "Add to watchlist"}
      className={`transition-colors ${watched ? "text-amber-400 hover:text-slate-400" : "text-slate-600 hover:text-amber-400"}`}
    >
      <svg className="w-4 h-4" fill={watched ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    </button>
  );
}

function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/project/${project.ticker}`)}
      className="flex-1 min-w-0 bg-dark-700 border border-dark-500 rounded-xl p-4 hover:border-dark-400 transition-all hover:bg-dark-600/50 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: project.color + "33", border: `1px solid ${project.color}55` }}
          >
            <span style={{ color: project.color }}>{project.logo}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
              {project.name}
            </p>
            <p className="text-xs text-slate-500 font-medium">{project.ticker}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarButton ticker={project.ticker} />
          <span className="text-xs bg-dark-500 text-slate-400 px-2 py-0.5 rounded-full border border-dark-400">
            {project.chain}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-3">
        <p className="text-lg font-bold text-white">{project.priceFormatted}</p>
        <p className={`text-xs font-medium mt-0.5 ${project.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {project.change24h >= 0 ? "+" : ""}
          {project.change24h}% 24h
        </p>
      </div>

      {/* Boost */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-amber-400 text-sm">⚡</span>
        <span className="text-sm font-semibold text-slate-200">{project.boosts.toLocaleString()}</span>
        <span className="text-xs text-slate-500">boosts</span>
      </div>

      {/* Sentiment bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-emerald-400 font-medium">🐂 {project.bullish}%</span>
          <span className="text-red-400 font-medium">{project.bearish}% 🐻</span>
        </div>
        <div className="h-1.5 rounded-full bg-dark-400 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            style={{ width: `${project.bullish}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function MostTalkedAbout({ projects }) {
  const mostTalked = projects.filter((p) => p.category === "mostTalked");

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h2 className="text-base font-semibold text-white">Most Talked About</h2>
          <span className="text-xs bg-dark-500 border border-dark-400 text-slate-400 px-2 py-0.5 rounded-full">
            {mostTalked.length}
          </span>
        </div>
        <button className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors">
          View all →
        </button>
      </div>
      <div className="flex gap-4">
        {mostTalked.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
