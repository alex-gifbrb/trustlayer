import { createContext, useContext, useState, useCallback } from "react";

const STORAGE_KEY = "trustnet_research_sessions";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {}
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const ResearchContext = createContext(null);

export function ResearchProvider({ children }) {
  const [sessions, setSessions] = useState(load);

  // Returns the new session id
  const createSession = useCallback(
    ({ ticker, projectName, projectLogo, projectColor, firstMessage, messages }) => {
      const id = makeId();
      const title =
        firstMessage.length > 38
          ? firstMessage.slice(0, 36).trimEnd() + "…"
          : firstMessage;
      const session = {
        id,
        ticker,
        projectName,
        projectLogo,
        projectColor,
        title,
        messages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSessions((prev) => {
        const next = [session, ...prev];
        persist(next);
        return next;
      });
      return id;
    },
    []
  );

  const updateSession = useCallback((id, messages) => {
    setSessions((prev) => {
      const next = prev.map((s) =>
        s.id === id ? { ...s, messages, updatedAt: Date.now() } : s
      );
      persist(next);
      return next;
    });
  }, []);

  const deleteSession = useCallback((id) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const renameSession = useCallback((id, title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setSessions((prev) => {
      const next = prev.map((s) =>
        s.id === id ? { ...s, title: trimmed } : s
      );
      persist(next);
      return next;
    });
  }, []);

  const getSession = useCallback(
    (id) => sessions.find((s) => s.id === id) ?? null,
    [sessions]
  );

  return (
    <ResearchContext.Provider
      value={{ sessions, createSession, updateSession, deleteSession, renameSession, getSession }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  const ctx = useContext(ResearchContext);
  if (!ctx) throw new Error("useResearch must be used inside ResearchProvider");
  return ctx;
}
