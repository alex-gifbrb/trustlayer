import { getMockProjects, getMockProject } from "./mockData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Fetch all projects. Falls back to mock data if the API is unreachable.
 */
export async function fetchProjects() {
  try {
    const res = await fetch(`${API_URL}/api/projects`);
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    return json.data;
  } catch {
    return getMockProjects();
  }
}

/**
 * Fetch a single project by ticker. Falls back to mock data if the API is unreachable.
 * Throws if the ticker doesn't exist even in mock data.
 */
export async function fetchProject(ticker) {
  try {
    const res = await fetch(`${API_URL}/api/projects/${ticker}`);
    if (!res.ok) throw new Error("not found");
    const json = await res.json();
    return json.data;
  } catch {
    const data = getMockProject(ticker);
    if (!data) throw new Error("Project not found");
    return data;
  }
}
