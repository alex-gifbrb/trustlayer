import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getSimulatedResponse } from "../data/simulatedResponses";
import { fetchProject } from "../data/api";
import { useResearch } from "../context/ResearchContext";
import MessageContent from "../components/research/MessageContent";

// ── Prompt card definitions ──────────────────────────────────────────────────

const PROMPT_CARDS = [
  {
    key: "Project Economics",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/15",
    description: "Token supply, FDV & pre-sale structure",
  },
  {
    key: "Risk Summary",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/15",
    description: "Audit, liquidity & execution risks",
  },
  {
    key: "Add To Portfolio?",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
      </svg>
    ),
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/15",
    description: "Balanced buy / pass recommendation",
  },
  {
    key: "Compare With...",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/15",
    description: "Benchmark against similar projects",
  },
  {
    key: "Explore Community",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/15",
    description: "Sentiment, Discord & social signals",
  },
  {
    key: "Research Deep Dive",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
      </svg>
    ),
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/15",
    description: "On-chain, GitHub & liquidity analysis",
    pro: true,
  },
  {
    key: "Track Schedule",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/15",
    description: "TGE, listing & vesting milestones",
  },
  {
    key: "News",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20 hover:border-pink-500/40 hover:bg-pink-500/15",
    description: "Recent announcements & coverage",
  },
];

