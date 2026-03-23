const TABS = [
  "Overview",
  "Tokenomics",
  "Boosts",
  "Community",
  "Experts",
  "Research",
  "Team",
  "Timeline",
  "News",
  "Holders",
];

export default function TabNav({ active, onChange }) {
  return (
    <div className="border-b border-dark-500 mb-6">
      <nav className="flex gap-1 overflow-x-auto pb-0 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              active === tab
                ? "border-violet-500 text-violet-300"
                : "border-transparent text-slate-500 hover:text-slate-300 hover:border-dark-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
