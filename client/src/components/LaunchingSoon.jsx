import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useCountdown(targetDate) {
  const calculate = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculate);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-dark-600 border border-dark-400 rounded-lg w-14 h-14 flex items-center justify-center">
        <span className="text-xl font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-slate-500 mt-1.5 font-medium">{label}</span>
    </div>
  );
}

export default function LaunchingSoon({ projects }) {
  const navigate = useNavigate();
  const launching = projects.filter((p) => p.category === "launchingSoon");
  const project = launching[0];

  const timeLeft = useCountdown(project?.launchDate);

  if (!project) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚀</span>
          <h2 className="text-base font-semibold text-white">Launching Soon</h2>
          <span className="flex items-center gap-1 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Live
          </span>
        </div>
        <button className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors">
          View all →
        </button>
      </div>

      <div
        onClick={() => navigate(`/project/${project.ticker}`)}
        className="bg-dark-700 border border-dark-500 rounded-xl p-5 hover:border-dark-400 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between flex-wrap gap-6">
          {/* Project info */}
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{
                backgroundColor: project.color + "33",
                border: `1px solid ${project.color}55`,
              }}
            >
              <span style={{ color: project.color }}>{project.logo}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base font-bold text-white">{project.name}</p>
                <span className="text-xs font-medium text-slate-500 bg-dark-500 border border-dark-400 px-2 py-0.5 rounded-full">
                  {project.ticker}
                </span>
                <span className="text-xs bg-dark-500 text-slate-400 px-2 py-0.5 rounded-full border border-dark-400">
                  {project.chain}
                </span>
              </div>
              <p className="text-xl font-bold text-white">{project.priceFormatted}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-slate-500">
                  FDV:{" "}
                  <span className="text-slate-300 font-medium">
                    ${(project.fdv / 1000000).toFixed(1)}M
                  </span>
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-400">
                  <span>⚡</span>
                  <span className="font-semibold">{project.boosts}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div>
            <p className="text-xs text-slate-500 font-medium mb-3 text-center">
              Launches in
            </p>
            <div className="flex items-start gap-2">
              <TimeUnit value={timeLeft.days} label="DAYS" />
              <span className="text-slate-400 font-bold text-xl mt-3">:</span>
              <TimeUnit value={timeLeft.hours} label="HRS" />
              <span className="text-slate-400 font-bold text-xl mt-3">:</span>
              <TimeUnit value={timeLeft.minutes} label="MIN" />
              <span className="text-slate-400 font-bold text-xl mt-3">:</span>
              <TimeUnit value={timeLeft.seconds} label="SEC" />
            </div>
          </div>

          {/* Sentiment + action */}
          <div className="flex flex-col items-end gap-3 min-w-[160px]">
            <div className="w-full">
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
            <button className="w-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              View Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
