import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useResearch } from "../context/ResearchContext";

const navLinks = [
  {
    label: "Projects",
    path: "/",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    label: "Leaderboard",
    path: "/leaderboard",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "Tools",
    path: "/tools",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Airdrops",
    path: "/airdrops",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
  {
    label: "Other",
    path: "/other",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    ),
  },
];

// ── Session item ──────────────────────────────────────────────────────────────

function SessionItem({ session, isActive, openMenuId, setOpenMenuId, renamingId, setRenamingId }) {
  const navigate = useNavigate();
  const { deleteSession, renameSession } = useResearch();
  const [renameValue, setRenameValue] = useState(session.title);
  const renameRef = useRef(null);
  const menuRef = useRef(null);

  const menuOpen = openMenuId === session.id;
  const isRenaming = renamingId === session.id;

  // Focus input when rename starts
  useEffect(() => {
    if (isRenaming) {
      setRenameValue(session.title);
      setTimeout(() => renameRef.current?.select(), 0);
    }
  }, [isRenaming, session.title]);

  function openSession() {
    if (isRenaming) return;
    navigate(`/project/${session.ticker}/research?session=${session.id}`);
  }

  function handleMenuClick(e) {
    e.stopPropagation();
    setOpenMenuId(menuOpen ? null : session.id);
  }

  function handleDelete(e) {
    e.stopPropagation();
    setOpenMenuId(null);
    deleteSession(session.id);
  }

  function handleRenameStart(e) {
    e.stopPropagation();
    setOpenMenuId(null);
    setRenamingId(session.id);
  }

  function commitRename() {
    if (renameValue.trim()) renameSession(session.id, renameValue.trim());
    setRenamingId(null);
  }

  function handleRenameKey(e) {
    if (e.key === "Enter") { e.preventDefault(); commitRename(); }
    if (e.key === "Escape") { setRenamingId(null); }
  }

  return (
    <div className="relative group">
      <button
        onClick={openSession}
        className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-all ${
          isActive
            ? "bg-violet-600/20 border border-violet-500/30"
            : "border border-transparent hover:bg-dark-600"
        }`}
      >
        {/* Project logo dot */}
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] flex-shrink-0"
          style={{
            backgroundColor: session.projectColor + "33",
            border: `1px solid ${session.projectColor}55`,
            color: session.projectColor,
          }}
        >
          {session.projectLogo}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide leading-none">
            {session.ticker}
          </span>
          {isRenaming ? (
            <input
              ref={renameRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={handleRenameKey}
              onClick={(e) => e.stopPropagation()}
              className="block w-full text-xs text-white bg-dark-500 border border-violet-500/50 rounded px-1 py-0.5 mt-0.5 focus:outline-none"
            />
          ) : (
            <p className={`text-xs truncate leading-tight mt-0.5 ${isActive ? "text-violet-200" : "text-slate-400"}`}>
              {session.title}
            </p>
          )}
        </div>
      </button>

      {/* ··· menu button — visible on group hover */}
      {!isRenaming && (
        <button
          ref={menuRef}
          onClick={handleMenuClick}
          className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all ${
            menuOpen
              ? "opacity-100 bg-dark-500 text-slate-300"
              : "opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 hover:bg-dark-500"
          }`}
          title="Options"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
            <circle cx="8" cy="3" r="1.2" />
            <circle cx="8" cy="8" r="1.2" />
            <circle cx="8" cy="13" r="1.2" />
          </svg>
        </button>
      )}

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute right-0 top-7 z-50 w-32 bg-dark-600 border border-dark-400 rounded-lg shadow-xl overflow-hidden">
          <button
            onClick={handleRenameStart}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-dark-500 hover:text-white transition-colors text-left"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
            Rename
          </button>
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessions, deleteSession } = useResearch();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);

  // Active session from URL
  const searchParams = new URLSearchParams(location.search);
  const activeSessionId = searchParams.get("session");

  // Close menu on outside click
  useEffect(() => {
    if (!openMenuId) return;
    function handleClick() { setOpenMenuId(null); }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [openMenuId]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-56 bg-dark-800 border-r border-dark-500 flex flex-col">

      {/* ── Top nav (fixed height) ── */}
      <div className="flex-shrink-0 px-3 pt-4 pb-2 space-y-0.5">
        {navLinks.map((link) => {
          const active = isActive(link.path);
          return (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-dark-600 border border-transparent"
              }`}
            >
              <span className={active ? "text-violet-400" : ""}>{link.icon}</span>
              {link.label}
            </button>
          );
        })}
      </div>

      {/* ── Divider ── */}
      <div className="flex-shrink-0 mx-3 border-t border-dark-500" />

      {/* ── Researches section (scrollable, fills remaining space) ── */}
      <div className="flex-1 flex flex-col min-h-0 px-3 pt-3 pb-2">

        {/* Header */}
        <div className="flex items-center justify-between px-1 mb-2 flex-shrink-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Researches
          </p>
          {sessions.length > 0 && (
            <span className="text-xs bg-dark-600 border border-dark-400 text-slate-500 px-1.5 py-0.5 rounded-full tabular-nums">
              {sessions.length}
            </span>
          )}
        </div>

        {sessions.length === 0 ? (
          /* Empty state */
          <div className="bg-dark-700 border border-dark-500 rounded-xl p-4 text-center flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-dark-600 border border-dark-400 flex items-center justify-center mx-auto mb-2.5">
              <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-2.5">
              Choose a project and start researching with our AI assistant
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full text-xs font-semibold text-violet-300 bg-violet-600/20 border border-violet-500/30 rounded-lg py-1.5 hover:bg-violet-600/30 transition-colors"
            >
              Discover Projects
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable session list */}
            <div className="flex-1 overflow-y-auto space-y-0.5 pr-0.5 min-h-0">
              {sessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  renamingId={renamingId}
                  setRenamingId={setRenamingId}
                />
              ))}
            </div>

            {/* Footer link */}
            <button
              onClick={() => navigate("/")}
              className="flex-shrink-0 mt-2 w-full text-xs text-slate-600 hover:text-violet-400 py-1.5 transition-colors text-center"
            >
              + Discover more projects
            </button>
          </>
        )}
      </div>

      {/* ── Bottom user section (fixed) ── */}
      <div className="flex-shrink-0 px-3 pt-3 pb-3 border-t border-dark-500 mx-0">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            U
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">User</p>
            <p className="text-xs text-slate-500 truncate">Explorer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
