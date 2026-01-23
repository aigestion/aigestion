/**
 * 🛡️ AIGestion.net Nexus Intelligence Hub
 * © 2026 Alejandro Manuel Alfonso Fernández (DNI: 28921591B). Proprietary & Restricted.
 * SHA-256 Auth Signature: NEXUS-INTEL-HUB-v1.0
 */
import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import { IntelligenceService } from '../services/intelligence.service';
import haAdapter from '../smartHome/homeAssistantAdapter';
import DeviceCard from './components/DeviceCard';
import { SignalCard } from './components/SignalCard';
import { BrandGallery } from './components/BrandGallery';

export const IntelligenceHub = () => {
  const [sources, setSources] = useState([
    { name: 'TechCrunch AI', type: 'rss', status: 'active', lastUpdate: 'Live' },
    { name: 'MarketWatch', type: 'rss', status: 'active', lastUpdate: 'Live' },
    { name: 'Competitor Monitor', type: 'internal', status: 'active', lastUpdate: 'Live' },
  ]);

  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(true);

  // Fetch Signals on Mount
  useEffect(() => {
    const loadIntelligence = async () => {
      setLoading(true);
      try {
        const data = await IntelligenceService.getSignals();
        setSignals(data);
      } catch (error) {
        console.error('Failed to load signals', error);
      } finally {
        setLoading(false);
      }
    };
    loadIntelligence();
  }, []);

  // Fetch devices from Home Assistant on mount
  useEffect(() => {
    const loadDevices = async () => {
      setDevicesLoading(true);
      try {
        const devs = await haAdapter.discoverDevices();
        setDevices(devs);
      } catch (e) {
        console.error('Failed to load devices', e);
      } finally {
        setDevicesLoading(false);
      }
    };
    loadDevices();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-gray-950">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <img src="/brand/logo.png" alt="AIGestion" className="w-10 h-10 rounded-full shadow-md" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hub de Inteligencia
            </h2>
            <p className="text-gray-500 text-sm">
              Gestor automatizado de conocimiento y captación del ecosistema
            </p>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition flex items-center gap-2">
          <span>+</span> Añadir Fuente
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full overflow-hidden">
        {/* Flujo de Señales (Main Feed) */}
        <div className="xl:col-span-3 space-y-6 flex flex-col h-full overflow-hidden">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Último Resumen de Señales
              </h3>
              <div className="flex gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full animate-pulse">
                  ● LIVE FEED
                </span>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {loading
                ? // Loading Skeleton
                  [1, 2, 3].map(i => <Spinner key={i} />)
                : signals.map(signal => <SignalCard key={signal.id} signal={signal} />)}
            </div>

            {/* Smart Home Devices */}
            <div className="mt-8">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                Dispositivos Smart Home
              </h3>
              {devicesLoading
                ? [1, 2, 3].map(i => <Spinner key={i} />)
                : devices.map(dev => <DeviceCard key={dev.id} device={dev} />)}
            </div>
          </div>
        </div>

        {/* Sidebar: Fuentes y Salud */}
        <div className="space-y-6 overflow-y-auto custom-scrollbar">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold mb-4 text-sm text-gray-400 uppercase">Fuentes Activas</h3>
            <div className="space-y-4">
              {sources.map(source => (
                <div key={source.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                      {source.name}
                    </p>
                    <p className="text-[10px] text-gray-400">Estado: {source.lastUpdate}</p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${source.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-150 transition-transform duration-700"></div>

            <h4 className="font-bold mb-2 italic relative z-10">Sinergia de Inteligencia</h4>
            <p className="text-xs opacity-80 mb-4 relative z-10 leading-relaxed">
              Detectamos{' '}
              <span className="font-bold text-white">
                {signals.filter(s => s.priority === 'high').length} señales críticas
              </span>{' '}
              que afectan tu roadmap.
            </p>
            <button className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-xs font-bold transition border border-white/10 relative z-10">
              Ejecutar Análisis Profundo
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Brand Gallery</h2>
        <BrandGallery />
      </div>
    </div>
  );
};
