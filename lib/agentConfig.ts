export type AgentConfig = {
  id: string;
  standard: "ERC-8004";
  role: string;
  chains: string[];
  description: string;
};

export const balanceRailAgent: AgentConfig = {
  id: "balance-rail-budget-agent",
  standard: "ERC-8004",
  role: "Prepaid budget & AI NISA allocator",
  chains: ["Avalanche Fuji"],
  description: "Agent that governs split rules between user balance, AI NISA vault and fees.",
} as const;
