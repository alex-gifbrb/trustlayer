// All project data mirroring the Express backend — used as fallback when API is unavailable

export const projects = [
  {
    id: 1,
    name: "Aztec",
    ticker: "AZTEC",
    price: 0.065,
    priceFormatted: "$0.065",
    chain: "ETH",
    change1h: 2.4,
    change24h: 8.7,
    volume24h: 1240000,
    fdv: 65000000,
    boosts: 1842,
    bullish: 72,
    bearish: 28,
    lastAdded: "2 hours ago",
    category: "mostTalked",
    logo: "A",
    color: "#8B5CF6",
  },
  {
    id: 2,
    name: "Superform",
    ticker: "UP",
    price: 5.5,
    priceFormatted: "$5.50",
    chain: "BASE",
    change1h: -0.8,
    change24h: 14.2,
    volume24h: 3870000,
    fdv: 550000000,
    boosts: 3201,
    bullish: 84,
    bearish: 16,
    lastAdded: "5 hours ago",
    category: "mostTalked",
    logo: "S",
    color: "#10B981",
  },
  {
    id: 3,
    name: "Xyzverse",
    ticker: "XYZ",
    price: 0.007,
    priceFormatted: "$0.007",
    chain: "SOL",
    change1h: 5.1,
    change24h: -3.4,
    volume24h: 487000,
    fdv: 7000000,
    boosts: 956,
    bullish: 61,
    bearish: 39,
    lastAdded: "1 day ago",
    category: "mostTalked",
    logo: "X",
    color: "#F59E0B",
  },
  {
    id: 5,
    name: "Morpho",
    ticker: "MORPHO",
    price: 1.84,
    priceFormatted: "$1.84",
    chain: "ETH",
    change1h: -1.2,
    change24h: 6.3,
    volume24h: 9420000,
    fdv: 184000000,
    boosts: 2134,
    bullish: 77,
    bearish: 23,
    lastAdded: "4 hours ago",
    category: "mostTalked",
    logo: "M",
    color: "#06B6D4",
  },
  {
    id: 6,
    name: "Autism Coin",
    ticker: "AUTISM",
    price: 0.0042,
    priceFormatted: "$0.0042",
    chain: "SOL",
    change1h: 3.8,
    change24h: 22.1,
    volume24h: 2310000,
    fdv: 4200000,
    boosts: 1677,
    bullish: 88,
    bearish: 12,
    lastAdded: "6 hours ago",
    category: "mostTalked",
    logo: "AU",
    color: "#EC4899",
  },
  {
    id: 4,
    name: "Forg",
    ticker: "FO",
    price: 0.001,
    priceFormatted: "$0.001",
    chain: "ETH",
    change1h: 0.3,
    change24h: 1.1,
    volume24h: 92000,
    fdv: 1000000,
    boosts: 422,
    bullish: 55,
    bearish: 45,
    lastAdded: "3 days ago",
    category: "launchingSoon",
    get launchDate() { return new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(); },
    logo: "F",
    color: "#EF4444",
  },
];

