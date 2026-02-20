import React from 'react';
import { motion } from 'framer-motion';
import { User, Star, Zap, DollarSign } from 'lucide-react';

interface PersonaCardProps {
  persona: {
    id: string;
    name: string;
    description: string;
    price: number;
    reputationScore: number;
    totalExecutions: number;
    tags: string[];
    isHired?: boolean;
  };
  onHire: (id: string) => void;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona, onHire }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden group rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 transition-all hover:border-nexus-blue/50"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-nexus-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-lg bg-nexus-blue/10 text-nexus-blue">
            <User size={24} />
          </div>
          <div className="flex items-center gap-1 text-yellow-400 font-bold">
            <Star size={16} fill="currentColor" />
            <span>{persona.reputationScore.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-nexus-blue transition-colors">
          {persona.name}
        </h3>
        <p className="text-white/60 text-sm mb-6 line-clamp-2 h-10">
          {persona.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Zap size={14} />
            <span>{persona.totalExecutions} Execs</span>
          </div>
          <div className="flex items-center gap-2 text-nexus-blue font-mono">
            <DollarSign size={14} />
            <span>{persona.price} NXS</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {persona.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 rounded-md bg-white/5 text-white/40 text-[10px] uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onHire(persona.id)}
          disabled={persona.isHired}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            persona.isHired
              ? 'bg-green-500/20 text-green-500 border border-green-500/50 cursor-default'
              : 'bg-nexus-blue text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,183,255,0.4)]'
          }`}
        >
          {persona.isHired ? 'HIRED' : 'CONTRACT'}
        </button>
      </div>
    </motion.div>
  );
};
