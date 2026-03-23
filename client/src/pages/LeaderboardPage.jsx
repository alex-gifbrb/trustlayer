import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Data ──────────────────────────────────────────────────────────────────────

const CHAIN_STYLES = {
  Solana:  { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-300" },
  Ton:     { bg: "bg-blue-500/10",   border: "border-blue-500/30",   text: "text-blue-300"   },
  Base:    { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-300" },
  BNB:     { bg: "bg-amber-500/10",  border: "border-amber-500/30",  text: "text-amber-300"  },
};

const PROJECTS = [
  { rank: 1,  ticker: "AZTEC",  name: "Aztec",        logo: "A",  color: "#8B5CF6", chain: "Solana", boosts: 183, comments: 41,  change: +2,   isNew: false, sponsored: false, presale: true,  description: "Privacy-first ZK Layer 2 for confidential DeFi" },
  { rank: 2,  ticker: "NXS",    name: "NexusAI",      logo: "N",  color: "#06B6D4", chain: "Solana", boosts: 156, comments: 38,  change: +1,   isNew: false, sponsored: true,  presale: true,  description: "AI-powered DeFi routing and yield optimisation" },
  { rank: 3,  ticker: "UP",     name: "Superform",    logo: "S",  color: "#10B981", chain: "Solana", boosts: 144, comments: 29,  change: +1,   isNew: false, sponsored: false, presale: true,  description: "Universal yield marketplace aggregating 40+ protocols" },
  { rank: 4,  ticker: "XYZ",    name: "Xyzverse",     logo: "X",  color: "#F59E0B", chain: "Ton",    boosts: 183, comments: 55,  change: -2,   isNew: false, sponsored: false, presale: true,  description: "Next-gen metaverse protocol with play-to-earn economy" },
  { rank: 5,  ticker: "QTP",    name: "QuantumPad",   logo: "Q",  color: "#F97316", chain: "Solana", boosts: 121, comments: 24,  change: 0,    isNew: true,  sponsored: true,  presale: true,  description: "AI-powered launchpad for fair and transparent token launches" },
  { rank: 6,  ticker: "PUMP",   name: "Pump.fun",     logo: "P",  color: "#EF4444", chain: "BNB",    boosts:  44, comments: 17,  change: -1,   isNew: false, sponsored: false, presale: false, description: "Community-driven meme token launchpad on BNB Chain" },
  { rank: 7,  ticker: "VLX",    name: "VaultX",       logo: "V",  color: "#3B82F6", chain: "Base",   boosts:  98, comments: 22,  change: +3,   isNew: false, sponsored: false, presale: true,  description: "Institutional-grade custody and asset management infrastructure" },
  { rank: 8,  ticker: "ORB",    name: "OrbitalDAO",   logo: "O",  color: "#A855F7", chain: "Ton",    boosts:  87, comments: 31,  change: 0,    isNew: true,  sponsored: false, presale: true,  description: "Community-governed DAO for cross-chain treasury management" },
  { rank: 9,  ticker: "FLX",    name: "FluxBridge",   logo: "F",  color: "#14B8A6", chain: "BNB",    boosts:  76, comments: 19,  change: -1,   isNew: false, sponsored: false, presale: true,  description: "Cross-chain liquidity routing with MEV protection" },
  { rank: 10, ticker: "SER",    name: "Serena",       logo: "SR", color: "#EC4899", chain: "Solana", boosts:  12, comments:  8,  change: -2,   isNew: false, sponsored: false, presale: false, description: "Intent-based trading protocol with natural language orders" },
  { rank: 11, ticker: "DPM",    name: "DeepMint",     logo: "D",  color: "#6366F1", chain: "Base",   boosts:  71, comments: 15,  change: +2,   isNew: false, sponsored: false, presale: true,  description: "NFT infrastructure and minting-as-a-service platform" },
  { rank: 12, ticker: "MOR",    name: "Morpho",       logo: "M",  color: "#06B6D4", chain: "Ton",    boosts:  46, comments: 13,  change: +1,   isNew: false, sponsored: false, presale: false, description: "Peer-to-peer lending optimizer on top of Aave and Compound" },
  { rank: 13, ticker: "STS",    name: "StellarSwap",  logo: "ST", color: "#F59E0B", chain: "Ton",    boosts:  65, comments: 11,  change: 0,    isNew: true,  sponsored: false, presale: true,  description: "Perpetuals exchange with up to 50× leverage and deep order books" },
  { rank: 14, ticker: "CPH",    name: "CipherNet",    logo: "C",  color: "#8B5CF6", chain: "BNB",    boosts:  58, comments: 14,  change: -1,   isNew: false, sponsored: false, presale: true,  description: "Privacy layer for EVM chains using ZK-proof transaction shielding" },
  { rank: 15, ticker: "BOLD",   name: "Bolt",         logo: "B",  color: "#10B981", chain: "BNB",    boosts:  33, comments:  9,  change: -2,   isNew: false, sponsored: false, presale: false, description: "High-speed payments network targeting sub-second settlement" },
  { rank: 16, ticker: "NVL",    name: "NovaLend",     logo: "NL", color: "#3B82F6", chain: "Solana", boosts:  51, comments: 16,  change: +1,   isNew: false, sponsored: false, presale: true,  description: "Undercollateralized lending using on-chain reputation scoring" },
  { rank: 17, ticker: "ECH",    name: "EchoFi",       logo: "E",  color: "#F97316", chain: "Base",   boosts:  44, comments: 12,  change: 0,    isNew: true,  sponsored: false, presale: true,  description: "Social trading platform where followers mirror top trader positions" },
  { rank: 18, ticker: "PRM",    name: "Prime",        logo: "PR", color: "#6B7280", chain: "BNB",    boosts:  28, comments:  7,  change: -3,   isNew: false, sponsored: false, presale: false, description: "Modular DeFi primitive suite for protocol builders" },
];

const POSTS = [
  {
    id: 1,
    user: "AnthonyDiLorio",
    role: "XYZ Team Member",
    verified: true,
    avatar: "AD",
    avatarColor: "#F59E0B",
    token: "834.8K XYZ",
    time: "2h ago",
    text: "Really excited to share that Xyzverse just completed its Sec3 security audit with zero critical findings 🔒 The full report is now on-chain. Pre-sale closes in 4 days — this is your last chance to get in at the early price. AMA tomorrow at 3PM UTC in Discord.",
    long: true,
    likes: 412,
    dislikes: 8,
    comments: 67,
  },
  {
    id: 2,
    user: "slouthboy",
    role: null,
    verified: false,
    avatar: "SL",
    avatarColor: "#8B5CF6",
    token: "12.4K AZTEC",
    time: "4h ago",
    text: "Been following Aztec since the early testnet. The ZK proof generation times have gone from 8 seconds down to under 400ms. That's not incremental progress, that's a different product. Positioning now before the mainnet announcement.",
    long: false,
    likes: 287,
    dislikes: 14,
    comments: 43,
  },
  {
    id: 3,
    user: "trust.ai",
    role: "Trust.net Official",
    verified: true,
    avatar: "T",
    avatarColor: "#6366F1",
    token: null,
    time: "5h ago",
    text: "Weekly market snapshot 📊 This week's leaderboard is dominated by ZK and AI-adjacent projects. Aztec holds the top spot for the third consecutive week. New entry QuantumPad debuted straight to #5 on the back of a viral demo video. Community sentiment across the top 10 averaged 74% bullish — above the 4-week average of 68%.",
    long: true,
    likes: 534,
    dislikes: 3,
    comments: 88,
  },
  {
    id: 4,
    user: "piraton",
    role: null,
    verified: false,
    avatar: "PI",
    avatarColor: "#10B981",
    token: "501.2K NXS",
    time: "7h ago",
    text: "NexusAI routing demo is live. Tested it myself — routed a $50K USDC → ETH swap across 6 DEXs and saved 0.4% versus 1inch. That's $200 in slippage savings on a single trade. At scale, the numbers become very interesting.",
    long: false,
    likes: 318,
    dislikes: 22,
    comments: 51,
  },
  {
    id: 5,
    user: "babyred",
    role: null,
    verified: false,
    avatar: "BR",
    avatarColor: "#EF4444",
    token: "67.9K UP",
    time: "9h ago",
    text: "Superform TVL just crossed $900M. For context: that's more than most \"established\" DeFi protocols that have been live for 2+ years. The UP token is still valued at a fraction of peers. Either the market hasn't caught up yet, or I'm missing something obvious.",
    long: false,
    likes: 203,
    dislikes: 31,
    comments: 39,
  },
  {
    id: 6,
    user: "smokeyespresso",
    role: null,
    verified: false,
    avatar: "SE",
    avatarColor: "#06B6D4",
    token: "3.2K VLX",
    time: "11h ago",
    text: "Unpopular opinion: the market is sleeping on VaultX. Institutional custody is boring to retail but it's the only product where a single client can bring $100M+ of TVL overnight. They already have 2 Tier-1 hedge funds in due diligence. Watch this one quietly.",
    long: false,
    likes: 156,
    dislikes: 47,
    comments: 28,
  },
];

// ── Countdown to next Monday 00:00 UTC ───────────────────────────────────────

function useWeekCountdown() {
  function calc() {
    const now = new Date();
    const next = new Date(now);
    // Day 1 = Monday (getDay: 0=Sun,1=Mon,...,6=Sat)
    const day = now.getUTCDay(); // 0=Sun
    const daysUntilMon = day === 0 ? 1 : 8 - day; // next Monday
    next.setUTCDate(now.getUTCDate() + daysUntilMon);
    next.setUTCHours(0, 0, 0, 0);
    const diff = next - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  }
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-dark-600 border border-dark-400 rounded-lg w-11 h-11 flex items-center justify-center">
        <span className="text-base font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide uppercase">{label}</span>
    </div>
  );
}

function RankBadge({ change, isNew }) {
  if (isNew) {
    return (
      <span className="text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">
        NEW
      </span>
    );
  }
  if (change === 0) {
    return <span className="text-xs text-slate-600 font-medium">—</span>;
  }
  if (change > 0) {
    return (
      <span className="flex items-center gap-0.5 text-emerald-400 text-xs font-semibold">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
        {change}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-red-400 text-xs font-semibold">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
      {Math.abs(change)}
    </span>
  );
}

function SponsoredTooltip() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <button className="w-4 h-4 rounded-full bg-dark-500 border border-dark-400 text-slate-500 hover:text-slate-300 text-[10px] font-bold flex items-center justify-center transition-colors">
        ?
      </button>
      {show && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-56 bg-dark-600 border border-dark-400 rounded-xl p-3 shadow-xl pointer-events-none">
          <p className="text-xs text-slate-300 leading-relaxed">
            Sponsored projects pay to appear here. Their ranking signal data is still real.
          </p>
        </div>
      )}
    </div>
  );
}

