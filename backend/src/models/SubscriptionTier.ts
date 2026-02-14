export enum TierType {
  FREE = 'free',
  SENTINEL = 'sentinel',
  SOVEREIGN = 'sovereign',
  DEITY = 'deity',
}

export interface ISubscriptionTier {
  id: TierType;
  name: string;
  monthlyTokenLimit: number;
  pricePerKTokens: number; // For overage or metered billing
  features: string[];
}

export const SUBSCRIPTION_TIERS: Record<TierType, ISubscriptionTier> = {
  [TierType.FREE]: {
    id: TierType.FREE,
    name: 'Free Apprentice',
    monthlyTokenLimit: 50000,
    pricePerKTokens: 0, // No overage on free
    features: ['Basic AI Chat', 'Standard Support'],
  },
  [TierType.SENTINEL]: {
    id: TierType.SENTINEL,
    name: 'Sentinel',
    monthlyTokenLimit: 500000,
    pricePerKTokens: 0.15,
    features: ['Full Dashboard Access', 'Priority Routing', 'Basic Automations'],
  },
  [TierType.SOVEREIGN]: {
    id: TierType.SOVEREIGN,
    name: 'Sovereign',
    monthlyTokenLimit: 2000000,
    pricePerKTokens: 0.10,
    features: ['Swarm Engine Access', 'Persona Marketplace Creation', 'Ad-hoc Agent Orquestation', 'Self-Healing Apps'],
  },
  [TierType.DEITY]: {
    id: TierType.DEITY,
    name: 'Deity (Custom)',
    monthlyTokenLimit: 10000000,
    pricePerKTokens: 0.05,
    features: ['Dedicated Instance', 'Custom Agent Training', 'Direct Developer Support', 'Full System Sovereignty'],
  },
};
