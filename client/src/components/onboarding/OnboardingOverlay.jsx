import { useState, useEffect } from "react";
import { useOnboarding } from "../../context/OnboardingContext";

// ─── Brand Icons ──────────────────────────────────────────────────────────────

const XTwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const WalletIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5m0 0h-5a2 2 0 010-4h5v4z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────

const WALLETS = [
  { id: "metamask",      name: "MetaMask",       color: "#E8831D", bg: "rgba(232,131,29,0.14)",  letter: "M" },
  { id: "coinbase",      name: "Coinbase Wallet", color: "#0052FF", bg: "rgba(0,82,255,0.12)",    letter: "C" },
  { id: "walletconnect", name: "WalletConnect",   color: "#3B99FC", bg: "rgba(59,153,252,0.12)",  letter: "W" },
  { id: "phantom",       name: "Phantom",         color: "#9945FF", bg: "rgba(153,69,255,0.12)",  letter: "P" },
];

const INTERESTS = [
  "DeFi", "NFTs", "GameFi", "Layer 1s", "Layer 2s",
  "Memecoins", "DAOs", "Privacy", "AI Tokens", "Real World Assets",
];

const BOOST_FEATURES = [
  { icon: "🔥", title: "Hard to Earn",           desc: "Accumulated through genuine platform activity — not handed out." },
  { icon: "⚡", title: "High-Conviction Signal",  desc: "Every boost is a statement of belief, not a casual like." },
  { icon: "🏅", title: "Four Boost Levels",       desc: "Blue → Rose → Emerald → Golden. Reflects verified credibility." },
  { icon: "💬", title: "Transparent Commentary",  desc: "Attach your reasoning. Make your conviction auditable." },
];

// ─── Confetti ─────────────────────────────────────────────────────────────────

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 65 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3.5,
      duration: 2.5 + Math.random() * 2.5,
      color: ["#8B5CF6","#06B6D4","#10B981","#F59E0B","#EC4899","#3B82F6","#F97316"][i % 7],
      size: 5 + Math.random() * 7,
      isCircle: Math.random() > 0.4,
    }))
  );
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 65 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.isCircle ? p.size : p.size * 0.5,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? "50%" : "2px",
            opacity: 0,
            animation: `trustConfettiFall ${p.duration}s ${p.delay}s linear forwards`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width:  i === current ? 18 : 6,
            height: 6,
            backgroundColor: i === current
              ? "#8B5CF6"
              : i < current
              ? "rgba(139,92,246,0.4)"
              : "rgba(55,58,80,0.8)",
          }}
        />
      ))}
    </div>
  );
}

