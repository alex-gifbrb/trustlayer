function MetaRow({ label, value, mono }) {
  return (
    <tr className="border-b border-dark-600 last:border-0">
      <td className="py-3 pr-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36 align-top">
        {label}
      </td>
      <td className={`py-3 text-sm ${mono ? "font-mono text-slate-300" : "text-slate-200"}`}>
        {value}
      </td>
    </tr>
  );
}

function TokenomicsRow({ label, value, sub, accent }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-dark-600 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="text-right">
        <p className={`text-sm font-semibold ${accent ? "text-violet-300" : "text-white"}`}>
          {value}
        </p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function AllocationBar({ allocation }) {
  return (
    <div className="mt-4">
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {allocation.map((item) => (
          <div
            key={item.label}
            style={{ width: `${item.percent}%`, backgroundColor: item.color }}
            title={`${item.label}: ${item.percent}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
        {allocation.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-slate-400">
              {item.label}{" "}
              <span className="text-slate-500">{item.percent}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OverviewTab({ project }) {
  const contracts = project.contracts || [];
  const explorers = (project.explorers || []).join(", ");
  const wallets = (project.wallets || []).join(", ");
  const tk = project.tokenomics || {};

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          About
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>
      </div>

      {/* Metadata table */}
      <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Project Info
        </h3>
        <table className="w-full">
          <tbody>
            <MetaRow label="Ticker" value={project.ticker} />
            <MetaRow label="Chain" value={project.chain} />
            <MetaRow label="Founded" value={project.founded} />
            <MetaRow
              label="Contracts"
              value={
                contracts.length ? (
                  <div className="space-y-1.5">
                    {contracts.map((c) => (
                      <div key={c.label} className="flex items-center gap-2">
                        <span className="text-xs bg-dark-500 text-slate-400 px-2 py-0.5 rounded border border-dark-400">
                          {c.label}
                        </span>
                        <span className="font-mono text-xs text-slate-300">{c.address}</span>
                        <span className="text-xs text-violet-400 hover:text-violet-300 cursor-pointer">
                          ↗
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  "—"
                )
              }
            />
            <MetaRow label="Explorers" value={explorers || "—"} />
            <MetaRow label="Wallets" value={wallets || "—"} />
          </tbody>
        </table>
      </div>

      {/* Trust.ai summary */}
      <div className="bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/25 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-violet-600/30 border border-violet-500/40 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-violet-300">Trust.ai Summary</span>
          <span className="text-xs bg-violet-600/20 border border-violet-500/30 text-violet-400 px-2 py-0.5 rounded-full ml-auto">
            AI Generated
          </span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {project.trustAiSummary}
        </p>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat
          </button>
          <button className="flex items-center gap-1.5 bg-dark-600 hover:bg-dark-500 border border-dark-400 text-slate-300 text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Dive Deeper
          </button>
        </div>
      </div>

      {/* Tokenomics summary */}
      {tk.totalSupply && (
        <div className="bg-dark-700 border border-dark-500 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Tokenomics
          </h3>
          <div className="divide-y divide-dark-600">
            <TokenomicsRow label="Total Supply" value={tk.totalSupply} />
            <TokenomicsRow
              label="Pre-Sale"
              value={`${tk.preSalePercent}% — ${tk.preSaleRaise}`}
              sub={`${tk.preSalePercent}% of total supply`}
              accent
            />
            <TokenomicsRow
              label="Public Sale"
              value={`${tk.publicSalePercent}% — ${tk.publicSaleRaise}`}
              sub={`${tk.publicSalePercent}% of total supply`}
            />
            <TokenomicsRow label="FDV" value={tk.fdv} />
            <TokenomicsRow
              label="Initial Circ. Supply"
              value={tk.initialCirculation}
              sub={`${tk.initialCirculationPercent}% of total`}
            />
          </div>
          {tk.allocation && <AllocationBar allocation={tk.allocation} />}
        </div>
      )}
    </div>
  );
}
