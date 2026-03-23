import { useState, useEffect } from "react";
import MostTalkedAbout from "../components/MostTalkedAbout";
import LaunchingSoon from "../components/LaunchingSoon";
import PreSalesTable from "../components/PreSalesTable";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((json) => {
        setProjects(json.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 max-w-[1400px]">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-white">Projects</h1>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mt-0.5" />
        </div>
        <p className="text-sm text-slate-500">
          Discover and track the latest crypto pre-sales and launches
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading projects...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
          <p className="text-red-400 font-medium text-sm mb-1">Failed to load projects</p>
          <p className="text-red-400/60 text-xs">{error}</p>
          <p className="text-slate-500 text-xs mt-2">
            Make sure the server is running on port 3001
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <MostTalkedAbout projects={projects} />
          <LaunchingSoon projects={projects} />
          <PreSalesTable projects={projects} />
        </>
      )}
    </div>
  );
}
