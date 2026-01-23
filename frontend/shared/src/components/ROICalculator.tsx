import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Clock, DollarSign, X, Check } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface ROICalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ROICalculator: React.FC<ROICalculatorProps> = ({ isOpen, onClose }) => {
  const [employees, setEmployees] = useState(50);
  const [hoursSaved, setHoursSaved] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(45);
  const { playWuaw, playHover } = useSound();

  const monthlySavings = employees * hoursSaved * hourlyRate;
  const yearlySavings = monthlySavings * 12;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-nexus-obsidian/90 backdrop-blur-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="relative w-full max-w-4xl bg-black/40 border border-nexus-cyan/20 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_0_100px_rgba(34,211,238,0.15)]"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="text-white/40" size={24} />
            </button>

            {/* Left side: Controls */}
            <div className="flex-1 p-12 border-b lg:border-b-0 lg:border-r border-white/5">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-nexus-cyan/10 flex items-center justify-center text-nexus-cyan-glow border border-nexus-cyan/20">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-2xl font-orbitron font-black tracking-tighter text-white uppercase italic">ROI_VISIONARY</h3>
              </div>

              <div className="space-y-12">
                <ROISlider
                  icon={<Users size={18} />}
                  label="Workforce Size"
                  value={employees}
                  min={1}
                  max={500}
                  unit="users"
                  onChange={setEmployees}
                />
                <ROISlider
                  icon={<Clock size={18} />}
                  label="Weekly Hours Saved"
                  value={hoursSaved}
                  min={1}
                  max={40}
                  unit="hrs/wk"
                  onChange={setHoursSaved}
                />
                <ROISlider
                  icon={<DollarSign size={18} />}
                  label="Avg. Hourly Rate"
                  value={hourlyRate}
                  min={10}
                  max={200}
                  unit="$/hr"
                  onChange={setHourlyRate}
                />
              </div>
            </div>

            {/* Right side: Result */}
            <div className="w-full lg:w-96 p-12 bg-linear-to-br from-nexus-cyan/5 via-transparent to-nexus-violet/5 flex flex-col justify-center items-center text-center">
               <span className="text-[10px] font-orbitron font-black text-nexus-cyan-glow tracking-[0.5em] uppercase mb-4 animate-pulse">
                 impacto_proyectado
               </span>
               <div className="relative mb-8">
                  <motion.h2
                    key={yearlySavings}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-6xl font-orbitron font-black text-white tracking-tighter"
                  >
                    ${(yearlySavings / 1000).toFixed(0)}k
                  </motion.h2>
                  <span className="text-xs text-nexus-silver/40 font-mono italic">yearly_savings_est</span>
               </div>

               <div className="w-full h-[1px] bg-white/5 mb-8" />

               <div className="space-y-4 w-full">
                  <BenefitItem label="Efficiency Boost" value="+42%" />
                  <BenefitItem label="Infrastructure Optimization" value="Sovereign" />
                  <BenefitItem label="Daniela AI Support" value="Omnipresent" />
               </div>

               <button
                onClick={() => { playWuaw(); onClose(); }}
                className="w-full mt-12 py-5 rounded-2xl bg-white text-black font-orbitron font-black text-xs tracking-widest hover:scale-105 active:scale-95 transition-all uppercase shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
               >
                 Aceptar Estrategia
               </button>
            </div>

            {/* Background elements */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-nexus-cyan/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-nexus-violet/5 blur-[80px] rounded-full pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ROISlider: React.FC<{ icon: React.ReactNode, label: string, value: number, min: number, max: number, unit: string, onChange: (v: number) => void }> = ({ icon, label, value, min, max, unit, onChange }) => (
  <div className="space-y-4 group">
    <div className="flex justify-between items-center text-white">
      <div className="flex items-center gap-3">
        <div className="text-nexus-cyan opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
        <span className="text-[10px] font-orbitron font-black uppercase tracking-widest text-nexus-silver/40 group-hover:text-white transition-colors">
          {label}
        </span>
      </div>
      <span className="text-lg font-orbitron font-black text-nexus-cyan-glow">
        {value} <span className="text-[10px] text-white/20 ml-1">{unit}</span>
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-nexus-cyan hover:accent-nexus-cyan-glow transition-all"
    />
  </div>
);

const BenefitItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/5 border border-white/5">
    <div className="flex items-center gap-2">
      <Check size={12} className="text-nexus-cyan-glow" />
      <span className="text-[9px] font-orbitron font-bold text-white/60 text-left">{label}</span>
    </div>
    <span className="text-[9px] font-orbitron font-black text-white">{value}</span>
  </div>
);
