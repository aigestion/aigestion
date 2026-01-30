import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VideoCameraIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

interface CameraCardProps {
  device: any;
  onControl: (domain: string, service: string, data: any) => Promise<void>;
}

const CameraCard: React.FC<CameraCardProps> = ({ device, onControl }) => {
  const [isLive, setIsLive] = useState(false);

  // Use entity picture (snapshot) or stream URL if available
  // In a real app we would fetch the stream URL from HA via API
  const snapshotUrl = device.attributes.entity_picture
    ? `${localStorage.getItem('ha_url')}${device.attributes.entity_picture}&token=${localStorage.getItem('ha_token')}`
    : 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-xl relative group"
    >
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/30 backdrop-blur-md text-blue-200">
            <VideoCameraIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm shadow-black drop-shadow-md">{device.attributes.friendly_name}</h3>
            <p className="text-[10px] text-gray-300">{device.state}</p>
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${device.state === 'idle' ? 'bg-gray-600/50 text-gray-300' : 'bg-red-600 text-white animate-pulse'}`}>
          {device.state === 'recording' ? 'REC' : 'LIVE'}
        </div>
      </div>

      <div className="relative h-48 bg-black">
        <img
          src={snapshotUrl}
          alt={device.attributes.friendly_name}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />

        {/* Overlay Controls (visible on hover) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-md transition-all text-white">
            <ArrowsPointingOutIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Footer info can go here */}
      <div className="p-3 bg-gray-900/90 flex justify-between items-center text-xs text-gray-400">
         <span>Motion Detected: 2m ago</span>
         <span>1080p</span>
      </div>

    </motion.div>
  );
};

export default CameraCard;
