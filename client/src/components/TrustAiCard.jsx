export default function TrustAiCard({ summary }) {
  return (
    <div className="bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/25 rounded-xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-violet-600/30 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-violet-300">Trust.ai Summary</span>
        <span className="ml-auto text-xs bg-violet-600/20 border border-violet-500/30 text-violet-400 px-2 py-0.5 rounded-full">
          AI Generated
        </span>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed mb-4">{summary}</p>
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
          Deep Dive
        </button>
      </div>
    </div>
  );
}
