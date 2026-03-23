import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrustAiCard from "../components/TrustAiCard";

const AI_SUMMARY =
  "Your portfolio is up 14.2% in the last 30 days, outperforming the broader crypto market by 6.1%. Autism Coin is your standout performer with +312% since entry — consider taking partial profits above the $0.005 resistance. Aztec is your stability anchor with moderate gains and strong protocol fundamentals. Your current allocation is skewed heavily toward meme assets by market cap ratio; consider rebalancing if you want to reduce volatility.";

const PORTFOLIOS = ["My First Portfolio", "My Second Portfolio", "My Third Portfolio"];

// Mock holdings data
const HOLDINGS = [
  {
    id: 1,
    name: "Aztec",
    ticker: "AZTEC",
    logo: "A",
    color: "#8B5CF6",
    chain: "ETH",
    price: 0.065,
    priceFormatted: "$0.065",
    change1h: 2.4,
    change24h: 8.7,
    volume24h: 1240000,
    bullish: 72,
    bearish: 28,
    // Portfolio specific
    quantity: 48000,
    avgEntry: 0.041,
    currentValue: 3120,
    costBasis: 1968,
    pnl: 1152,
    pnlPercent: 58.5,
    allocation: 42.1,
  },
  {
    id: 2,
    name: "Autism Coin",
    ticker: "AUTISM",
    logo: "AU",
    color: "#EC4899",
    chain: "SOL",
    price: 0.0042,
    priceFormatted: "$0.0042",
    change1h: 3.8,
    change24h: 22.1,
    volume24h: 2310000,
    bullish: 88,
    bearish: 12,
    // Portfolio specific
    quantity: 1050000,
    avgEntry: 0.001,
    currentValue: 4410,
    costBasis: 1050,
    pnl: 3360,
    pnlPercent: 320,
    allocation: 57.9,
  },
];

const TOTAL_BALANCE = HOLDINGS.reduce((s, h) => s + h.currentValue, 0);
const TOTAL_COST = HOLDINGS.reduce((s, h) => s + h.costBasis, 0);
const TOTAL_PNL = TOTAL_BALANCE - TOTAL_COST;
const TOTAL_PNL_PCT = ((TOTAL_PNL / TOTAL_COST) * 100).toFixed(1);
const BEST = [...HOLDINGS].sort((a, b) => b.pnlPercent - a.pnlPercent)[0];

function StatCard({ label, value, sub, positive, accent }) {
  return (
    <div className={`rounded-xl p-4 border ${accent ? "bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border-violet-500/25" : "bg-dark-700 border-dark-500"}`}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-2xl font-bold ${positive === true ? "text-emerald-400" : positive === false ? "text-red-400" : "text-white"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
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

function SentimentBar({ bullish, bearish }) {
  return (
    <div className="w-28">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-emerald-400 font-medium">{bullish}%</span>
        <span className="text-red-400 font-medium">{bearish}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-dark-400 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${bullish}%` }} />
      </div>
    </div>
  );
}

const chainColors = {
  ETH: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
  SOL: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
};

export default function PortfolioPage() {
  const navigate = useNavigate();
  const [activePortfolio, setActivePortfolio] = useState(0);

  return (
    <div className="p-6 max-w-[1200px]">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white mb-1">Portfolio</h1>
        <p className="text-sm text-slate-500">Track your holdings and performance</p>
      </div>

      {/* Portfolio tab bar */}
      <div className="flex items-center gap-1 mb-6 border-b border-dark-500 overflow-x-auto pb-0">
        {PORTFOLIOS.map((name, i) => (
          <button
            key={name}
            onClick={() => setActivePortfolio(i)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
              activePortfolio === i
                ? "border-violet-500 text-violet-300"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {name}
          </button>
        ))}
        <button className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-violet-400 whitespace-nowrap border-b-2 border-transparent transition-colors -mb-px flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Portfolio
        </button>
      </div>

      {/* Trust.ai */}
      <TrustAiCard summary={AI_SUMMARY} />

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Current Balance"
          value={`$${TOTAL_BALANCE.toLocaleString()}`}
          sub={`Cost basis $${TOTAL_COST.toLocaleString()}`}
          accent
        />
        <StatCard
          label="All Time Profit"
          value={`+$${TOTAL_PNL.toLocaleString()}`}
          sub={`+${TOTAL_PNL_PCT}% overall`}
          positive={true}
        />
        <StatCard
          label="Best Performer"
          value={`${BEST.name} +${BEST.pnlPercent}%`}
          sub={`+$${BEST.pnl.toLocaleString()} unrealised`}
          positive={true}
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mb-6">
        <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Transaction
        </button>
        <button className="flex items-center gap-1.5 bg-dark-600 hover:bg-dark-500 border border-dark-400 text-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export
        </button>
        <button className="flex items-center gap-1.5 bg-dark-600 hover:bg-dark-500 border border-dark-400 text-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          More
        </button>
      </div>

      {/* Holdings table */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-dark-500 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Holdings</h2>
          <span className="text-xs text-slate-500">{HOLDINGS.length} assets</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-600">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Coin</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Chain</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">1h %</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">24h %</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">24h Volume</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Holdings</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">P&amp;L</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {HOLDINGS.map((h) => {
                const chain = chainColors[h.chain] || chainColors.ETH;
                const pnlPos = h.pnl >= 0;
                return (
                  <tr
                    key={h.id}
                    onClick={() => navigate(`/project/${h.ticker}`)}
                    className="border-b border-dark-600 last:border-0 hover:bg-dark-600/40 transition-colors cursor-pointer group"
                  >
                    {/* Coin */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                          style={{ backgroundColor: h.color + "33", border: `1px solid ${h.color}55`, color: h.color }}
                        >
                          {h.logo}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                            {h.name}
                          </p>
                          <p className="text-xs text-slate-500">{h.ticker}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-semibold text-white">{h.priceFormatted}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${chain.bg} ${chain.border} ${chain.text}`}>
                        {h.chain}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right"><ChangeCell value={h.change1h} /></td>
                    <td className="px-4 py-4 text-right"><ChangeCell value={h.change24h} /></td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm text-slate-300 font-medium">{formatVolume(h.volume24h)}</span>
                    </td>
                    {/* Holdings value + qty */}
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-semibold text-white">${h.currentValue.toLocaleString()}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {h.quantity.toLocaleString()} {h.ticker}
                      </p>
                    </td>
                    {/* P&L */}
                    <td className="px-4 py-4 text-right">
                      <p className={`text-sm font-semibold ${pnlPos ? "text-emerald-400" : "text-red-400"}`}>
                        {pnlPos ? "+" : ""}${h.pnl.toLocaleString()}
                      </p>
                      <p className={`text-xs mt-0.5 ${pnlPos ? "text-emerald-500" : "text-red-500"}`}>
                        {pnlPos ? "+" : ""}{h.pnlPercent}%
                      </p>
                    </td>
                    {/* Sentiment */}
                    <td className="px-4 py-4">
                      <SentimentBar bullish={h.bullish} bearish={h.bearish} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Totals row */}
            <tfoot>
              <tr className="border-t border-dark-400 bg-dark-600/30">
                <td colSpan={6} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total
                </td>
                <td className="px-4 py-3 text-right">
                  <p className="text-sm font-bold text-white">${TOTAL_BALANCE.toLocaleString()}</p>
                </td>
                <td className="px-4 py-3 text-right">
                  <p className="text-sm font-bold text-emerald-400">+${TOTAL_PNL.toLocaleString()}</p>
                  <p className="text-xs text-emerald-500 mt-0.5">+{TOTAL_PNL_PCT}%</p>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