// ── ThinkingDots ──────────────────────────────────────────────────────────────

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
          style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.9s" }}
        />
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { createSession, updateSession, getSession } = useResearch();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [usesLeft] = useState(10);

  // The session id currently displayed (may be null for a brand-new chat)
  const [sessionId, setSessionId] = useState(null);

  const messagesEndRef = useRef(null);

  // ── Load project ──
  useEffect(() => {
    setLoading(true);
    fetchProject(ticker)
      .then((data) => { setProject(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ticker]);

  // ── Load session from URL param ──
  useEffect(() => {
    const paramId = searchParams.get("session");
    if (!paramId) {
      // Fresh chat — clear any previous state
      setSessionId(null);
      setMessages([]);
      return;
    }
    if (paramId === sessionId) return; // Already loaded

    const session = getSession(paramId);
    if (session) {
      setSessionId(paramId);
      setMessages(session.messages);
    } else {
      // Session was deleted — clear param and start fresh
      setSearchParams({}, { replace: true });
      setSessionId(null);
      setMessages([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // ── Send message ──
  function sendMessage(text) {
    if (!text.trim() || thinking || !project) return;

    const userMsg = { role: "user", text: text.trim(), id: Date.now() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setThinking(true);

    // Create session on very first message
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = createSession({
        ticker: project.ticker,
        projectName: project.name,
        projectLogo: project.logo,
        projectColor: project.color,
        firstMessage: text.trim(),
        messages: nextMessages,
      });
      setSessionId(currentSessionId);
      setSearchParams({ session: currentSessionId }, { replace: true });
    } else {
      updateSession(currentSessionId, nextMessages);
    }

    setTimeout(() => {
      const blocks = getSimulatedResponse(text.trim(), project);
      const aiMsg = { role: "ai", blocks, id: Date.now() + 1 };
      const finalMessages = [...nextMessages, aiMsg];
      setMessages(finalMessages);
      updateSession(currentSessionId, finalMessages);
      setThinking(false);
    }, 1500);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const hasMessages = messages.length > 0;

  // ── Loading / error states ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading research mode...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center max-w-sm">
          <p className="text-red-400 text-sm font-medium">Project not found</p>
          <button onClick={() => navigate("/")} className="mt-3 text-xs text-violet-400 hover:text-violet-300">
            ← Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const presale = project.presale || {};

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-dark-500 bg-dark-800 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate(`/project/${ticker}`)}
            className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
            title="Back to project"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: project.color + "33", border: `1px solid ${project.color}55`, color: project.color }}
          >
            {project.logo}
          </div>

          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-white font-semibold text-sm truncate">{project.name}</span>
            <span className="text-xs text-slate-500 bg-dark-600 border border-dark-400 px-2 py-0.5 rounded-full flex-shrink-0">
              {project.ticker}
            </span>
            <span className="text-base font-bold text-white flex-shrink-0">{project.priceFormatted}</span>
            <span className={`text-xs font-semibold flex-shrink-0 ${project.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {project.change24h >= 0 ? "+" : ""}{project.change24h}%
            </span>
            {presale.badge && (
              <span className="text-xs font-semibold bg-blue-500/15 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded-full flex-shrink-0">
                {presale.badge}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* New chat button */}
          <button
            onClick={() => {
              setSearchParams({}, { replace: true });
              setSessionId(null);
              setMessages([]);
              setInput("");
            }}
            title="New research session"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-dark-600 border border-dark-500 hover:border-dark-400 px-3 py-1.5 rounded-lg transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New
          </button>

          <div className="flex items-center gap-1.5 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-lg">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            AI Research Mode
          </div>
          <button
            onClick={() => navigate(`/project/${ticker}`)}
            className="text-xs text-slate-500 hover:text-slate-300 bg-dark-600 border border-dark-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            Exit
          </button>
        </div>
      </div>

      {/* ── Chat body ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

        {/* Default state — prompt cards */}
        {!hasMessages && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">
                Start Your Research on{" "}
                <span style={{ color: project.color }}>${project.ticker}</span>
              </h2>
              <p className="text-sm text-slate-500">
                Choose a topic below or type your own question
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PROMPT_CARDS.map((card) => (
                <button
                  key={card.key}
                  onClick={() => sendMessage(card.key)}
                  disabled={thinking}
                  className={`relative flex flex-col items-start gap-2.5 p-4 rounded-xl border text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${card.bg}`}
                >
                  {card.pro && (
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-400 px-1.5 py-0.5 rounded-full">
                      PRO
                    </span>
                  )}
                  <span className={card.color}>{card.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-white leading-tight">{card.key}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{card.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message thread */}
        {hasMessages && (
          <div className="max-w-2xl mx-auto space-y-5">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[75%] bg-blue-600 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-3 leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-violet-400 mb-2">Trust.ai</p>
                    <div className="bg-dark-700 border border-dark-500 rounded-2xl rounded-tl-sm px-4 py-3">
                      <MessageContent blocks={msg.blocks} />
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Thinking animation */}
            {thinking && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-violet-400 mb-2">Trust.ai</p>
                  <div className="bg-dark-700 border border-dark-500 rounded-2xl rounded-tl-sm px-4 py-3 inline-block">
                    <ThinkingDots />
                  </div>
                </div>
              </div>
            )}

            {/* Quick follow-up chips */}
            {!thinking && messages.length > 0 && messages.length < 8 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {PROMPT_CARDS
                  .filter((c) => !messages.some((m) => m.role === "user" && m.text === c.key))
                  .slice(0, 4)
                  .map((card) => (
                    <button
                      key={card.key}
                      onClick={() => sendMessage(card.key)}
                      className="text-xs text-slate-400 hover:text-slate-200 bg-dark-700 hover:bg-dark-600 border border-dark-500 hover:border-dark-400 px-3 py-1.5 rounded-full transition-all"
                    >
                      {card.key}
                    </button>
                  ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input bar ──────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-dark-500 bg-dark-800 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-dark-700 border border-dark-500 focus-within:border-violet-500/60 rounded-xl transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask anything about ${project.name}...`}
                rows={1}
                disabled={thinking}
                className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-600 px-4 py-3 resize-none focus:outline-none disabled:opacity-50 leading-relaxed"
                style={{ maxHeight: "120px", overflowY: "auto" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || thinking}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-dark-600 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
            >
              {thinking ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-2.5 px-1">
            <p className="text-xs text-slate-600">
              <span className="text-slate-400 font-medium">{usesLeft} free uses today.</span>{" "}
              <button className="text-violet-500 hover:text-violet-400 transition-colors">
                Upgrade to Pro, Get Unlimited Access
              </button>
            </p>
            <p className="text-xs text-slate-700">
              Press{" "}
              <kbd className="text-slate-600 bg-dark-600 border border-dark-400 px-1 py-0.5 rounded text-[10px]">
                Enter
              </kbd>{" "}
              to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
