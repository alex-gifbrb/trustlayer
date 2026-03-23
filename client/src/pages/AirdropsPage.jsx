import { useState, useEffect } from "react";
import { useWatchlist } from "../context/WatchlistContext";

// ── Mock data ─────────────────────────────────────────────────────────────────

const AIRDROPS = [
  {
    id: "layerzero",
    name: "LayerZero",
    ticker: "ZRO",
    chain: "Ethereum",
    chainColor: "#627eea",
    logo: "L",
    logoColor: "#8b5cf6",
    status: "live",
    description: "Cross-chain messaging protocol airdropping to early users who bridged assets across supported chains.",
    totalRewards: "50M ZRO",
    estValue: "$500",
    timing: "3 days",
    timingLabel: "Ends in",
    difficulty: "Medium",
    tasks: ["Bridge Assets", "Hold Tokens", "Follow on X", "Complete Transactions"],
    participants: 842000,
    featured: true,
  },
  {
    id: "aztec",
    name: "Aztec",
    ticker: "AZTEC",
    chain: "Ethereum",
    chainColor: "#627eea",
    logo: "A",
    logoColor: "#6366f1",
    status: "live",
    description: "Privacy-first zkRollup rewarding early testers of the Aztec sandbox and deployed contracts.",
    totalRewards: "100M AZTEC",
    estValue: "$1,200",
    timing: "7 days",
    timingLabel: "Ends in",
    difficulty: "Hard",
    tasks: ["Deploy Contract", "Complete Transactions", "Join Discord", "Follow on X"],
    participants: 210000,
    featured: false,
  },
  {
    id: "superform",
    name: "Superform",
    ticker: "UP",
    chain: "Base",
    chainColor: "#0052ff",
    logo: "S",
    logoColor: "#0ea5e9",
    status: "upcoming",
    description: "Yield marketplace on Base rewarding liquidity providers and early depositors across vaults.",
    totalRewards: "25M UP",
    estValue: "$300",
    timing: "2 days",
    timingLabel: "Starts in",
    difficulty: "Easy",
    tasks: ["Hold Tokens", "Join Discord", "Follow on X"],
    participants: 94000,
    featured: false,
  },
  {
    id: "starknet",
    name: "StarkNet",
    ticker: "STRK",
    chain: "Ethereum",
    chainColor: "#627eea",
    logo: "S",
    logoColor: "#ec4899",
    status: "upcoming",
    description: "Layer 2 ZK-rollup distributing tokens to developers and users who interacted with Starknet dApps.",
    totalRewards: "75M STRK",
    estValue: "$800",
    timing: "5 days",
    timingLabel: "Starts in",
    difficulty: "Medium",
    tasks: ["Complete Transactions", "Deploy Contract", "Bridge Assets", "Hold Tokens"],
    participants: 530000,
    featured: false,
  },
  {
    id: "morpho",
    name: "Morpho",
    ticker: "MOR",
    chain: "Ethereum",
    chainColor: "#627eea",
    logo: "M",
    logoColor: "#10b981",
    status: "live",
    description: "Peer-to-peer lending optimizer rewarding suppliers and borrowers on Compound and Aave markets.",
    totalRewards: "30M MOR",
    estValue: "$450",
    timing: "1 day",
    timingLabel: "Ends in",
    difficulty: "Easy",
    tasks: ["Hold Tokens", "Supply Liquidity", "Follow on X"],
    participants: 178000,
    featured: false,
  },
  {
    id: "orbitaldao",
    name: "OrbitalDAO",
    ticker: "ORB",
    chain: "TON",
    chainColor: "#0088cc",
    logo: "O",
    logoColor: "#0088cc",
    status: "upcoming",
    description: "Decentralized autonomous organization on TON blockchain rewarding early governance participants.",
    totalRewards: "200M ORB",
    estValue: "$250",
    timing: "10 days",
    timingLabel: "Starts in",
    difficulty: "Easy",
    tasks: ["Join Discord", "Follow on X", "Hold Tokens"],
    participants: 62000,
    featured: false,
  },
  {
    id: "ciphernet",
    name: "CipherNet",
    ticker: "CPH",
    chain: "BNB",
    chainColor: "#f3ba2f",
    logo: "C",
    logoColor: "#f59e0b",
    status: "ended",
    description: "Privacy network on BNB Chain that rewarded early node operators and testnet participants.",
    totalRewards: "40M CPH",
    estValue: "$0",
    timing: "Ended",
    timingLabel: "",
    difficulty: "Hard",
    tasks: ["Run Node", "Complete Transactions", "Bridge Assets", "Hold Tokens"],
    participants: 320000,
    featured: false,
  },
  {
    id: "echofi",
    name: "EchoFi",
    ticker: "ECH",
    chain: "Base",
    chainColor: "#0052ff",
    logo: "E",
    logoColor: "#6366f1",
    status: "ended",
    description: "Social trading protocol on Base Chain that rewarded copy-traders and signal providers.",
    totalRewards: "15M ECH",
    estValue: "$0",
    timing: "Ended",
    timingLabel: "",
    difficulty: "Medium",
    tasks: ["Follow on X", "Join Discord", "Complete Transactions"],
    participants: 88000,
    featured: false,
  },
];

