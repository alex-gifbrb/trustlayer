import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProject } from "../data/api";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Treemap,
} from "recharts";
import ProjectSidebar from "../components/detail/ProjectSidebar";

// ── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { label: "Overview",    id: "overview"    },
  { label: "Tokenomics",  id: "tokenomics"  },
  { label: "Boosts",      id: "boosts"      },
  { label: "Community",   id: "community"   },
  { label: "Experts",     id: "experts"     },
  { label: "Research",    id: "research"    },
  { label: "Team",        id: "team"        },
  { label: "Timeline",    id: "timeline"    },
  { label: "News",        id: "news"        },
  { label: "Holders",     id: "holders"     },
];

const SCROLL_OFFSET = 112; // 56px navbar + ~48px tab bar + 8px padding

// ── Mock data ─────────────────────────────────────────────────────────────────

const TOKENOMICS_DATA = [
  { name: "Public Sale",    value: 30, color: "#7c3aed" },
  { name: "Team",           value: 15, color: "#4f46e5" },
  { name: "Ecosystem",      value: 20, color: "#0ea5e9" },
  { name: "Advisors",       value:  5, color: "#06b6d4" },
  { name: "Reserve",        value: 15, color: "#8b5cf6" },
  { name: "Liquidity",      value: 10, color: "#6366f1" },
  { name: "Community",      value:  5, color: "#a78bfa" },
];

const BOOST_CARDS = [
  { level: "Mega Boost",  color: "#f59e0b", bg: "from-amber-500/20 to-yellow-500/10", border: "border-amber-500/30", count: 3,  user: "CryptoWhale", time: "2h ago",  emoji: "🔥" },
  { level: "Power Boost", color: "#8b5cf6", bg: "from-violet-500/20 to-purple-500/10", border: "border-violet-500/30", count: 12, user: "DefiDegen",  time: "4h ago",  emoji: "⚡" },
  { level: "Boost",       color: "#0ea5e9", bg: "from-sky-500/20 to-blue-500/10",      border: "border-sky-500/30",    count: 47, user: "TrustAlpha", time: "10m ago", emoji: "✨" },
];

const SOCIAL_DATA = [
  { platform: "Twitter / X", icon: "𝕏",   followers: "84.2K", growth: "+12.4%", sentiment: 78, color: "#1d9bf0" },
  { platform: "Telegram",    icon: "✈️",  followers: "41.7K", growth: "+8.1%",  sentiment: 82, color: "#2aabee" },
  { platform: "TikTok",      icon: "🎵",  followers: "23.1K", growth: "+31.2%", sentiment: 71, color: "#ff0050" },
  { platform: "Discord",     icon: "💬",  followers: "18.9K", growth: "+5.7%",  sentiment: 85, color: "#5865f2" },
];

const SECURITY_ITEMS = [
  { label: "Smart Contract Audit",  score: 91, max: 100, color: "#7c3aed" },
  { label: "Team Verification",     score: 88, max: 100, color: "#0ea5e9" },
  { label: "Liquidity Lock",        score: 76, max: 100, color: "#10b981" },
  { label: "Token Distribution",    score: 82, max: 100, color: "#f59e0b" },
  { label: "Community Trust",       score: 79, max: 100, color: "#6366f1" },
];

const EXPERTS = [
  { name: "Alex Thompson",  handle: "@alexcrypto",   score: 94, verdict: "Strong Buy", bio: "DeFi analyst with 7 years exp. Covered 200+ projects.", color: "#7c3aed" },
  { name: "Maria Santos",   handle: "@mariadefi",    score: 87, verdict: "Buy",        bio: "Web3 researcher, former Goldman Sachs quant analyst.",  color: "#0ea5e9" },
  { name: "James Liu",      handle: "@jliu_onchain", score: 79, verdict: "Hold",       bio: "On-chain data specialist. MIT blockchain lab alumni.",   color: "#10b981" },
];

