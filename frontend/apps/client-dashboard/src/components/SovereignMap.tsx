import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Radar, Maximize2 } from 'lucide-react';
import { api } from '../services/api';

/**
 * 🗺️ SOVEREIGN MAP WIDGET
 * Displays real-time location and spatial context of the Pixel 8.
 * Integrates with NavigatorGem findings.
 */
export const SovereignMap = () => {
  const [state, setState] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchState = async () => {
    try {
      const data = await api.getSystemHealth();
      setState(data.data.device);
    } catch (err) {
      console.error('Failed to fetch device state', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 60000); // Pulse every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full bg-white/5 animate-pulse rounded-2xl border border-white/10 flex items-center justify-center">
        <Radar className="w-8 h-8 text-white/20 animate-spin" />
      </div>
    );
  }

  const coords = state?.coords || { lat: 0, lng: 0 };
  const hasCoords = coords.lat !== 0 || coords.lng !== 0;

  // Use a sovereign dark-themed static map (using Google Maps API)
  // We approximate a "radar" look via markers and zoom levels
  const mapUrl = hasCoords
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=15&size=600x400&maptype=roadmap&style=feature:all|element:labels|visibility:off&style=feature:all|element:geometry|color:0x212121&style=feature:water|element:geometry|color:0x000000&style=feature:road|element:geometry|color:0x3c3c3c&markers=color:0xa855f7|${coords.lat},${coords.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY || ''}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full h-full overflow-hidden rounded-2xl border border-white/10 bg-black group"
    >
      {/* Map Background */}
      {mapUrl ? (
        <img
          src={mapUrl}
          alt="Tactical Radar"
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-zinc-900">
          <MapPin className="w-8 h-8 text-red-500/50" />
          <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
            No Signal
          </span>
        </div>
      )}

      {/* Radar Overlay (Sovereign Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black via-transparent to-transparent opacity-60" />

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Content Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${hasCoords ? 'bg-purple-500 animate-pulse' : 'bg-red-500'}`}
            />
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
              {state?.location || 'Sector Desconocido'}
            </span>
          </div>
          {state?.sector && (
            <div className="text-[8px] text-purple-300 uppercase opacity-70 mt-0.5">
              {state.sector}
            </div>
          )}
        </div>

        <button className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
          <Maximize2 className="w-3.5 h-3.5 text-white/70" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] text-white/40 uppercase tracking-widest">Latitude</span>
            <span className="text-[10px] font-mono text-white/90">{coords.lat.toFixed(6)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-white/40 uppercase tracking-widest">Longitude</span>
            <span className="text-[10px] font-mono text-white/90">{coords.lng.toFixed(6)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-purple-400" />
          <span className="text-[10px] font-bold text-white/80">READY</span>
        </div>
      </div>

      {/* Glitch Overlay on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-purple-500 mix-blend-overlay pointer-events-none" />
    </motion.div>
  );
};
