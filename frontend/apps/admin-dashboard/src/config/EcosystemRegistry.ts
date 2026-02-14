
export type EcosystemType = 'LOGISTICS' | 'SAAS' | 'LEGAL' | 'AI_AGENCY';

export interface EcosystemProfile {
  id: EcosystemType;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  modules: string[];
  branding: {
    logo: string;
    title: string;
    subtitle: string;
  };
}

export const ECOSYSTEM_REGISTRY: Record<EcosystemType, EcosystemProfile> = {
  LOGISTICS: {
    id: 'LOGISTICS',
    name: 'Logistics Fleet',
    primaryColor: '#0ea5e9', // cyan-500
    secondaryColor: '#6366f1', // indigo-500
    accentColor: '#f59e0b', // amber-500
    modules: ['map', 'fleet', 'inventory', 'analytics'],
    branding: {
      logo: 'Truck',
      title: 'LOGISTICS',
      subtitle: 'Global Supply Chain Node',
    },
  },
  SAAS: {
    id: 'SAAS',
    name: 'SaaS Platform',
    primaryColor: '#8b5cf6', // violet-500
    secondaryColor: '#ec4899', // pink-500
    accentColor: '#10b981', // emerald-500
    modules: ['subscriptions', 'users', 'billing', 'analytics'],
    branding: {
      logo: 'Zap',
      title: 'PLATFORM',
      subtitle: 'Enterprise SaaS Dashboard',
    },
  },
  LEGAL: {
    id: 'LEGAL',
    name: 'Law Intelligence',
    primaryColor: '#64748b', // slate-500
    secondaryColor: '#94a3b8', // slate-400
    accentColor: '#d97706', // amber-600
    modules: ['documents', 'cases', 'clients', 'archive'],
    branding: {
      logo: 'Shield',
      title: 'LEGAL',
      subtitle: 'Sovereign Case Management',
    },
  },
  AI_AGENCY: {
    id: 'AI_AGENCY',
    name: 'AI Agency',
    primaryColor: '#22d3ee', // cyan-400
    secondaryColor: '#818cf8', // indigo-400
    accentColor: '#f472b6', // pink-400
    modules: ['agents', 'tokens', 'neural-map', 'analytics'],
    branding: {
      logo: 'Brain',
      title: 'NEXUS',
      subtitle: 'Sovereign Intelligence Unit',
    },
  },
};