const CALENDAR = [
  { name: "Superform (UP)",   date: "Mar 25, 2026", estValue: "$300",   color: "#0ea5e9" },
  { name: "StarkNet (STRK)",  date: "Mar 28, 2026", estValue: "$800",   color: "#ec4899" },
  { name: "OrbitalDAO (ORB)", date: "Apr 2, 2026",  estValue: "$250",   color: "#0088cc" },
];

const HOW_IT_WORKS = [
  { emoji: "🔍", title: "Discover",        desc: "Find curated airdrops vetted by our research team" },
  { emoji: "✅", title: "Complete Tasks",  desc: "Follow the required steps to qualify for rewards" },
  { emoji: "💰", title: "Claim Rewards",   desc: "Receive tokens directly to your connected wallet" },
];

const FILTER_TABS = ["All", "Live", "Upcoming", "Ended"];

// ── Countdown hook ────────────────────────────────────────────────────────────

function useSimpleCountdown(days) {
  const targetMs = Date.now() + days * 86400000;
  const calc = () => {
    const diff = targetMs - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// ── Helper components ─────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  live:     { label: "LIVE",     bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  upcoming: { label: "UPCOMING", bg: "bg-sky-500/15",     text: "text-sky-400",     border: "border-sky-500/30",     dot: null },
  ended:    { label: "ENDED",    bg: "bg-slate-500/15",   text: "text-slate-400",   border: "border-slate-500/30",   dot: null },
};

const DIFF_CONFIG = {
  Easy:   { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  Medium: { color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20"   },
  Hard:   { color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20"     },
};

function StatusBadge({ status, pulse = false }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${pulse ? "animate-pulse" : ""}`} />
      )}
      {cfg.label}
    </span>
  );
}

function DifficultyBadge({ difficulty }) {
  const cfg = DIFF_CONFIG[difficulty] || DIFF_CONFIG.Medium;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      {difficulty}
    </span>
  );
}

function ChainBadge({ chain, color }) {
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-dark-400 bg-dark-600 text-slate-400">
      {chain}
    </span>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="bg-dark-600 border border-dark-400 rounded-lg px-3 py-2 min-w-0">
      <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-xs font-bold text-slate-200 truncate">{value}</p>
    </div>
  );
}

// ── Featured hero card ────────────────────────────────────────────────────────

function FeaturedCard({ airdrop }) {
  const days = parseInt(airdrop.timing);
  const t = useSimpleCountdown(days);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-600/15 via-dark-700 to-indigo-600/10 p-6 mb-6">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0"
              style={{ background: airdrop.logoColor + "33", border: `1.5px solid ${airdrop.logoColor}55`, color: airdrop.logoColor }}
            >
              {airdrop.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black text-white">{airdrop.name}</span>
                <span className="text-sm text-slate-400 font-medium">{airdrop.ticker}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="live" pulse />
                <ChainBadge chain={airdrop.chain} />
                <DifficultyBadge difficulty={airdrop.difficulty} />
              </div>
            </div>
          </div>

          {/* Participant count */}
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-black text-white">{(airdrop.participants / 1000).toFixed(0)}K</p>
            <p className="text-xs text-slate-400">participants</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-5">{airdrop.description}</p>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <StatPill label="Total Rewards" value={airdrop.totalRewards} />
          <StatPill label="Est. Value"    value={airdrop.estValue} />
          <div className="bg-dark-600 border border-dark-400 rounded-lg px-3 py-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Ends In</p>
            <p className="text-xs font-bold text-emerald-400 tabular-nums">
              {t.days}d {String(t.hours).padStart(2,"0")}h {String(t.minutes).padStart(2,"0")}m {String(t.seconds).padStart(2,"0")}s
            </p>
          </div>
          <StatPill label="Difficulty" value={airdrop.difficulty} />
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
            Claim Airdrop →
          </button>
          <button className="px-5 py-2.5 rounded-xl border border-violet-500/40 text-violet-400 hover:bg-violet-600/10 hover:border-violet-500/60 text-sm font-semibold transition-colors">
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Airdrop card ──────────────────────────────────────────────────────────────

function AirdropCard({ airdrop }) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="bg-dark-700 border border-dark-500 rounded-xl p-4 hover:border-dark-400 transition-colors flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
            style={{ background: airdrop.logoColor + "33", border: `1px solid ${airdrop.logoColor}55`, color: airdrop.logoColor }}
          >
            {airdrop.logo}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-white">{airdrop.name}</span>
              <span className="text-xs text-slate-500">{airdrop.ticker}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <StatusBadge status={airdrop.status} pulse={airdrop.status === "live"} />
              <ChainBadge chain={airdrop.chain} />
            </div>
          </div>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => setBookmarked(v => !v)}
          className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
            bookmarked ? "text-violet-400 bg-violet-600/15" : "text-slate-600 hover:text-slate-300 hover:bg-dark-600"
          }`}
          title={bookmarked ? "Remove bookmark" : "Bookmark"}
        >
          <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{airdrop.description}</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatPill label="Total Rewards" value={airdrop.totalRewards} />
        <StatPill label="Est. Value"    value={airdrop.estValue} />
        <StatPill label={airdrop.timingLabel || "Status"} value={airdrop.timing} />
        <div className="bg-dark-600 border border-dark-400 rounded-lg px-3 py-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Difficulty</p>
          <DifficultyBadge difficulty={airdrop.difficulty} />
        </div>
      </div>

      {/* Task chips */}
      <div className="flex flex-wrap gap-1.5">
        {airdrop.tasks.map((task) => (
          <span
            key={task}
            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-dark-600 border border-dark-400 text-slate-400"
          >
            {task}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button
        disabled={airdrop.status === "ended"}
        className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
          airdrop.status === "ended"
            ? "bg-dark-600 text-slate-500 cursor-not-allowed border border-dark-400"
            : "bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 hover:border-violet-500/50"
        }`}
      >
        {airdrop.status === "ended" ? "Airdrop Ended" : "View Airdrop →"}
      </button>
    </div>
  );
}

// ── Calendar sidebar ──────────────────────────────────────────────────────────

function AirdropCalendar() {
  return (
    <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-500 flex items-center gap-2">
        <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-semibold text-white">Airdrop Calendar</p>
      </div>

      <div className="divide-y divide-dark-600">
        {CALENDAR.map((item) => (
          <div key={item.name} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-xs font-semibold text-slate-200">{item.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.date}</p>
              </div>
              <span className="text-xs font-bold text-emerald-400">{item.estValue}</span>
            </div>
            <button className="w-full text-xs font-medium py-1.5 rounded-lg border border-dark-400 bg-dark-600 hover:bg-dark-500 text-slate-400 hover:text-slate-200 transition-colors">
              Set Reminder
            </button>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="px-4 py-3 border-t border-dark-500 bg-dark-800/40">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Overview</p>
        <div className="space-y-1.5">
          {[
            { label: "Live now",    value: "3 airdrops" },
            { label: "Coming soon", value: "3 airdrops" },
            { label: "Est. total",  value: "~$2,000+"   },
          ].map((s) => (
            <div key={s.label} className="flex justify-between text-xs">
              <span className="text-slate-500">{s.label}</span>
              <span className="text-slate-300 font-medium">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <div className="mt-8 mb-6">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        How Airdrops Work on Trust.net
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {HOW_IT_WORKS.map((step) => (
          <div
            key={step.title}
            className="bg-dark-700 border border-dark-500 rounded-xl p-5 text-center"
          >
            <div className="text-3xl mb-3">{step.emoji}</div>
            <p className="text-sm font-bold text-white mb-1.5">{step.title}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AirdropsPage() {
  const [filter, setFilter] = useState("All");

  const featured = AIRDROPS.find((a) => a.featured);
  const filtered = AIRDROPS.filter((a) => {
    if (filter === "All") return true;
    return a.status === filter.toLowerCase();
  });

  // Count per tab
  const counts = {
    All:      AIRDROPS.length,
    Live:     AIRDROPS.filter(a => a.status === "live").length,
    Upcoming: AIRDROPS.filter(a => a.status === "upcoming").length,
    Ended:    AIRDROPS.filter(a => a.status === "ended").length,
  };

  return (
    <div className="px-6 py-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Airdrops</h1>
        <p className="text-sm text-slate-400">
          Discover and track the most promising upcoming and live airdrops
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-dark-500 pb-0">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
              filter === tab
                ? "text-violet-400 border-violet-500"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            {tab}
            <span className={`text-xs px-1.5 py-0.5 rounded-full tabular-nums ${
              filter === tab
                ? "bg-violet-600/30 text-violet-300"
                : "bg-dark-600 text-slate-500"
            }`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Featured card — only show when filter is All or Live */}
          {(filter === "All" || filter === "Live") && featured && (
            <FeaturedCard airdrop={featured} />
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="bg-dark-700 border border-dark-500 rounded-xl p-10 text-center">
              <p className="text-slate-400 text-sm">No airdrops found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map((a) => (
                <AirdropCard key={a.id} airdrop={a} />
              ))}
            </div>
          )}

          {/* How it works */}
          <HowItWorks />
        </div>

        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 sticky top-[108px]">
          <AirdropCalendar />
        </div>
      </div>
    </div>
  );
}