const TEAM_MEMBERS = [
  { name: "Sarah Chen",     role: "CEO & Co-Founder",       initials: "SC", color: "#7c3aed", verified: true  },
  { name: "Mark Rivera",    role: "CTO",                    initials: "MR", color: "#0ea5e9", verified: true  },
  { name: "Elena Vasquez",  role: "Head of Tokenomics",     initials: "EV", color: "#10b981", verified: true  },
  { name: "Raj Patel",      role: "Lead Smart Contract Dev", initials: "RP", color: "#f59e0b", verified: false },
  { name: "Lucy Zhang",     role: "CMO",                    initials: "LZ", color: "#6366f1", verified: true  },
  { name: "Tom Nakamura",   role: "Head of Partnerships",   initials: "TN", color: "#ec4899", verified: false },
];

const INVESTORS = [
  { name: "Paradigm",       initials: "P",  color: "#7c3aed" },
  { name: "a16z Crypto",    initials: "A",  color: "#0ea5e9" },
  { name: "Multicoin",      initials: "M",  color: "#10b981" },
  { name: "Binance Labs",   initials: "BL", color: "#f59e0b" },
];

const TIMELINE = [
  { quarter: "Q1 2025", done: true,  items: ["Mainnet Launch", "Token Generation Event", "CEX Listing (Binance, OKX)"] },
  { quarter: "Q2 2025", done: true,  items: ["Governance Module v1", "Cross-chain Bridge (ETH ↔ SOL)", "50K community milestone"] },
  { quarter: "Q3 2025", done: false, items: ["Mobile App Beta", "Staking v2 with boosted rewards", "Strategic Partnership #4"] },
  { quarter: "Q4 2025", done: false, items: ["DAO Fully Operational", "100K Holders Target", "DEX Integration"] },
];

const NEWS = [
  { title: "Trust.net Partners with Major DeFi Protocol for Cross-Chain Liquidity", source: "CoinDesk", time: "2h ago",   tag: "Partnership" },
  { title: "Security Audit Completed — Zero Critical Vulnerabilities Found",         source: "The Block", time: "1d ago",  tag: "Security"     },
  { title: "Community Governance Vote: Proposal #12 Passes with 91% Approval",       source: "Decrypt",   time: "3d ago",  tag: "Governance"   },
];

const HOLDER_TREE = [
  { name: "Whale 0x4f2a", size: 2800000, pct: "8.2%",  color: "#7c3aed" },
  { name: "Whale 0x9b1c", size: 2100000, pct: "6.1%",  color: "#6366f1" },
  { name: "Fund A",        size: 1800000, pct: "5.3%",  color: "#4f46e5" },
  { name: "0xa3d7…",       size: 1200000, pct: "3.5%",  color: "#8b5cf6" },
  { name: "0x7f1e…",       size:  900000, pct: "2.6%",  color: "#0ea5e9" },
  { name: "0xc9b3…",       size:  700000, pct: "2.1%",  color: "#06b6d4" },
  { name: "0x2d8a…",       size:  600000, pct: "1.8%",  color: "#10b981" },
  { name: "Retail Pool",   size: 8000000, pct: "23.4%", color: "#1e293b" },
];

const HOLDER_TABLE = [
  { rank: 1,  address: "0x4f2a…8b3c", pct: "8.2%",  tokens: "2,800,000",  type: "Whale"    },
  { rank: 2,  address: "0x9b1c…4e7a", pct: "6.1%",  tokens: "2,100,000",  type: "Whale"    },
  { rank: 3,  address: "Fund A",       pct: "5.3%",  tokens: "1,800,000",  type: "Fund"     },
  { rank: 4,  address: "0xa3d7…1f9b", pct: "3.5%",  tokens: "1,200,000",  type: "Holder"   },
  { rank: 5,  address: "0x7f1e…c2d4", pct: "2.6%",  tokens:   "900,000",  type: "Holder"   },
  { rank: 6,  address: "0xc9b3…5a8f", pct: "2.1%",  tokens:   "700,000",  type: "Holder"   },
  { rank: 7,  address: "0x2d8a…7e3c", pct: "1.8%",  tokens:   "600,000",  type: "Holder"   },
  { rank: 8,  address: "0x5c1f…9d2b", pct: "1.4%",  tokens:   "490,000",  type: "Holder"   },
  { rank: 9,  address: "0x8e4a…3c7f", pct: "1.1%",  tokens:   "380,000",  type: "Holder"   },
  { rank: 10, address: "0x1b6d…0a4e", pct: "0.9%",  tokens:   "310,000",  type: "Holder"   },
];