function Btn({ onClick, disabled = false, children, variant = "primary", className = "" }) {
  const base = "w-full py-2.5 font-semibold rounded-xl transition-all text-sm";
  const styles = {
    primary: disabled
      ? `${base} bg-dark-600 text-slate-600 cursor-not-allowed`
      : `${base} bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/20`,
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

// Modal card shell: X button + content slot + dot-footer
function Shell({ children, onDismiss, dotIndex, dotTotal, footerLabel = "Continue as Guest →" }) {
  return (
    <div className="relative bg-dark-800 border border-dark-500 rounded-2xl shadow-2xl shadow-black/50 w-full overflow-hidden">
      {/* X close */}
      <button
        onClick={onDismiss}
        className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-dark-600 transition-all"
        aria-label="Close"
      >
        <CloseIcon />
      </button>

      {/* Main content */}
      <div className="p-6">{children}</div>

      {/* Footer: dots left, guest link right */}
      <div className="border-t border-dark-600/60 px-6 py-3 flex items-center justify-between">
        <ProgressDots current={dotIndex} total={dotTotal} />
        <button
          onClick={onDismiss}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          {footerLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Wallet selector ──────────────────────────────────────────────────────────

function WalletModal({ onSelect, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 80, background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="bg-dark-700 border border-dark-400 rounded-2xl p-5 w-full max-w-xs shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white text-sm">Connect a Wallet</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-dark-600 text-slate-400 hover:text-white transition-colors">
            <CloseIcon />
          </button>
        </div>
        <div className="space-y-1.5">
          {WALLETS.map(w => (
            <button
              key={w.id}
              onClick={() => onSelect(w)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-dark-400 hover:border-dark-300 hover:bg-dark-600 transition-all group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
                style={{ background: w.bg, border: `1px solid ${w.color}40`, color: w.color }}
              >
                {w.letter}
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors flex-1 text-left">
                {w.name}
              </span>
              <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-600 text-center mt-4">By connecting you agree to our Terms of Service</p>
      </div>
    </div>
  );
}

// ─── Mock UI blocks (demo screens) ───────────────────────────────────────────

function MockProjectCard() {
  return (
    <div className="bg-dark-700 border border-dark-400 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-md bg-violet-600/25 border border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-400 flex-shrink-0">AZ</div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white leading-tight truncate">Aztec Network</p>
          <p className="text-[10px] text-slate-500">AZTEC · $0.065</p>
        </div>
        <span className="ml-auto text-[9px] bg-dark-600 border border-dark-400 text-slate-400 px-1.5 py-0.5 rounded-full flex-shrink-0">ETH</span>
      </div>
      <div className="flex items-center justify-between text-[10px] mb-1">
        <span className="text-slate-500">Trust Score</span>
        <span className="text-emerald-400 font-semibold">68/100</span>
      </div>
      <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden mb-2.5">
        <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full" style={{ width: "68%" }} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-amber-400">⚡ 2,847</span>
        <span className="text-[9px] bg-violet-600/20 text-violet-400 border border-violet-500/20 px-1.5 py-0.5 rounded-full">Pre-Sale</span>
      </div>
    </div>
  );
}

function MockLeaderboard() {
  return (
    <div className="bg-dark-700 border border-dark-400 rounded-xl p-3">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">📊 Leaderboard</p>
      <div className="space-y-1.5">
        {[
          { badge: "🏆", name: "Aztec",   tag: null },
          { badge: "▲2", name: "Xyzverse", tag: null, green: true },
          { badge: "NEW", name: "NexusAI", tag: "new" },
        ].map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`text-[11px] w-6 flex-shrink-0 text-center font-medium ${r.green ? "text-emerald-400" : r.tag === "new" ? "text-cyan-400" : "text-amber-400"}`}>
              {r.badge}
            </span>
            <span className="text-xs text-white font-medium flex-1 truncate">{r.name}</span>
            {r.tag === "new" && (
              <span className="text-[9px] bg-cyan-500/15 text-cyan-400 px-1 py-0.5 rounded">NEW</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MockChat() {
  return (
    <div className="bg-dark-700 border border-dark-400 rounded-xl p-3 space-y-2.5">
      <div className="flex justify-end">
        <div className="bg-indigo-600 text-white text-xs px-3 py-2 rounded-xl rounded-tr-sm max-w-[85%] leading-relaxed">
          What are the risks of this project?
        </div>
      </div>
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5">AI</div>
        <div className="bg-dark-600 border border-dark-500 text-xs px-3 py-2.5 rounded-xl rounded-tl-sm flex-1">
          <p className="text-[10px] font-semibold text-violet-400 mb-1.5 uppercase tracking-wide">Trust.ai</p>
          <ul className="space-y-1 text-[11px] text-slate-300">
            <li className="flex gap-1.5"><span className="text-slate-500 flex-shrink-0">•</span>Smart contracts unaudited by top firms</li>
            <li className="flex gap-1.5"><span className="text-slate-500 flex-shrink-0">•</span>Core team pseudonymous — limited accountability</li>
            <li className="flex gap-1.5"><span className="text-slate-500 flex-shrink-0">•</span>Pre-launch liquidity thin, high slippage risk</li>
            <li className="flex gap-1.5"><span className="text-slate-500 flex-shrink-0">•</span>Regulatory classification remains uncertain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function MockWatchlist() {
  return (
    <div className="bg-dark-700 border border-dark-400 rounded-xl p-3">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">⭐ Watchlist</p>
      {[
        { ticker: "AZTEC", price: "$0.065", pct: 72, bull: true },
        { ticker: "XYZ",   price: "$0.007", pct: 50, bull: false },
      ].map(item => (
        <div key={item.ticker} className="flex items-center gap-2 py-1.5 border-b border-dark-600 last:border-0">
          <span className="text-xs font-semibold text-white w-10 flex-shrink-0">{item.ticker}</span>
          <span className="text-[10px] text-slate-400 w-10 flex-shrink-0">{item.price}</span>
          <div className="flex-1 h-1.5 bg-dark-500 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${item.bull ? "bg-emerald-500" : "bg-yellow-500"}`} style={{ width: `${item.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MockPortfolio() {
  return (
    <div className="bg-dark-700 border border-dark-400 rounded-xl p-3">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">💼 Portfolio</p>
      <p className="text-lg font-bold text-white leading-tight">$2,840.50</p>
      <p className="text-xs text-emerald-400 font-semibold mb-2.5">+$840.50 · +42%</p>
      <div className="space-y-1.5">
        {[
          { ticker: "AZTEC", pnl: "+58.5%" },
          { ticker: "AUTISM", pnl: "+320%" },
        ].map(h => (
          <div key={h.ticker} className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400">{h.ticker}</span>
            <span className="text-[10px] font-semibold text-emerald-400">{h.pnl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tour Screens (5 steps, dots 0–4) ────────────────────────────────────────

function HeroScreen({ onTour, onDismiss }) {
  return (
    <Shell onDismiss={onDismiss} dotIndex={0} dotTotal={5}>
      <div className="text-center py-1">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-base">T</span>
          </div>
          <span className="font-bold text-2xl text-white">Trust<span className="text-violet-400">.net</span></span>
        </div>

        <h1 className="text-[1.65rem] font-bold text-white mb-2 leading-tight">
          The Reasoning Layer<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300">
            for Crypto Decisions
          </span>
        </h1>
        <p className="text-slate-400 text-sm mb-6">Stop chasing signals. Start building conviction.</p>

        {/* Value prop pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
          {[
            { icon: "🔥", label: "Community Signals" },
            { icon: "🧠", label: "AI Research" },
            { icon: "📊", label: "Portfolio Tracking" },
          ].map(p => (
            <span key={p.label} className="flex items-center gap-1.5 text-xs text-slate-300 bg-dark-700 border border-dark-500 rounded-full px-3 py-1.5">
              {p.icon} {p.label}
            </span>
          ))}
        </div>

        <Btn onClick={onTour}>Take a Quick Tour →</Btn>
      </div>
    </Shell>
  );
}

function DemoProjectsScreen({ onNext, onDismiss }) {
  return (
    <Shell onDismiss={onDismiss} dotIndex={1} dotTotal={5}>
      <h2 className="text-base font-bold text-white mb-1">Discover What's Moving</h2>
      <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
        Track the most talked-about presales and airdrops. See which projects are accumulating real conviction this week.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <MockProjectCard />
        <MockLeaderboard />
      </div>
      <Btn onClick={onNext}>Next →</Btn>
    </Shell>
  );
}

function DemoResearchScreen({ onNext, onDismiss }) {
  return (
    <Shell onDismiss={onDismiss} dotIndex={2} dotTotal={5}>
      <h2 className="text-base font-bold text-white mb-1">Research at the Speed of Conviction</h2>
      <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
        Ask anything about any project. Trust.ai synthesizes whitepapers, audits, and community sentiment into instant structured answers.
      </p>
      <MockChat />
      <div className="mt-4">
        <Btn onClick={onNext}>Next →</Btn>
      </div>
    </Shell>
  );
}

function DemoPortfolioScreen({ onNext, onDismiss }) {
  return (
    <Shell onDismiss={onDismiss} dotIndex={3} dotTotal={5}>
      <h2 className="text-base font-bold text-white mb-1">Track Before and After You Invest</h2>
      <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
        Monitor projects you're watching. Track your holdings. Understand your performance — all in one place.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <MockWatchlist />
        <MockPortfolio />
      </div>
      <Btn onClick={onNext}>Join Trust.net →</Btn>
    </Shell>
  );
}

function SignUpScreen({ onAuth, onDismiss }) {
  const [showWallets, setShowWallets] = useState(false);

  return (
    <>
      <Shell onDismiss={onDismiss} dotIndex={4} dotTotal={5} footerLabel="I'll explore first →">
        <h2 className="text-xl font-bold text-white mb-1">Join Trust.net</h2>
        <p className="text-sm text-slate-400 mb-5">
          Get full access to AI research, boosts, and your personal portfolio.
        </p>

        <div className="space-y-2.5">
          <button onClick={onAuth} className="w-full flex items-center gap-3 px-4 py-2.5 bg-[#0f1011] hover:bg-[#1c1d22] border border-[#2d2e35] hover:border-[#3a3b45] text-white rounded-xl font-medium text-sm transition-all">
            <XTwitterIcon /> Continue with X
          </button>
          <button onClick={onAuth} className="w-full flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-medium text-sm transition-all border border-slate-200">
            <GoogleIcon /> Continue with Google
          </button>
          <button onClick={onAuth} className="w-full flex items-center gap-3 px-4 py-2.5 bg-black hover:bg-[#111] text-white rounded-xl font-medium text-sm transition-all border border-[#252525]">
            <AppleIcon /> Continue with Apple
          </button>
          <button onClick={() => setShowWallets(true)} className="w-full flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-violet-900/25">
            <WalletIcon /> Connect Wallet
          </button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-4">
          Already have an account?{" "}
          <button onClick={onAuth} className="text-violet-400 hover:text-violet-300 transition-colors font-medium">Sign in</button>
        </p>
      </Shell>

      {showWallets && (
        <WalletModal onSelect={() => { setShowWallets(false); onAuth(); }} onClose={() => setShowWallets(false)} />
      )}
    </>
  );
}

// ─── Onboarding Steps (4 steps after sign-up, dots 0–3) ──────────────────────

function StepWelcome({ onNext, onDismiss }) {
  return (
    <Shell onDismiss={onDismiss} dotIndex={0} dotTotal={4} footerLabel="Skip setup →">
      <div className="text-center py-1">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">👋</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Welcome to Trust.net 👋</h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-xs mx-auto">
          You're joining the decision layer for the decentralised economy. Let's personalise your experience in 3 quick steps.
        </p>
        <Btn onClick={onNext}>Let's Go →</Btn>
      </div>
    </Shell>
  );
}

function StepInterests({ selected, onToggle, onNext, onDismiss }) {
  const canProceed = selected.length >= 3;
  return (
    <Shell onDismiss={onDismiss} dotIndex={1} dotTotal={4} footerLabel="Skip setup →">
      <h2 className="text-lg font-bold text-white mb-1">What are you most interested in?</h2>
      <p className="text-xs text-slate-400 mb-3.5">
        Select at least 3 to personalise your feed
        {selected.length > 0 && (
          <span className={`ml-2 font-semibold ${canProceed ? "text-emerald-400" : "text-violet-400"}`}>
            ({selected.length}/3 min)
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {INTERESTS.map(tag => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                active
                  ? "bg-violet-600/25 border-violet-500/60 text-violet-300"
                  : "border-dark-400 text-slate-400 hover:border-dark-300 hover:text-slate-300"
              }`}
            >
              {active && <span className="mr-1">✓</span>}{tag}
            </button>
          );
        })}
      </div>
      <Btn onClick={onNext} disabled={!canProceed}>
        {canProceed ? "Next →" : `Select ${3 - selected.length} more to continue`}
      </Btn>
    </Shell>
  );
}

function StepBoost({ onNext, onDismiss }) {
  return (
    <Shell onDismiss={onDismiss} dotIndex={2} dotTotal={4} footerLabel="Skip setup →">
      <h2 className="text-lg font-bold text-white mb-0.5">Meet the Boost System</h2>
      <p className="text-xs text-slate-400 mb-3.5">The core trust signal on Trust.net</p>

      <div className="grid grid-cols-2 gap-2 mb-3.5">
        {BOOST_FEATURES.map(f => (
          <div key={f.title} className="bg-dark-700/60 border border-dark-500 rounded-xl p-3">
            <div className="text-lg mb-1.5">{f.icon}</div>
            <h3 className="text-xs font-semibold text-white mb-0.5">{f.title}</h3>
            <p className="text-[10px] text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Example boost card */}
      <div className="bg-dark-700/40 border border-violet-500/15 rounded-xl p-3 mb-4">
        <p className="text-[9px] text-slate-600 uppercase tracking-wider font-semibold mb-2">Example boost</p>
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">A</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-semibold text-white">alex.eth</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">🏅 Blue</span>
              <span className="text-[9px] text-slate-600 ml-auto">2m ago</span>
            </div>
            <p className="text-[10px] text-slate-500 mb-1">Boosted <span className="text-violet-400">Aztec Network</span></p>
            <p className="text-[11px] text-slate-300 italic leading-relaxed">"Privacy is inevitable. AZTEC at $0.065 is asymmetric risk."</p>
          </div>
        </div>
      </div>

      <Btn onClick={onNext}>Next →</Btn>
    </Shell>
  );
}

function StepProfile({ profile, onChange, onFinish, onDismiss }) {
  return (
    <Shell onDismiss={onDismiss} dotIndex={3} dotTotal={4} footerLabel="Skip setup →">
      <h2 className="text-lg font-bold text-white mb-4">Set up your profile</h2>

      <div className="flex flex-col items-center mb-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold select-none">
            {(profile.name || "A")[0].toUpperCase()}
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-dark-600 border border-dark-400 rounded-full flex items-center justify-center hover:bg-dark-500 transition-colors">
            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mt-1.5">Upload photo</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1 block">Display Name</label>
          <input
            value={profile.name}
            onChange={e => onChange({ ...profile, name: e.target.value })}
            className="w-full bg-dark-700 border border-dark-400 focus:border-violet-500/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors"
            placeholder="Your display name"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1 block">Username</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm select-none">@</span>
            <input
              value={profile.username}
              onChange={e => onChange({ ...profile, username: e.target.value.replace(/^@/, "") })}
              className="w-full bg-dark-700 border border-dark-400 focus:border-violet-500/60 rounded-xl pl-7 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors"
              placeholder="username"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1 block">
            Bio <span className="text-slate-600">(optional)</span>
          </label>
          <textarea
            value={profile.bio}
            onChange={e => onChange({ ...profile, bio: e.target.value })}
            rows={2}
            className="w-full bg-dark-700 border border-dark-400 focus:border-violet-500/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors resize-none"
            placeholder="Crypto researcher, DeFi enthusiast..."
          />
        </div>
      </div>

      <Btn onClick={onFinish} className="mt-4">Finish Setup 🎉</Btn>
    </Shell>
  );
}

function CompleteScreen({ name, onStart }) {
  return (
    <div className="relative bg-dark-800 border border-dark-500 rounded-2xl shadow-2xl shadow-black/50 w-full p-6 text-center">
      {/* X = same as Start Exploring */}
      <button
        onClick={onStart}
        className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-dark-600 transition-all"
      >
        <CloseIcon />
      </button>

      <div className="text-4xl mb-3" style={{ animation: "trustBounce 1s ease-in-out infinite" }}>🎉</div>
      <h1 className="text-xl font-bold text-white mb-1.5">You're all set, {name}!</h1>
      <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xs mx-auto">
        Your personalised feed is ready. Start exploring and building conviction.
      </p>

      <div className="bg-dark-700/50 border border-dark-500 rounded-xl p-4 mb-5 text-left">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {(name || "A")[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{name}</p>
            <p className="text-xs text-slate-500">@{name.toLowerCase().replace(/\s+/g, "")}</p>
          </div>
          <div className="ml-auto flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 rounded-full px-2 py-1">
            <span className="text-xs">⚡</span>
            <span className="text-xs font-bold text-amber-300">2,443</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
          <span className="text-emerald-400">✓</span> Feed personalised
          <span className="mx-1 text-dark-400">·</span>
          <span className="text-emerald-400">✓</span> Profile created
          <span className="mx-1 text-dark-400">·</span>
          <span className="text-emerald-400">✓</span> Ready to boost
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all text-sm shadow-xl shadow-violet-900/40"
      >
        Start Exploring →
      </button>
    </div>
  );
}

// ─── Main Overlay ─────────────────────────────────────────────────────────────

export default function OnboardingOverlay() {
  const { showOverlay, completeOnboarding, dismissAsGuest } = useOnboarding();

  const [screen, setScreen]                 = useState("hero");
  const [backdropOpacity, setBackdropOpacity] = useState(0);
  const [cardOpacity, setCardOpacity]         = useState(0);
  const [cardTransform, setCardTransform]     = useState("translateY(20px) scale(0.97)");
  const [contentOpacity, setContentOpacity]   = useState(0);

  const [interests, setInterests] = useState([]);
  const [profile, setProfile]     = useState({ name: "", username: "", bio: "" });

  // Staggered fade-in on mount
  useEffect(() => {
    if (!showOverlay) return;
    const t1 = setTimeout(() => setBackdropOpacity(1), 20);
    const t2 = setTimeout(() => {
      setCardOpacity(1);
      setCardTransform("translateY(0px) scale(1)");
    }, 80);
    const t3 = setTimeout(() => setContentOpacity(1), 220);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [showOverlay]);

  function goTo(next) {
    setContentOpacity(0);
    setTimeout(() => {
      setScreen(next);
      setContentOpacity(1);
    }, 160);
  }

  function handleDismiss() {
    setCardOpacity(0);
    setCardTransform("translateY(10px) scale(0.97)");
    setBackdropOpacity(0);
    setTimeout(() => dismissAsGuest(), 300);
  }

  function handleStart() {
    setCardOpacity(0);
    setCardTransform("translateY(10px) scale(0.97)");
    setBackdropOpacity(0);
    setTimeout(() => {
      completeOnboarding({
        name: profile.name || "Explorer",
        username: profile.username || "explorer",
        bio: profile.bio,
        interests,
        boostScore: 2443,
      });
    }, 300);
  }

  if (!showOverlay) return null;

  const toggleInterest = tag =>
    setInterests(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  return (
    <>
      <style>{`
        @keyframes trustConfettiFall {
          0%   { transform: translateY(0)     rotate(0deg);   opacity: 1; }
          85%  {                                               opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes trustBounce {
          0%, 100% { transform: translateY(0);    }
          50%       { transform: translateY(-6px); }
        }
      `}</style>

      {/* Backdrop — reduced opacity so the page shows through */}
      <div
        className="fixed inset-0 overflow-y-auto"
        style={{
          zIndex: 60,
          background: "rgba(10, 11, 14, 0.42)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          opacity: backdropOpacity,
          transition: "opacity 0.3s ease",
        }}
      >
        {screen === "complete" && <Confetti />}

        {/* Center the card vertically and horizontally */}
        <div className="min-h-screen flex items-center justify-center py-10 px-4">
          {/* Card wrapper — handles the card entrance animation */}
          <div
            className="w-full max-w-lg"
            style={{
              opacity: cardOpacity,
              transform: cardTransform,
              transition: "opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Content wrapper — fades between screens */}
            <div
              style={{
                opacity: contentOpacity,
                transition: "opacity 0.16s ease",
              }}
            >
              {screen === "hero" && (
                <HeroScreen onTour={() => goTo("demo-projects")} onDismiss={handleDismiss} />
              )}
              {screen === "demo-projects" && (
                <DemoProjectsScreen onNext={() => goTo("demo-research")} onDismiss={handleDismiss} />
              )}
              {screen === "demo-research" && (
                <DemoResearchScreen onNext={() => goTo("demo-portfolio")} onDismiss={handleDismiss} />
              )}
              {screen === "demo-portfolio" && (
                <DemoPortfolioScreen onNext={() => goTo("signup")} onDismiss={handleDismiss} />
              )}
              {screen === "signup" && (
                <SignUpScreen onAuth={() => goTo("onboard-welcome")} onDismiss={handleDismiss} />
              )}
              {screen === "onboard-welcome" && (
                <StepWelcome onNext={() => goTo("onboard-interests")} onDismiss={handleDismiss} />
              )}
              {screen === "onboard-interests" && (
                <StepInterests selected={interests} onToggle={toggleInterest} onNext={() => goTo("onboard-boost")} onDismiss={handleDismiss} />
              )}
              {screen === "onboard-boost" && (
                <StepBoost onNext={() => goTo("onboard-profile")} onDismiss={handleDismiss} />
              )}
              {screen === "onboard-profile" && (
                <StepProfile profile={profile} onChange={setProfile} onFinish={() => goTo("complete")} onDismiss={handleDismiss} />
              )}
              {screen === "complete" && (
                <CompleteScreen name={profile.name || "Explorer"} onStart={handleStart} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
