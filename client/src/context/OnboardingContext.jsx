import { createContext, useContext, useState } from "react";

const DONE_KEY  = "trustnet_onboarding_complete";
const USER_KEY  = "trustnet_user";
const GUEST_KEY = "trustnet_guest_dismissed"; // sessionStorage — resets each tab

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const [showOverlay, setShowOverlay] = useState(() => {
    try {
      const done          = localStorage.getItem(DONE_KEY) === "true";
      const guestDismissed = sessionStorage.getItem(GUEST_KEY) === "true";
      return !done && !guestDismissed;
    } catch { return true; }
  });

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  function completeOnboarding(userData) {
    try {
      localStorage.setItem(DONE_KEY, "true");
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch {}
    setUser(userData);
    setShowOverlay(false);
  }

  function dismissAsGuest() {
    try { sessionStorage.setItem(GUEST_KEY, "true"); } catch {}
    setShowOverlay(false);
  }

  function openOverlay() {
    setShowOverlay(true);
  }

  return (
    <OnboardingContext.Provider
      value={{ showOverlay, user, completeOnboarding, dismissAsGuest, openOverlay }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
}
