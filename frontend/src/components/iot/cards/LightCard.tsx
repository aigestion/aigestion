import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { SwatchesPicker } from 'react-color';

interface LightCardProps {
  device: any;
  onControl: (domain: string, service: string, data: any) => Promise<void>;
}

const LightCard: React.FC<LightCardProps> = ({ device, onControl }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const isOn = device.state === 'on';
  const brightness = device.attributes.brightness ? Math.round((device.attributes.brightness / 255) * 100) : 0;

  // Handlers
  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onControl('light', isOn ? 'turn_off' : 'turn_on', { entity_id: device.entity_id });
  };

  const setBrightness = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    onControl('light', 'turn_on', {
      entity_id: device.entity_id,
      brightness_pct: val
    });
  };

  const handleColorChange = (color: any) => {
    onControl('light', 'turn_on', {
      entity_id: device.entity_id,
      rgb_color: [color.rgb.r, color.rgb.g, color.rgb.b]
    });
  };

  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 ${isOn ? 'bg-gray-800 border-yellow-500/50 shadow-lg shadow-yellow-500/10' : 'bg-gray-800/50 border-gray-700'}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isOn ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
            <LightBulbIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white leading-tight">{device.attributes.friendly_name}</h3>
            <p className="text-xs text-gray-500 capitalize">{device.state}</p>
          </div>
        </div>
        <button
          onClick={toggle}
          className={`w-12 h-7 rounded-full transition-colors duration-300 relative ${isOn ? 'bg-green-500' : 'bg-gray-600'}`}
        >
          <motion.div
            animate={{ x: isOn ? 22 : 2 }}
            className="w-5 h-5 bg-white rounded-full absolute top-1 shadow-md"
          />
        </button>
      </div>

      {/* Controls */}
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Brightness */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Brightness</span>
                <span>{brightness}%</span>
              </div>
              <input
                type="range"
                min="0" max="100"
                defaultValue={brightness}
                onMouseUp={setBrightness}
                onTouchEnd={setBrightness}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
            </div>

            {/* Color Toggle */}
            <div className="flex justify-between items-center">
               <span className="text-xs text-gray-400">Color</span>
               <button
                 onClick={() => setShowColorPicker(!showColorPicker)}
                 className="w-6 h-6 rounded-full border border-gray-500"
                 style={{ backgroundColor: device.attributes.rgb_color ? `rgb(${device.attributes.rgb_color.join(',')})` : '#fff' }}
               />
            </div>

            {/* Color Picker */}
            {showColorPicker && (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="absolute bottom-0 left-0 right-0 z-10"
               >
                 <div onClick={() => setShowColorPicker(false)} className="fixed inset-0 z-0" />
                 <div className="relative z-10 bg-gray-900 border border-gray-700 rounded-xl p-2 shadow-2xl">
                    <SwatchesPicker
                      color={device.attributes.rgb_color ? `rgb(${device.attributes.rgb_color.join(',')})` : '#fff'}
                      onChangeComplete={handleColorChange}
                      width="100%"
                      height={120}
                    />
                 </div>
               </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LightCard;
