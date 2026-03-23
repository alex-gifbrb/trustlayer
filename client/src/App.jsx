import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WatchlistProvider } from "./context/WatchlistContext";
import { ResearchProvider } from "./context/ResearchContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import OnboardingOverlay from "./components/onboarding/OnboardingOverlay";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import WatchlistPage from "./pages/WatchlistPage";
import PortfolioPage from "./pages/PortfolioPage";
import ResearchPage from "./pages/ResearchPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AirdropsPage from "./pages/AirdropsPage";

export default function App() {
  return (
    <OnboardingProvider>
      <BrowserRouter>
        <WatchlistProvider>
          <ResearchProvider>
            <div className="min-h-screen bg-dark-900 text-slate-200">
              <Navbar />
              <Sidebar />
              <main className="pl-56 pt-14">
                <Routes>
                  <Route path="/" element={<ProjectsPage />} />
                  <Route path="/project/:ticker" element={<ProjectDetailPage />} />
                  <Route path="/watchlist" element={<WatchlistPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/project/:ticker/research" element={<ResearchPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/airdrops" element={<AirdropsPage />} />
                </Routes>
              </main>
            </div>
            <OnboardingOverlay />
          </ResearchProvider>
        </WatchlistProvider>
      </BrowserRouter>
    </OnboardingProvider>
  );
}
