// Renders bold (**text**) within a string
function InlineText({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-white font-semibold">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function SentimentBar({ bullish, bearish, label }) {
  return (
    <div className="my-3 bg-dark-600 border border-dark-400 rounded-xl p-4">
      {label && (
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          {label}
        </p>
      )}
      <div className="flex justify-between text-sm mb-2">
        <span className="text-emerald-400 font-semibold">🐂 Bullish {bullish}%</span>
        <span className="text-red-400 font-semibold">{bearish}% Bearish 🐻</span>
      </div>
      <div className="h-3 rounded-full bg-dark-400 overflow-hidden flex">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700"
          style={{ width: `${bullish}%` }}
        />
        <div
          className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-700"
          style={{ width: `${bearish}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>{bullish}% of community is bullish</span>
        <span>{bearish}% bearish</span>
      </div>
    </div>
  );
}

export default function MessageContent({ blocks }) {
  return (
    <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          return (
            <p key={i}>
              <InlineText text={block.text} />
            </p>
          );
        }

        if (block.type === "heading") {
          return (
            <p key={i} className="text-white font-semibold text-sm pt-1">
              {block.text}
            </p>
          );
        }

        if (block.type === "bullets") {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2">
                  <span className="text-violet-500 mt-0.5 flex-shrink-0">•</span>
                  <span>
                    <InlineText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "sentiment") {
          return (
            <SentimentBar
              key={i}
              bullish={block.bullish}
              bearish={block.bearish}
              label={block.label}
            />
          );
        }

        if (block.type === "divider") {
          return <hr key={i} className="border-dark-400 my-2" />;
        }

        return null;
      })}
    </div>
  );
}
