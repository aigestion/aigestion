
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EcosystemProfile, EcosystemType, ECOSYSTEM_REGISTRY } from '../config/EcosystemRegistry';

interface EcosystemContextType {
  profile: EcosystemProfile;
  setEcosystem: (type: EcosystemType) => void;
}

const EcosystemContext = createContext<EcosystemContextType | undefined>(undefined);

export const EcosystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<EcosystemProfile>(ECOSYSTEM_REGISTRY.AI_AGENCY);

  const setEcosystem = (type: EcosystemType) => {
    setProfile(ECOSYSTEM_REGISTRY[type]);
  };

  return (
    <EcosystemContext.Provider value={{ profile, setEcosystem }}>
      <div style={{ 
        '--primary-glow': profile.primaryColor,
        '--accent-glow': profile.accentColor,
      } as React.CSSProperties}>
        {children}
      </div>
    </EcosystemContext.Provider>
  );
};

export const useEcosystem = () => {
  const context = useContext(EcosystemContext);
  if (!context) {
    throw new Error('useEcosystem must be used within an EcosystemProvider');
  }
  return context;
};