function ChainBadge({ chain }) {
  const s = CHAIN_STYLES[chain] ?? CHAIN_STYLES.Solana;
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${s.bg} ${s.border} ${s.text}`}>
      {chain}
    </span>
  );
}

function ProjectRow({ project, index }) {
  const navigate = useNavigate();
  const isTop3 = project.rank <= 3;

  return (
    <div
      onClick={() => navigate(`/project/${project.ticker}`)}
      className={`relative flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all group
        ${project.sponsored
          ? "border-l-2 border-amber-500/60 bg-amber-500/[0.03] hover:bg-amber-500/[0.06]"
          : "border-l-2 border-transparent hover:bg-dark-600/40"}
        ${index > 0 ? "border-t border-dark-600" : ""}
      `}
    >
      {/* Rank + change */}
      <div className="flex flex-col items-center w-8 flex-shrink-0">
        <span
          className={`text-sm font-bold tabular-nums leading-none ${
            project.rank === 1 ? "text-amber-400" :
            project.rank === 2 ? "text-slate-300" :
            project.rank === 3 ? "text-amber-600" :
            "text-slate-500"
          }`}
        >
          {project.rank}
        </span>
        <div className="mt-1">
          <RankBadge change={project.change} isNew={project.isNew} />
        </div>
      </div>

      {/* Trophy for top 3 */}
      {isTop3 && (
        <div className="flex-shrink-0 w-4 flex justify-center">
          <span className="text-sm">
            {project.rank === 1 ? "🥇" : project.rank === 2 ? "🥈" : "🥉"}
          </span>
        </div>
      )}

      {/* Logo */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
        style={{ backgroundColor: project.color + "26", border: `1px solid ${project.color}44`, color: project.color }}
      >
        {project.logo}
      </div>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
            {project.name}
          </span>
          <span className="text-xs text-slate-600 font-medium">{project.ticker}</span>
          <ChainBadge chain={project.chain} />
          {project.presale && (
            <span className="text-[10px] font-semibold bg-blue-500/10 border border-blue-500/25 text-blue-400 px-1.5 py-0.5 rounded-full">
              Pre-Sale
            </span>
          )}
          {project.sponsored && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-400 px-1.5 py-0.5 rounded-full">
                Sponsored
              </span>
              <SponsoredTooltip />
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{project.description}</p>
      </div>

      {/* Boosts + actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Boost count with flame */}
        <div className="flex items-center gap-1">
          <span className="text-sm">🔥</span>
          <span className="text-sm font-semibold text-white tabular-nums">{project.boosts}</span>
        </div>

        {/* Comment count */}
        <div className="flex items-center gap-1 text-slate-500">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          <span className="text-xs tabular-nums">{project.comments}</span>
        </div>

        {/* Boost CTA */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 hover:border-amber-500/50 text-amber-400 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
          Boost
        </button>
      </div>
    </div>
  );
}

function PostCard({ post }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = post.long;
  const shown = !needsTruncation || expanded;

  return (
    <div className="bg-dark-700 border border-dark-500 rounded-xl p-4 hover:border-dark-400 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] flex-shrink-0"
          style={{ backgroundColor: post.avatarColor + "33", border: `1px solid ${post.avatarColor}55`, color: post.avatarColor }}
        >
          {post.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-white">@{post.user}</span>
            {post.verified && (
              <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {post.role && (
              <span className="text-[10px] text-slate-500 bg-dark-500 border border-dark-400 px-1.5 py-0.5 rounded-full">
                {post.role}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {post.token && (
              <span className="text-[10px] font-semibold text-amber-400">{post.token}</span>
            )}
            <span className="text-[10px] text-slate-600">{post.time}</span>
          </div>
        </div>

        {/* Follow button */}
        <button className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-dark-600 border border-dark-400 hover:border-violet-500/50 hover:bg-violet-600/10 text-slate-400 hover:text-violet-400 transition-all">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* Text */}
      <div className="mb-3">
        <p className={`text-xs text-slate-300 leading-relaxed ${!shown ? "line-clamp-3" : ""}`}>
          {post.text}
        </p>
        {needsTruncation && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[11px] text-violet-400 hover:text-violet-300 font-medium mt-1 transition-colors"
          >
            {expanded ? "Show less" : "Read More"}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.669A1.989 1.989 0 003.9 16.75V10.5a2 2 0 114 0v2.25" />
          </svg>
          <span className="text-[11px] tabular-nums">{post.likes}</span>
        </button>
        <button className="flex items-center gap-1 text-slate-500 hover:text-red-400 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
          </svg>
          <span className="text-[11px] tabular-nums">{post.dislikes}</span>
        </button>
        <button className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          <span className="text-[11px] tabular-nums">{post.comments}</span>
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const countdown = useWeekCountdown();

  return (
    <div className="p-6">
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🏆</span>
              <h1 className="text-xl font-bold text-white">Projects of the Week</h1>
            </div>
            <p className="text-sm text-slate-500">
              Resets every Monday at 00:00 UTC
            </p>
            <p className="text-xs text-slate-600 mt-1 max-w-md">
              Rankings are based on boosts, community activity, and discussion volume accumulated this week
            </p>
          </div>

          {/* Countdown */}
          <div className="flex-shrink-0">
            <p className="text-xs text-slate-500 font-medium mb-2 text-right">Next reset in</p>
            <div className="flex items-start gap-2">
              <TimeBox value={countdown.days}    label="Days" />
              <span className="text-slate-600 font-bold text-lg mt-2">:</span>
              <TimeBox value={countdown.hours}   label="Hrs" />
              <span className="text-slate-600 font-bold text-lg mt-2">:</span>
              <TimeBox value={countdown.minutes} label="Min" />
              <span className="text-slate-600 font-bold text-lg mt-2">:</span>
              <TimeBox value={countdown.seconds} label="Sec" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex gap-5 items-start">

        {/* ── Left: ranked project list ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Top Products</h2>
              <span className="text-xs bg-dark-600 border border-dark-400 text-slate-500 px-1.5 py-0.5 rounded-full">
                {PROJECTS.length}
              </span>
            </div>
            {/* Column labels */}
            <div className="hidden sm:flex items-center gap-6 pr-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <span className="w-14 text-center">Boosts</span>
              <span className="w-8  text-center">Msgs</span>
              <span className="w-16 text-right">Action</span>
            </div>
          </div>

          <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
            {PROJECTS.map((p, i) => (
              <ProjectRow key={p.ticker} project={p} index={i} />
            ))}
          </div>
        </div>

        {/* ── Right: community discussions ── */}
        <div className="w-72 flex-shrink-0 space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Top Community Discussions</h2>
          </div>
          {POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

      </div>
    </div>
  );
}
