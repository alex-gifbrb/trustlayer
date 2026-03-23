import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useCountdown(targetDate) {
  const calculate = () => {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
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
    const t = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return timeLeft;
}

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-dark-600 border border-dark-400 rounded-lg w-11 h-11 flex items-center justify-center">
        <span className="text-base font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">{label}</span>
    </div>
  );
}

const rankSuffix = (n) => {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
};

const gradeColor = (g) => {
  if (g?.startsWith("AA")) return "text-emerald-400";
  if (g?.startsWith("A")) return "text-blue-400";
  if (g?.startsWith("B")) return "text-amber-400";
  return "text-red-400";
};

export default function ProjectSidebar({ project }) {
  const navigate = useNavigate();
  const presale = project.presale || {};
  const rating = project.rating || {};
  const links = project.links || {};
  const team = project.team || {};

  const timeLeft = useCountdown(presale.endsAt);
  const raisedPct = presale.goal
    ? Math.min(100, (presale.raised / presale.goal) * 100)
    : 0;

  const formatMoney = (n) => {
    if (!n) return "$0";
    return "$" + n.toLocaleString();
  };

  return (
    <div className="space-y-3 sticky top-[108px]">
      {/* Identity card */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
            style={{
              backgroundColor: project.color + "33",
              border: `1px solid ${project.color}55`,
              color: project.color,
            }}
          >
            {project.logo}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-base font-bold text-white">{project.name}</p>
              <span className="text-xs text-slate-500 bg-dark-500 border border-dark-400 px-2 py-0.5 rounded-full">
                {project.ticker}
              </span>
            </div>
            {presale.badge && (
              <span className="inline-block mt-1 text-xs font-semibold bg-blue-500/15 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded-full">
                {presale.badge}
              </span>
            )}
          </div>
          <div className="ml-auto text-right flex-shrink-0">
            <p className="text-lg font-bold text-white">{project.priceFormatted}</p>
            <p
              className={`text-xs font-medium ${
                project.change24h >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {project.change24h >= 0 ? "+" : ""}
              {project.change24h}% 24h
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="space-y-2">
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
            Join Pre-Sale
          </button>
          <button
            onClick={() => navigate(`/project/${project.ticker}/research`)}
            className="w-full bg-dark-600 hover:bg-dark-500 border border-dark-400 hover:border-violet-500/40 text-slate-300 hover:text-violet-300 text-sm font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Research in AI Mode
          </button>
        </div>
      </div>

      {/* Countdown */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Ends in
        </p>
        <div className="flex items-start justify-between">
          <TimeBox value={timeLeft.days} label="DAYS" />
          <span className="text-slate-500 font-bold text-lg mt-2">:</span>
          <TimeBox value={timeLeft.hours} label="HRS" />
          <span className="text-slate-500 font-bold text-lg mt-2">:</span>
          <TimeBox value={timeLeft.minutes} label="MIN" />
          <span className="text-slate-500 font-bold text-lg mt-2">:</span>
          <TimeBox value={timeLeft.seconds} label="SEC" />
        </div>
      </div>

      {/* Rating */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Rating
        </p>
        <div className="grid grid-cols-2 gap-3">
          {/* Boost rank */}
          <div className="bg-dark-600 border border-dark-400 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-amber-400 text-sm">⚡</span>
              <span className="text-xs text-slate-500 font-medium">Boost Rank</span>
            </div>
            <p className="text-lg font-bold text-white">
              {rating.boostRank}
              <span className="text-sm text-slate-400">
                {rankSuffix(rating.boostRank)}
              </span>
            </p>
            <p className="text-xs text-amber-400 font-semibold mt-0.5">
              {(rating.boostScore || 0).toLocaleString()} pts
            </p>
          </div>

          {/* Security score */}
          <div className="bg-dark-600 border border-dark-400 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-xs text-slate-500 font-medium">Security</span>
            </div>
            <p className={`text-lg font-bold ${gradeColor(rating.securityGrade)}`}>
              {rating.securityGrade}
            </p>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              {rating.securityScore}
            </p>
          </div>
        </div>
      </div>

      {/* Community sentiment */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Community Sentiment
        </p>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-emerald-400 font-semibold">🐂 Bullish {project.bullish}%</span>
          <span className="text-red-400 font-semibold">{project.bearish}% Bearish 🐻</span>
        </div>
        <div className="h-2 rounded-full bg-dark-400 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            style={{ width: `${project.bullish}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-500">
            {Math.round((project.boosts * project.bullish) / 100).toLocaleString()} votes
          </span>
          <span className="text-xs text-slate-500">
            {Math.round((project.boosts * project.bearish) / 100).toLocaleString()} votes
          </span>
        </div>
      </div>

      {/* Fundraise goal */}
      {presale.goal && (
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fundraise Goal
            </p>
            <span className="text-xs font-semibold text-violet-400">
              {raisedPct.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-dark-400 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400"
              style={{ width: `${raisedPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1.5">
            <span className="text-slate-300 font-semibold">
              {formatMoney(presale.raised)} raised
            </span>
            <span className="text-slate-500">
              of {formatMoney(presale.goal)}
            </span>
          </div>
        </div>
      )}

      {/* Team & docs */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-4 space-y-3">
        {/* Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium text-slate-300">Team</span>
          </div>
          {team.status && (
            <span className="text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full">
              {team.status}
            </span>
          )}
        </div>

        {team.members && (
          <div className="flex -space-x-2 mt-1">
            {team.members.slice(0, 5).map((m) => (
              <div
                key={m.name}
                title={`${m.name} — ${m.role}`}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 border-2 border-dark-700 flex items-center justify-center text-white text-[10px] font-bold cursor-default"
              >
                {m.avatar}
              </div>
            ))}
            {team.members.length > 5 && (
              <div className="w-7 h-7 rounded-full bg-dark-500 border-2 border-dark-700 flex items-center justify-center text-slate-400 text-[10px] font-bold">
                +{team.members.length - 5}
              </div>
            )}
          </div>
        )}

        <div className="border-t border-dark-500 pt-3 space-y-2">
          {/* Whitepaper */}
          <a
            href={links.whitepaper || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-sm text-slate-300 hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Whitepaper
            </div>
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>

          {/* Website */}
          <a
            href={links.website || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-sm text-slate-300 hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Website
            </div>
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Socials */}
        <div className="border-t border-dark-500 pt-3">
          <p className="text-xs text-slate-500 font-medium mb-2.5">Socials</p>
          <div className="flex gap-2">
            {links.twitter && (
              <a
                href={links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-600 border border-dark-400 hover:border-dark-300 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                title="Twitter / X"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {links.telegram && (
              <a
                href={links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-600 border border-dark-400 hover:border-dark-300 flex items-center justify-center text-slate-400 hover:text-sky-400 transition-all"
                title="Telegram"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            )}
            {links.discord && (
              <a
                href={links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-600 border border-dark-400 hover:border-dark-300 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-all"
                title="Discord"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z" />
                </svg>
              </a>
            )}
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-dark-600 border border-dark-400 hover:border-dark-300 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                title="GitHub"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
