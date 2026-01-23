import React, { createContext, useContext, useState, useEffect } from 'react';

export type SyncStatus = 'SYNCED' | 'PENDING' | 'ERROR';
export type ThemeMode = 'OBSIDIAN' | 'CYBERPUNK' | 'VIOLET_NIGHT' | 'WHITE_HOLE';

interface MobileGodModeContextType {
  isOledMode: boolean;
  setIsOledMode: (val: boolean) => void;
  themeMode: ThemeMode;
  setThemeMode: (val: ThemeMode) => void;
  isGestureNavEnabled: boolean;
  setIsGestureNavEnabled: (val: boolean) => void;
  batteryLevel: number;
  isCharging: boolean;
  tempStatus: 'NORMAL' | 'WARM' | 'HOT';
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  isOffline: boolean;
  syncStatus: 'SYNCED' | 'PENDING' | 'ERROR';
  activeSessions: number;
  currentZone: string | null;
}

const MobileGodModeContext = createContext<MobileGodModeContextType | undefined>(undefined);

export const MobileGodModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOledMode, setIsOledMode] = useState(() => localStorage.getItem('isOledMode') === 'true');
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem('themeMode') as ThemeMode) || 'OBSIDIAN');
  const [isGestureNavEnabled, setIsGestureNavEnabled] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const [tempStatus, setTempStatus] = useState<'NORMAL' | 'WARM' | 'HOT'>('NORMAL');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'SYNCED' | 'PENDING' | 'ERROR'>('SYNCED');
  const [activeSessions, setActiveSessions] = useState(1);
  const [currentZone, setCurrentZone] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('isOledMode', String(isOledMode));
    document.documentElement.style.setProperty('--nexus-obsidian', isOledMode ? '#000000' : '#010103');
  }, [isOledMode]);

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    const themes = {
      OBSIDIAN: { primary: '#8a2be2', secondary: '#00f5ff' },
      CYBERPUNK: { primary: '#ff00ff', secondary: '#ffff00' },
      VIOLET_NIGHT: { primary: '#4b0082', secondary: '#9400d3' },
      WHITE_HOLE: { primary: '#ffffff', secondary: '#000000' }
    };
    const colors = themes[themeMode];
    document.documentElement.style.setProperty('--nexus-violet', colors.primary);
    document.documentElement.style.setProperty('--nexus-cyan', colors.secondary);
  }, [themeMode]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setSyncStatus('PENDING');
      setTimeout(() => setSyncStatus('SYNCED'), 3000);
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulación Multi-Dashboard Sync (Mejora #31)
    const sessionInterval = setInterval(() => {
      setActiveSessions(Math.floor(Math.random() * 3) + 1);
    }, 15000);

    // Simulación Geofencing (Mejora #37)
    const zones = ['OFICINA_CENTRAL', 'NODO_ALPHA', 'WAR_ROOM_PHYSICAL', 'CASA_ADMIN'];
    const zoneInterval = setInterval(() => {
      if (Math.random() > 0.9) setCurrentZone(zones[Math.floor(Math.random() * zones.length)]);
    }, 20000);

    // @ts-ignore
    if (navigator.getBattery) {
      // @ts-ignore
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(sessionInterval);
      clearInterval(zoneInterval);
    };
  }, []);

  return (
    <MobileGodModeContext.Provider value={{
      isOledMode, setIsOledMode,
      themeMode, setThemeMode,
      isGestureNavEnabled, setIsGestureNavEnabled,
      batteryLevel, isCharging, tempStatus, isAuthenticated, setIsAuthenticated,
      isOffline, syncStatus, activeSessions, currentZone
    }}>
      {children}
    </MobileGodModeContext.Provider>
  );
};

export const useMobileGodMode = () => {
  const context = useContext(MobileGodModeContext);
  if (!context) throw new Error('useMobileGodMode must be used within a MobileGodModeProvider');
  return context;
};
