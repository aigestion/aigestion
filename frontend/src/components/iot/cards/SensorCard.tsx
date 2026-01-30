import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, ThermometerIcon, BeakerIcon, BoltIcon } from '@heroicons/react/24/outline';

interface SensorCardProps {
  device: any;
}

const SensorCard: React.FC<SensorCardProps> = ({ device }) => {
  // Determine icon based on device class or id
  const getIcon = () => {
    if (device.entity_id.includes('temp')) return <ThermometerIcon className="w-5 h-5 text-red-400" />;
    if (device.entity_id.includes('humidity')) return <BeakerIcon className="w-5 h-5 text-blue-400" />;
    if (device.entity_id.includes('power') || device.entity_id.includes('energy')) return <BoltIcon className="w-5 h-5 text-yellow-400" />;
    return <ChartBarIcon className="w-5 h-5 text-gray-400" />;
  };

  const getUnit = () => device.attributes.unit_of_measurement || '';

  // Mock mini-chart
  const mockHistory = [40, 65, 55, 80, 70, 90, 85];
  const max = Math.max(...mockHistory);
  const min = Math.min(...mockHistory);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-2xl p-5 border border-gray-700 shadow-lg relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-700/50">
            {getIcon()}
          </div>
          <div>
             <h3 className="font-semibold text-gray-200 text-sm">{device.attributes.friendly_name}</h3>
             <p className="text-xs text-gray-500">Last updated: 5m ago</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">{device.state}</span>
          <span className="text-sm text-gray-400">{getUnit()}</span>
        </div>

        {/* Simple SVG Sparkline */}
        <div className="w-24 h-12">
            <svg className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-500 opacity-50"
                points={mockHistory.map((val, i) => `${i * (96 / (mockHistory.length - 1))},${48 - ((val - min) / (max - min)) * 48}`).join(' ')}
              />
            </svg>
        </div>
      </div>

      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -mr-10 -mt-10" />
    </motion.div>
  );
};

export default SensorCard;
