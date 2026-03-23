import { useState, useEffect } from "react";
import MostTalkedAbout from "../components/MostTalkedAbout";
import LaunchingSoon from "../components/LaunchingSoon";
import PreSalesTable from "../components/PreSalesTable";
import { fetchProjects } from "../data/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
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

      {!loading && (
        <>
          <MostTalkedAbout projects={projects} />
          <LaunchingSoon projects={projects} />
          <PreSalesTable projects={projects} />
        </>
      )}
    </div>
  );
}