// ── Scroll spy hook ────────────────────────────────────────────────────────────

function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY + SCROLL_OFFSET + 16;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActiveId(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  return activeId;
}

function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

// ── Recharts custom components ────────────────────────────────────────────────

function CustomTreemapContent(props) {
  const { x, y, width, height, name, pct, color } = props;
  if (width < 30 || height < 20) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} rx={4} stroke="#0f172a" strokeWidth={2} />
      {width > 60 && height > 30 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>
            {pct}
          </text>
          {height > 44 && (
            <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={9}>
              {name}
            </text>
          )}
        </>
      )}
    </g>
  );
}

// ── Section components ─────────────────────────────────────────────────────────

function SectionHeading({ children }) {
  return (
    <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
      {children}
    </h2>
  );
}

function SectionOverview({ project }) {
  const [expanded, setExpanded] = useState(false);
  const desc = project?.description || "A next-generation decentralized protocol enabling trustless cross-chain swaps with institutional-grade security. Built on a novel consensus mechanism combining zero-knowledge proofs with optimistic rollups, Trust.net delivers sub-second finality at a fraction of traditional gas costs. The ecosystem is designed to onboard the next billion users to DeFi through intuitive UX, gamified rewards, and a community-driven governance model that puts token holders in control of protocol evolution.";

  const metaRows = [
    { label: "Category",       value: project?.category || "DeFi / DEX" },
    { label: "Chain",          value: "Ethereum, Solana, BNB" },
    { label: "Token Standard", value: "ERC-20 / SPL" },
    { label: "Total Supply",   value: "34,200,000" },
    { label: "Circulating",    value: "12,800,000 (37.4%)" },
    { label: "Market Cap",     value: "$48.7M" },
    { label: "FDV",            value: "$130.2M" },
    { label: "Launch Date",    value: "Jan 15, 2025" },
    { label: "Contract",       value: "0x7f3a…c9d1" },
  ];

  return (
    <section id="overview" className="scroll-mt-28 mb-10">
      <SectionHeading>
        <span className="w-1 h-5 rounded-full bg-violet-500 inline-block" />
        Overview
      </SectionHeading>

      {/* Description */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-5 mb-4">
        <p className={`text-sm text-slate-300 leading-relaxed ${!expanded ? "line-clamp-3" : ""}`}>
          {desc}
        </p>
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-2 text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
        >
          {expanded ? "Show less ↑" : "Read more ↓"}
        </button>
      </div>

      {/* Metadata grid */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden mb-4">
        {metaRows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-5 py-3 text-sm ${
              i < metaRows.length - 1 ? "border-b border-dark-500" : ""
            }`}
          >
            <span className="text-slate-400">{row.label}</span>
            <span className="text-slate-200 font-medium">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Trust.ai summary card */}
      <div className="bg-gradient-to-br from-violet-600/10 to-indigo-600/5 border border-violet-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-violet-600/30 flex items-center justify-center text-violet-400 text-xs font-bold">AI</div>
          <span className="text-sm font-semibold text-violet-300">Trust.ai Summary</span>
          <span className="text-xs text-slate-500 ml-auto">Updated 3h ago</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Strong fundamentals with a verified team and completed security audit. The tokenomics model is well-structured with 36-month vesting on team allocations. Community sentiment is bullish (78%) driven by the recent mainnet launch. Key risk: concentrated holdings in top 10 wallets (31.1%). Overall Trust Score: <span className="text-violet-300 font-semibold">84.87 / AA</span>.
        </p>
      </div>
    </section>
  );
}

function SectionTokenomics() {
  const total = TOKENOMICS_DATA.reduce((s, d) => s + d.value, 0);
  return (
    <section id="tokenomics" className="scroll-mt-28 mb-10">
      <SectionHeading>
        <span className="w-1 h-5 rounded-full bg-indigo-500 inline-block" />
        Tokenomics
      </SectionHeading>

      <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Donut */}
          <div className="flex-shrink-0">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={TOKENOMICS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {TOKENOMICS_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}%`, ""]}
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend + rows */}
          <div className="flex-1 space-y-2 w-full">
            {TOKENOMICS_DATA.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-sm text-slate-300 flex-1">{d.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-28 h-1.5 bg-dark-500 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
                  </div>
                  <span className="text-sm font-semibold text-slate-200 w-8 text-right">{d.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supply stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-dark-500">
          {[
            { label: "Total Supply",    value: "34,200,000" },
            { label: "Circulating",     value: "12,800,000" },
            { label: "Vesting Period",  value: "36 months"  },
          ].map((s) => (
            <div key={s.label} className="bg-dark-600 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className="text-sm font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionBoosts() {
  return (
    <section id="boosts" className="scroll-mt-28 mb-10">
      <SectionHeading>
        <span className="w-1 h-5 rounded-full bg-amber-500 inline-block" />
        Community Boosts
      </SectionHeading>

      {/* Boost level summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {BOOST_CARDS.map((b) => (
          <div key={b.level} className={`bg-gradient-to-br ${b.bg} border ${b.border} rounded-xl p-4 text-center`}>
            <div className="text-2xl mb-1">{b.emoji}</div>
            <p className="text-2xl font-black" style={{ color: b.color }}>{b.count}</p>
            <p className="text-xs text-slate-400 mt-0.5">{b.level}s</p>
          </div>
        ))}
      </div>

      {/* Recent boosts */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-dark-500">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Boosts</p>
        </div>
        {BOOST_CARDS.flatMap((b) =>
          Array.from({ length: Math.min(b.count, 2) }, (_, i) => ({
            level: b.level,
            color: b.color,
            emoji: b.emoji,
            user: i === 0 ? b.user : `User${Math.floor(Math.random() * 900 + 100)}`,
            time: i === 0 ? b.time : "1d ago",
          }))
        ).slice(0, 6).map((item, i) => (
          <div key={i} className={`flex items-center gap-3 px-5 py-3 ${i < 5 ? "border-b border-dark-600" : ""}`}>
            <span className="text-base">{item.emoji}</span>
            <div className="flex-1">
              <span className="text-sm font-medium text-slate-200">{item.user}</span>
              <span className="text-xs text-slate-500 ml-2">boosted with a</span>
              <span className="text-xs font-semibold ml-1" style={{ color: item.color }}>{item.level}</span>
            </div>
            <span className="text-xs text-slate-500">{item.time}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-dark-700 border border-dark-500 rounded-xl px-5 py-3 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          <span className="font-bold text-white">62</span> unique contributors have boosted this project
        </p>
        <button className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">Boost Now →</button>
      </div>
    </section>
  );
}

function SectionCommunity() {
  return (
    <section id="community" className="scroll-mt-28 mb-10">
      <SectionHeading>
        <span className="w-1 h-5 rounded-full bg-sky-500 inline-block" />
        Social Networks & Community
      </SectionHeading>

      <div className="grid grid-cols-2 gap-3">
        {SOCIAL_DATA.map((s) => (
          <div key={s.platform} className="bg-dark-700 border border-dark-500 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{s.icon}</span>
              <span className="text-sm font-semibold text-slate-200">{s.platform}</span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xl font-black text-white">{s.followers}</p>
                <p className="text-xs text-emerald-400 font-medium">{s.growth} 7d</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">Sentiment</p>
                <p className="text-base font-bold" style={{ color: s.color }}>{s.sentiment}%</p>
              </div>
            </div>
            {/* Sentiment bar */}
            <div className="h-1.5 bg-dark-500 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${s.sentiment}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionSecurity() {
  const overall = 84.87;
  const grade = "AA";

  return (
    <section id="security" className="mb-10">
      <SectionHeading>
        <span className="w-1 h-5 rounded-full bg-emerald-500 inline-block" />
        Security Score
      </SectionHeading>

      <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
        {/* Header score */}
        <div className="flex items-center gap-5 mb-6 pb-5 border-b border-dark-500">
          <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-emerald-400">{grade}</span>
            <span className="text-xs text-slate-400">{overall}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200 mb-1">Overall Trust Score</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audit completed · No critical issues · Verified team · Locked liquidity
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                ✓ Audited
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-full px-2 py-0.5">
                ✓ KYC Verified
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5">
                ✓ Doxxed Team
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-4">
          {SECURITY_ITEMS.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-slate-300">{item.label}</span>
                <span className="text-sm font-semibold text-slate-200">{item.score}/{item.max}</span>
              </div>
              <div className="h-2 bg-dark-500 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(item.score / item.max) * 100}%`, background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionExperts() {
  const verdictColor = { "Strong Buy": "#10b981", "Buy": "#0ea5e9", "Hold": "#f59e0b" };
  return (
    <section id="experts" className="scroll-mt-28 mb-10">
      <SectionHeading>
        <span className="w-1 h-5 rounded-full bg-violet-500 inline-block" />
        Expert Opinions
      </SectionHeading>

      <div className="space-y-3">
        {EXPERTS.map((e) => (
          <div key={e.name} className="bg-dark-700 border border-dark-500 rounded-xl p-4 flex gap-4">
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: e.color + "33", border: `1px solid ${e.color}55` }}
            >
              {e.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">{e.name}</p>
                  <p className="text-xs text-slate-500">{e.handle}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ color: verdictColor[e.verdict], background: verdictColor[e.verdict] + "20", border: `1px solid ${verdictColor[e.verdict]}40` }}
                  >
                    {e.verdict}
                  </span>
                  <span className="text-xs font-bold text-slate-300">{e.score}/100</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{e.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionResearch() {
  return (
    <section id="research" className="scroll-mt-28 mb-10">
      <SectionHeading>
        <span className="w-1 h-5 rounded-full bg-indigo-500 inline-block" />
        Independent Analyst Research
      </SectionHeading>

      <div className="relative">
        {/* Blurred preview */}
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5 select-none" style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
          <p className="text-sm font-semibold text-white mb-2">Deep Dive Report: Trust.net Protocol Analysis</p>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            This 24-page report covers tokenomics stress-testing, on-chain wallet behaviour, smart contract risk vectors, and 12-month price trajectory modelling using Monte Carlo simulation. Key findings include elevated concentration risk in top 10 holders (31.1%) offset by the 36-month vesting schedule locking 15% of supply...
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our proprietary scoring model assigns a 78.4 on the Manipulation Risk Index — placing this project in the top quartile for projects in the $40–100M market cap range. Liquidity depth analysis shows...
          </p>
        </div>

        {/* Paywall overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-gradient-to-t from-dark-900/95 via-dark-900/60 to-transparent">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white mb-1">Unlock Full Research Report</p>
            <p className="text-xs text-slate-400">24-page deep dive by verified analysts</p>
          </div>

          {/* Pricing cards */}
          <div className="flex gap-3 px-4">
            <div className="bg-dark-700 border border-dark-500 rounded-xl p-4 text-center w-40">
              <p className="text-xs text-slate-400 mb-1">One-time</p>
              <p className="text-2xl font-black text-white">$15</p>
              <p className="text-xs text-slate-400 mb-3">per report</p>
              <button className="w-full text-xs font-semibold bg-dark-500 hover:bg-dark-400 text-slate-200 rounded-lg py-2 transition-colors">
                Buy Report
              </button>
            </div>
            <div className="bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-500/40 rounded-xl p-4 text-center w-40 relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">BEST VALUE</div>
              <p className="text-xs text-violet-300 mb-1">Pro Access</p>
              <p className="text-2xl font-black text-white">$10<span className="text-sm font-normal text-slate-400">/mo</span></p>
              <p className="text-xs text-slate-400 mb-3">unlimited reports</p>
              <button className="w-full text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg py-2 transition-colors">
                Go Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTeam() {
  return (
    <section id="team" className="scroll-mt-28 mb-10">
      <SectionHeading>
        <span className="w-1 h-5 rounded-full bg-sky-500 inline-block" />
        Team & Investors
      </SectionHeading>

      {/* Core team */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {TEAM_MEMBERS.map((m) => (
          <div key={m.name} className="bg-dark-700 border border-dark-500 rounded-xl p-4 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: m.color + "33", border: `1px solid ${m.color}55`, color: m.color }}
            >
              {m.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-white truncate">{m.name}</p>
                {m.verified && (
                  <svg className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate">{m.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Investors */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Backed By</p>
        <div className="flex flex-wrap gap-3">
          {INVESTORS.map((inv) => (
            <div key={inv.name} className="flex items-center gap-2 bg-dark-600 border border-dark-400 rounded-lg px-3 py-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                style={{ background: inv.color + "33", color: inv.color }}
              >
                {inv.initials}
              </div>
              <span className="text-xs font-medium text-slate-300">{inv.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionTimeline() {
  return (
    <section id="timeline" className="scroll-mt-28 mb-10">
      <SectionHeading>
        <span className="w-1 h-5 rounded-full bg-emerald-500 inline-block" />
        Roadmap & Timeline
      </SectionHeading>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-dark-500" />

        <div className="space-y-5">
          {TIMELINE.map((phase) => (
            <div key={phase.quarter} className="relative pl-12">
              {/* Dot */}
              <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                phase.done
                  ? "bg-emerald-500/20 border border-emerald-500/40"
                  : "bg-dark-600 border border-dark-400"
              }`}>
                {phase.done ? (
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-dark-400" />
                )}
              </div>

              <div className="bg-dark-700 border border-dark-500 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-bold text-white">{phase.quarter}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    phase.done
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                      : "text-slate-400 bg-dark-500 border border-dark-400"
                  }`}>
                    {phase.done ? "Completed" : "Upcoming"}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className={`mt-0.5 flex-shrink-0 ${phase.done ? "text-emerald-500" : "text-slate-600"}`}>
                        {phase.done ? "✓" : "○"}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionNews() {
  const tagColor = { Partnership: "#7c3aed", Security: "#10b981", Governance: "#0ea5e9" };
  return (
    <section id="news" className="scroll-mt-28 mb-10">
      <SectionHeading>
        <span className="w-1 h-5 rounded-full bg-sky-400 inline-block" />
        Latest News
      </SectionHeading>

      <div className="space-y-3">
        {NEWS.map((n) => (
          <div key={n.title} className="bg-dark-700 border border-dark-500 rounded-xl p-4 hover:border-dark-400 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              {/* Placeholder thumbnail */}
              <div className="w-16 h-16 rounded-lg bg-dark-600 border border-dark-400 flex-shrink-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ color: tagColor[n.tag] || "#7c3aed", background: (tagColor[n.tag] || "#7c3aed") + "20", border: `1px solid ${(tagColor[n.tag] || "#7c3aed")}40` }}
                  >
                    {n.tag}
                  </span>
                  <span className="text-xs text-slate-500">{n.source}</span>
                  <span className="text-xs text-slate-600 ml-auto">{n.time}</span>
                </div>
                <p className="text-sm font-medium text-slate-200 leading-snug">{n.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHolders() {
  return (
    <section id="holders" className="scroll-mt-28 mb-10">
      <SectionHeading>
        <span className="w-1 h-5 rounded-full bg-violet-500 inline-block" />
        Token Holders
      </SectionHeading>

      {/* Treemap */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-4 mb-4">
        <p className="text-xs text-slate-400 mb-3 font-medium">Distribution Map</p>
        <ResponsiveContainer width="100%" height={220}>
          <Treemap
            data={HOLDER_TREE}
            dataKey="size"
            aspectRatio={4 / 3}
            content={<CustomTreemapContent />}
          />
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 px-4 py-2.5 border-b border-dark-500 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          <span>#</span>
          <span>Address</span>
          <span className="text-right">%</span>
          <span className="text-right">Tokens</span>
        </div>
        {HOLDER_TABLE.map((row, i) => (
          <div
            key={row.rank}
            className={`grid grid-cols-4 px-4 py-2.5 text-xs ${i < HOLDER_TABLE.length - 1 ? "border-b border-dark-600" : ""} hover:bg-dark-600 transition-colors`}
          >
            <span className="text-slate-500 font-medium">{row.rank}</span>
            <span className="text-violet-400 font-mono">{row.address}</span>
            <span className="text-right text-slate-300 font-semibold">{row.pct}</span>
            <span className="text-right text-slate-400">{row.tokens}</span>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        {[
          { label: "Total Holders",   value: "18,432"  },
          { label: "New (7d)",         value: "+1,204"  },
          { label: "Top 10 Control",   value: "31.1%"   },
        ].map((s) => (
          <div key={s.label} className="bg-dark-700 border border-dark-500 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className="text-sm font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Tab bar ────────────────────────────────────────────────────────────────────

const TAB_IDS = TABS.map(t => t.id);

function TabBar({ activeId }) {
  const barRef = useRef(null);

  // Auto-scroll active tab into view within the bar
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const activeBtn = bar.querySelector(`[data-id="${activeId}"]`);
    if (activeBtn) {
      const { left, right } = activeBtn.getBoundingClientRect();
      const { left: barLeft, right: barRight } = bar.getBoundingClientRect();
      if (left < barLeft) bar.scrollLeft -= barLeft - left + 12;
      else if (right > barRight) bar.scrollLeft += right - barRight + 12;
    }
  }, [activeId]);

  return (
    <div className="sticky top-14 z-40 bg-dark-800/95 backdrop-blur-sm border-b border-dark-500">
      <div
        ref={barRef}
        className="flex items-center gap-1 px-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            data-id={tab.id}
            onClick={() => scrollTo(tab.id)}
            className={`flex-shrink-0 px-3 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
              activeId === tab.id
                ? "text-violet-400 border-violet-500"
                : "text-slate-400 border-transparent hover:text-slate-200 hover:border-dark-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ProjectDetailPage() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const activeId = useScrollSpy(TAB_IDS);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProject(ticker)
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [ticker]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300 mb-4">{error}</p>
          <button onClick={() => navigate("/")} className="text-sm text-violet-400 hover:text-violet-300 underline">
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <TabBar activeId={activeId} />

      <div className="px-6 py-6 flex gap-6 items-start">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <SectionOverview project={project} />
          <SectionTokenomics />
          <SectionBoosts />
          <SectionCommunity />
          <SectionSecurity />
          <SectionExperts />
          <SectionResearch />
          <SectionTeam />
          <SectionTimeline />
          <SectionNews />
          <SectionHolders />
        </div>

        {/* Sticky sidebar */}
        <div className="w-72 flex-shrink-0">
          <div className="sticky top-[108px]">
            <ProjectSidebar project={project} ticker={ticker} />
          </div>
        </div>
      </div>
    </>
  );
}