const projectDetails = {
  XYZ: {
    description:
      "Xyzverse is a next-generation metaverse protocol built on Solana, enabling creators and communities to build, own, and monetize decentralized virtual worlds. The platform combines high-performance on-chain gaming infrastructure with a robust DeFi layer, giving players true ownership of in-game assets through NFTs and a play-to-earn economy.",
    founded: "2023",
    contracts: [
      { label: "Token", address: "7xKX...f9Mq", explorer: "solscan" },
      { label: "Presale", address: "BzR3...4dWp", explorer: "solscan" },
    ],
    explorers: ["Solscan", "Solana Explorer"],
    wallets: ["Phantom", "Solflare", "Backpack"],
    trustAiSummary:
      "Xyzverse presents a compelling metaverse thesis on Solana with a lean team of 8 and a focused roadmap through Q4 2025. The tokenomics favor early participants with a 15% pre-sale allocation at a significant discount to public sale pricing. Smart contract audit by Sec3 returned zero critical findings. Community growth over the last 30 days is +340% on Discord, suggesting strong organic interest. Key risk: the metaverse sector remains highly competitive with well-funded incumbents.",
    tokenomics: {
      totalSupply: "1,000,000,000",
      preSalePercent: 15,
      preSaleRaise: "$350,000",
      publicSalePercent: 20,
      publicSaleRaise: "$700,000",
      fdv: "$7,000,000",
      initialCirculation: "120,000,000",
      initialCirculationPercent: 12,
      allocation: [
        { label: "Pre-Sale", percent: 15, color: "#F59E0B" },
        { label: "Public Sale", percent: 20, color: "#3B82F6" },
        { label: "Team & Advisors", percent: 18, color: "#8B5CF6" },
        { label: "Ecosystem", percent: 30, color: "#10B981" },
        { label: "Reserve", percent: 17, color: "#6B7280" },
      ],
    },
    get presale() {
      return {
        badge: "Pre-Sale",
        endsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        raised: 2357687,
        goal: 5000000,
      };
    },
    rating: { boostRank: 3, boostScore: 6220, securityGrade: "AA", securityScore: 84.87 },
    links: {
      website: "https://xyzverse.io",
      whitepaper: "https://xyzverse.io/whitepaper.pdf",
      twitter: "https://x.com/xyzverse",
      telegram: "https://t.me/xyzverse",
      discord: "https://discord.gg/xyzverse",
      github: "https://github.com/xyzverse",
    },
    team: {
      status: "Active",
      members: [
        { name: "Alex Rivera", role: "CEO & Co-founder", avatar: "AR" },
        { name: "Maya Chen", role: "CTO", avatar: "MC" },
        { name: "Jordan Park", role: "Head of Design", avatar: "JP" },
        { name: "Sam Okafor", role: "Lead Solidity Dev", avatar: "SO" },
      ],
    },
  },
  AZTEC: {
    description:
      "Aztec is a privacy-first Layer 2 on Ethereum using zero-knowledge proofs, enabling confidential DeFi transactions without revealing amounts or counterparties. Its PLONK proving system delivers fast finality with minimal on-chain data.",
    founded: "2022",
    contracts: [{ label: "Token", address: "0xA3c1...8f2B", explorer: "etherscan" }],
    explorers: ["Etherscan", "Blockscout"],
    wallets: ["MetaMask", "Rainbow", "Coinbase Wallet"],
    trustAiSummary:
      "Aztec occupies a strong privacy niche in the Ethereum ecosystem. ZK proof generation times have improved significantly since v2. Tokenomics are still TBA but the team has outlined a governance-focused distribution. Watch for regulatory risk around privacy protocols.",
    tokenomics: {
      totalSupply: "1,000,000,000",
      preSalePercent: 10,
      preSaleRaise: "$650,000",
      publicSalePercent: 15,
      publicSaleRaise: "$975,000",
      fdv: "$65,000,000",
      initialCirculation: "80,000,000",
      initialCirculationPercent: 8,
      allocation: [
        { label: "Pre-Sale", percent: 10, color: "#F59E0B" },
        { label: "Public Sale", percent: 15, color: "#3B82F6" },
        { label: "Team & Advisors", percent: 20, color: "#8B5CF6" },
        { label: "Ecosystem", percent: 35, color: "#10B981" },
        { label: "Reserve", percent: 20, color: "#6B7280" },
      ],
    },
    get presale() {
      return {
        badge: "Pre-Sale",
        endsAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        raised: 1200000,
        goal: 3000000,
      };
    },
    rating: { boostRank: 7, boostScore: 1842, securityGrade: "A+", securityScore: 79.4 },
    links: {
      website: "https://aztec.network",
      whitepaper: "https://aztec.network/whitepaper.pdf",
      twitter: "https://x.com/aztecnetwork",
      telegram: "https://t.me/aztecnetwork",
      discord: "https://discord.gg/aztec",
      github: "https://github.com/AztecProtocol",
    },
    team: {
      status: "Active",
      members: [
        { name: "Zac Williamson", role: "CEO", avatar: "ZW" },
        { name: "Joe Andrews", role: "COO", avatar: "JA" },
      ],
    },
  },
  UP: {
    description:
      "Superform is a universal yield marketplace built on Base, aggregating yield opportunities across protocols and chains into a single interface. Users can discover, compare, and deposit into curated vaults with one click.",
    founded: "2023",
    contracts: [{ label: "Token", address: "0xB5f2...2c9A", explorer: "basescan" }],
    explorers: ["Basescan", "Blockscout"],
    wallets: ["MetaMask", "Coinbase Wallet", "Rainbow"],
    trustAiSummary:
      "Superform has strong product-market fit as a yield aggregator. TVL grew 5x in Q1 2024. The UP token plays a dual governance and fee-share role. Competitive moat comes from deep integrations across 40+ protocols. Main risk: smart contract surface area is large.",
    tokenomics: {
      totalSupply: "100,000,000",
      preSalePercent: 8,
      preSaleRaise: "$440,000",
      publicSalePercent: 12,
      publicSaleRaise: "$660,000",
      fdv: "$550,000,000",
      initialCirculation: "15,000,000",
      initialCirculationPercent: 15,
      allocation: [
        { label: "Pre-Sale", percent: 8, color: "#F59E0B" },
        { label: "Public Sale", percent: 12, color: "#3B82F6" },
        { label: "Team & Advisors", percent: 22, color: "#8B5CF6" },
        { label: "Ecosystem", percent: 40, color: "#10B981" },
        { label: "Reserve", percent: 18, color: "#6B7280" },
      ],
    },
    get presale() {
      return {
        badge: "Pre-Sale",
        endsAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        raised: 3100000,
        goal: 4000000,
      };
    },
    rating: { boostRank: 1, boostScore: 3201, securityGrade: "AA+", securityScore: 91.2 },
    links: {
      website: "https://superform.xyz",
      whitepaper: "https://superform.xyz/whitepaper.pdf",
      twitter: "https://x.com/superformxyz",
      telegram: "https://t.me/superform",
      discord: "https://discord.gg/superform",
      github: "https://github.com/superform-xyz",
    },
    team: {
      status: "Active",
      members: [
        { name: "Mark Bhana", role: "CEO", avatar: "MB" },
        { name: "Tim Delissen", role: "CTO", avatar: "TD" },
        { name: "Lars Moo", role: "Head of Growth", avatar: "LM" },
      ],
    },
  },
  FO: {
    description:
      "Forg is a community-driven meme token with DeFi utility, built on Ethereum. The project aims to combine meme culture with staking rewards, NFT collectibles, and governance.",
    founded: "2024",
    contracts: [{ label: "Token", address: "0xFo3g...1b4C", explorer: "etherscan" }],
    explorers: ["Etherscan"],
    wallets: ["MetaMask", "Rainbow"],
    trustAiSummary:
      "Forg is early-stage with strong community signals but limited technical differentiation. Team is pseudonymous. Tokenomics are community-skewed which reduces VC dump risk. Treat as high-risk/high-reward.",
    tokenomics: {
      totalSupply: "1,000,000,000,000",
      preSalePercent: 20,
      preSaleRaise: "$20,000",
      publicSalePercent: 25,
      publicSaleRaise: "$25,000",
      fdv: "$1,000,000",
      initialCirculation: "250,000,000,000",
      initialCirculationPercent: 25,
      allocation: [
        { label: "Pre-Sale", percent: 20, color: "#F59E0B" },
        { label: "Public Sale", percent: 25, color: "#3B82F6" },
        { label: "Team", percent: 10, color: "#8B5CF6" },
        { label: "Community", percent: 45, color: "#10B981" },
      ],
    },
    get presale() {
      return {
        badge: "Pre-Sale",
        endsAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        raised: 48000,
        goal: 100000,
      };
    },
    rating: { boostRank: 24, boostScore: 422, securityGrade: "B", securityScore: 61.3 },
    links: {
      website: "https://forgtoken.com",
      whitepaper: "https://forgtoken.com/whitepaper.pdf",
      twitter: "https://x.com/forgtoken",
      telegram: "https://t.me/forgtoken",
      discord: "https://discord.gg/forg",
      github: "https://github.com/forgtoken",
    },
    team: {
      status: "Active",
      members: [{ name: "Anon Dev", role: "Lead Developer", avatar: "AD" }],
    },
  },
  MORPHO: {
    description:
      "Morpho is a decentralized lending protocol on Ethereum that optimizes yields for both lenders and borrowers by matching them peer-to-peer on top of existing protocols like Aave and Compound. When matches are available, both parties earn better rates than the underlying pool.",
    founded: "2022",
    contracts: [
      { label: "Token", address: "0x58d9...7A4F", explorer: "etherscan" },
      { label: "Morpho-Aave", address: "0x33E4...9bC2", explorer: "etherscan" },
    ],
    explorers: ["Etherscan", "Blockscout"],
    wallets: ["MetaMask", "Rainbow", "Ledger"],
    trustAiSummary:
      "Morpho has demonstrated strong product-market fit in the lending optimization niche. TVL has grown to $2.4B with consistent revenue from fee sharing. The MORPHO token launched with a fair distribution and active governance. Security track record is excellent with zero exploits since mainnet launch. Institutional DeFi integration roadmap is a notable bullish catalyst.",
    tokenomics: {
      totalSupply: "1,000,000,000",
      preSalePercent: 12,
      preSaleRaise: "$22,080,000",
      publicSalePercent: 0,
      publicSaleRaise: "N/A",
      fdv: "$184,000,000",
      initialCirculation: "300,000,000",
      initialCirculationPercent: 30,
      allocation: [
        { label: "Community", percent: 51, color: "#06B6D4" },
        { label: "Team & Advisors", percent: 24, color: "#8B5CF6" },
        { label: "Investors", percent: 12, color: "#F59E0B" },
        { label: "Treasury", percent: 13, color: "#6B7280" },
      ],
    },
    get presale() {
      return {
        badge: "Listed",
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        raised: 22080000,
        goal: 22080000,
      };
    },
    rating: { boostRank: 5, boostScore: 2134, securityGrade: "AA+", securityScore: 92.1 },
    links: {
      website: "https://morpho.org",
      whitepaper: "https://morpho.org/whitepaper.pdf",
      twitter: "https://x.com/MorphoLabs",
      telegram: "https://t.me/morpho_org",
      discord: "https://discord.gg/morpho",
      github: "https://github.com/morpho-org",
    },
    team: {
      status: "Active",
      members: [
        { name: "Paul Frambot", role: "CEO", avatar: "PF" },
        { name: "Merlin Egalite", role: "CTO", avatar: "ME" },
        { name: "Julien Thomas", role: "CPO", avatar: "JT" },
      ],
    },
  },
  AUTISM: {
    description:
      "Autism Coin is a community-driven meme token on Solana celebrating neurodiversity in crypto. The project donates a portion of transaction fees to autism research and advocacy organizations, blending viral meme culture with real-world social impact.",
    founded: "2024",
    contracts: [{ label: "Token", address: "Aut1sm...3Xpq", explorer: "solscan" }],
    explorers: ["Solscan", "Solana Explorer"],
    wallets: ["Phantom", "Solflare", "Backpack"],
    trustAiSummary:
      "Autism Coin has exceptional community momentum with 340K Twitter followers gained organically in 6 weeks. Charity mechanics add genuine narrative depth beyond pure meme speculation. Tokenomics are fair-launch with no team allocation, reducing sell pressure. High-risk profile typical of meme assets but charitable angle provides a sustained narrative floor.",
    tokenomics: {
      totalSupply: "1,000,000,000,000",
      preSalePercent: 0,
      preSaleRaise: "Fair Launch",
      publicSalePercent: 100,
      publicSaleRaise: "Fair Launch",
      fdv: "$4,200,000",
      initialCirculation: "1,000,000,000,000",
      initialCirculationPercent: 100,
      allocation: [
        { label: "Public / Fair Launch", percent: 90, color: "#EC4899" },
        { label: "Charity Reserve", percent: 10, color: "#10B981" },
      ],
    },
    get presale() {
      return {
        badge: "Listed",
        endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        raised: 4200000,
        goal: 4200000,
      };
    },
    rating: { boostRank: 9, boostScore: 1677, securityGrade: "A", securityScore: 74.5 },
    links: {
      website: "https://autismcoin.io",
      whitepaper: "https://autismcoin.io/litepaper.pdf",
      twitter: "https://x.com/autismcoin",
      telegram: "https://t.me/autismcoin",
      discord: "https://discord.gg/autismcoin",
      github: "https://github.com/autism-coin",
    },
    team: {
      status: "Active",
      members: [
        { name: "Anon Founder", role: "Founder", avatar: "AF" },
        { name: "Community Lead", role: "Head of Community", avatar: "CL" },
      ],
    },
  },
};

/** Returns all projects (mirrors GET /api/projects) */
export function getMockProjects() {
  return projects;
}

/** Returns a single project merged with its detail (mirrors GET /api/projects/:ticker) */
export function getMockProject(ticker) {
  const t = ticker.toUpperCase();
  const base = projects.find((p) => p.ticker === t);
  if (!base) return null;
  const detail = projectDetails[t] || {};
  // Spread detail shallowly; presale getter will be called at access time
  return { ...base, ...detail };
}
