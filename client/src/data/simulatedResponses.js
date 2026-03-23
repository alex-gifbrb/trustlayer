// Each response is an array of content blocks:
//   { type: "paragraph", text }
//   { type: "bullets", items: [string] }
//   { type: "sentiment", bullish: N, bearish: N, label: string }
//   { type: "heading", text }
//   { type: "divider" }

export function getSimulatedResponse(promptKey, project) {
  const name = project?.name ?? "this project";
  const ticker = project?.ticker ?? "TOKEN";
  const price = project?.priceFormatted ?? "$—";
  const fdv = project?.tokenomics?.fdv ?? project?.fdv
    ? `$${((project.fdv ?? 0) / 1_000_000).toFixed(1)}M`
    : "—";
  const bullish = project?.bullish ?? 62;
  const bearish = project?.bearish ?? 38;
  const preSalePct = project?.tokenomics?.preSalePercent ?? 15;
  const totalSupply = project?.tokenomics?.totalSupply ?? "1,000,000,000";
  const chain = project?.chain ?? "ETH";
  const secGrade = project?.rating?.securityGrade ?? "A";
  const secScore = project?.rating?.securityScore ?? 75;

  const responses = {
    "Project Economics": [
      {
        type: "paragraph",
        text: `Here's a breakdown of ${name} (${ticker})'s token economics based on the available pre-sale data.`,
      },
      { type: "heading", text: "Token Supply & Distribution" },
      {
        type: "bullets",
        items: [
          `Total supply: ${totalSupply} ${ticker}`,
          `Pre-sale allocation: ${preSalePct}% of total supply sold at a discount to public price`,
          `Current pre-sale price: ${price} — implying a fully diluted valuation (FDV) of ${fdv}`,
          `Initial circulating supply at launch is constrained, which historically supports price discovery in early trading`,
        ],
      },
      { type: "heading", text: "Valuation Context" },
      {
        type: "paragraph",
        text: `At ${price} per token, ${name} is priced in the micro-cap range. If the project hits even 10% of its addressable market, models suggest a 3–8× fair value range from current pre-sale levels. That said, FDV-based comparisons should be treated as directional rather than precise — token unlocks and vesting schedules will be the primary near-term price driver post-launch.`,
      },
      {
        type: "paragraph",
        text: `Pre-sale participants on ${chain} should factor in gas costs and bridge fees when calculating their effective entry price.`,
      },
    ],

    "Risk Summary": [
      {
        type: "paragraph",
        text: `Every pre-sale carries risk. Here are the key risk factors I've identified for ${name} (${ticker}):`,
      },
      {
        type: "bullets",
        items: [
          `**Execution risk** — The team has a clear roadmap but has not yet shipped a mainnet product. Delays are common in early-stage crypto projects and should be priced in.`,
          `**Liquidity risk** — Pre-sale tokens may have limited liquidity at launch. Selling a large position could face significant slippage, especially in the first 30 days.`,
          `**Smart contract risk** — Security score is ${secGrade} (${secScore}/100). While above average, no audit is a guarantee. Deploy only what you can afford to lose.`,
          `**Regulatory risk** — Depending on your jurisdiction, participation in token pre-sales may carry legal implications. ${name} has not published formal legal opinions.`,
          `**Market risk** — Broader crypto market downturns can suppress even fundamentally strong projects. Correlation to BTC/ETH price action is high for small-caps.`,
          `**Vesting cliff risk** — Team and investor token unlocks create predictable sell pressure at vesting dates. Review the vesting schedule carefully before entering.`,
        ],
      },
      {
        type: "paragraph",
        text: `Overall risk profile: **Moderate-High**. Suitable for portfolio allocations of 1–3% for risk-aware investors. Do not size in beyond what you are prepared to lose entirely.`,
      },
    ],

    "Explore Community": [
      {
        type: "paragraph",
        text: `Community sentiment analysis for ${name} (${ticker}) across Discord, Telegram, and X (Twitter):`,
      },
      {
        type: "sentiment",
        bullish,
        bearish,
        label: "Overall community sentiment",
      },
      { type: "heading", text: "Key Signals" },
      {
        type: "bullets",
        items: [
          `Discord activity is up 34% week-over-week, with a spike in #general discussion around the pre-sale countdown`,
          `Top recurring community themes: fair launch structure, team responsiveness, and competitive token price`,
          `Bearish minority concerns: lack of a mainnet demo and pseudonymous team members`,
          `Influencer coverage: 3 mid-tier crypto Twitter accounts (~50K followers each) have posted about the project in the last 7 days`,
          `Telegram community reached 12,000 members — organic growth, no obvious airdrop-farming patterns detected`,
        ],
      },
      {
        type: "paragraph",
        text: `Community quality score: **7.4 / 10**. The ${bullish}% bullish reading is above the 68% platform average for projects at this stage. Engagement-to-follower ratio suggests mostly genuine participants rather than bot inflation.`,
      },
    ],

    "Add To Portfolio?": [
      {
        type: "paragraph",
        text: `Here's my balanced take on whether ${name} (${ticker}) fits a typical crypto portfolio:`,
      },
      { type: "heading", text: "Bull Case" },
      {
        type: "bullets",
        items: [
          `Pre-sale pricing offers a material discount to public sale — early participants have a structural advantage`,
          `${chain} ecosystem is active with strong developer tooling and liquidity`,
          `${bullish}% community bullish consensus is a meaningful positive signal at this stage`,
          `Security grade ${secGrade} is above average for a pre-launch project`,
        ],
      },
      { type: "heading", text: "Bear Case" },
      {
        type: "bullets",
        items: [
          `No live product yet — all value is speculative and narrative-driven`,
          `Competitive landscape is crowded; differentiation needs to hold post-launch`,
          `Macro conditions could suppress risk appetite and delay meaningful price discovery`,
        ],
      },
      {
        type: "paragraph",
        text: `**Suggested allocation:** If you're comfortable with high-risk early-stage assets, a 1–2% portfolio position in ${ticker} is defensible at pre-sale pricing. Set a clear exit thesis — either a price target (e.g. 3× from entry) or a time-based review at 90 days post-launch. Avoid over-concentrating in any single pre-sale.`,
      },
    ],

    "Compare With...": [
      {
        type: "paragraph",
        text: `Here's how ${name} stacks up against comparable projects in the same category on key dimensions:`,
      },
      {
        type: "bullets",
        items: [
          `**vs. Category average** — ${name}'s FDV of ${fdv} is at the lower end of comparable projects, suggesting more upside potential if adoption matches peers`,
          `**Security** — ${secGrade} (${secScore}/100) vs. category median of ~74. ${name} is slightly above average`,
          `**Community sentiment** — ${bullish}% bullish vs. category average of 68%. Meaningfully stronger`,
          `**Chain choice** — ${chain} provides ${chain === "SOL" ? "high throughput and low fees, competitive with other Solana-based peers" : chain === "ETH" ? "the deepest DeFi liquidity and composability, though gas costs remain a friction point" : "a fast-growing ecosystem with strong institutional backing"}`,
          `**Stage** — Pre-sale with no live product is standard for this cohort. Time-to-mainnet is the critical unknown variable`,
        ],
      },
      {
        type: "paragraph",
        text: `Use the Compare feature (Pro) to generate a side-by-side matrix with custom projects. Available in Trust.ai Pro.`,
      },
    ],

    "Research Deep Dive": [
      {
        type: "paragraph",
        text: `Research Deep Dive is a Trust.ai Pro feature. Here's a preview of what's included:`,
      },
      {
        type: "bullets",
        items: [
          `Full on-chain wallet analysis — track team, VC, and presale wallet activity`,
          `GitHub commit history scoring — measure real development velocity`,
          `Cross-chain liquidity depth model — estimates post-launch price stability`,
          `Comparable exit analysis — how similar projects traded 30/60/90 days post-launch`,
          `Custom risk matrix with 14 weighted factors`,
          `Exportable PDF report with citations`,
        ],
      },
      {
        type: "paragraph",
        text: `Upgrade to Trust.ai Pro to unlock deep dives, unlimited chat, and priority research on new listings.`,
      },
    ],

    "Track Schedule": [
      {
        type: "paragraph",
        text: `Here are the key upcoming dates and milestones for ${name} (${ticker}):`,
      },
      {
        type: "bullets",
        items: [
          `**Pre-Sale close** — Ends in ~4 days. After this, tokens can only be purchased at public sale price`,
          `**Public Sale / TGE** — Token Generation Event expected within 2 weeks of pre-sale close`,
          `**DEX Listing** — Liquidity pool expected to go live on launch day, initially on ${chain === "SOL" ? "Raydium and Orca" : chain === "BASE" ? "Aerodrome and Uniswap v3 on Base" : "Uniswap v3 and Curve"}`,
          `**Vesting cliff (Team)** — 12-month cliff, then 24-month linear vest. No team tokens unlock at TGE`,
          `**Mainnet Beta** — Roadmap targets Q3 2025 for first public product release`,
          `**CEX application** — Team has confirmed applications submitted to two tier-2 exchanges`,
        ],
      },
      {
        type: "paragraph",
        text: `Enable schedule alerts in your watchlist to get notified 48 hours before each key date. Available from the project's detail page.`,
      },
    ],

    News: [
      {
        type: "paragraph",
        text: `Latest news and mentions for ${name} (${ticker}) from the past 7 days:`,
      },
      {
        type: "bullets",
        items: [
          `**[2 days ago]** ${name} announced a strategic partnership with a top-5 ${chain} ecosystem fund — details pending public disclosure`,
          `**[3 days ago]** Smart contract audit completed by Sec3 — full report published on-chain, zero critical findings`,
          `**[4 days ago]** AMA hosted on Discord attracted 2,400 live participants, Q&A transcript posted to community hub`,
          `**[5 days ago]** CryptoSlate featured ${name} in a "Pre-Sales to Watch" roundup alongside 4 other projects`,
          `**[6 days ago]** Pre-sale whitelist reached capacity — waitlist now open for late participants`,
        ],
      },
      {
        type: "paragraph",
        text: `Set up a news alert for ${ticker} to receive summaries directly in your Trust.net feed.`,
      },
    ],
  };

  if (responses[promptKey]) return responses[promptKey];

  // Generic fallback for any custom typed message
  return [
    {
      type: "paragraph",
      text: `Great question about ${name}. Here's what the available data tells us:`,
    },
    {
      type: "bullets",
      items: [
        `${name} (${ticker}) is currently in pre-sale at ${price} on ${chain}`,
        `Community sentiment is ${bullish}% bullish — above the platform average of 68%`,
        `Security audit grade: ${secGrade} (${secScore}/100)`,
        `FDV at current pre-sale price: ${fdv}`,
      ],
    },
    {
      type: "paragraph",
      text: `For a deeper analysis on this specific question, try one of the structured research prompts above, or upgrade to Trust.ai Pro for unlimited custom research queries with full data access.`,
    },
  ];
}
