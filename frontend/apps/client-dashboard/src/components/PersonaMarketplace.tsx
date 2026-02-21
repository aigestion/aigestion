import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Star,
  Zap,
  ShieldCheck,
  Play,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';

interface Persona {
  id: string;
  name: string;
  description: string;
  price: number;
  reputation: number;
  executions: number;
  tags: string[];
  color: string;
}

const PERSONAS: Persona[] = [
  {
    id: 'daniela',
    name: 'Daniela Nexus',
    description: 'Voz oficial del Nexus. Especialista en gestión de sistemas y operaciones.',
    price: 0,
    reputation: 4.9,
    executions: 12450,
    tags: ['Sovereign', 'Admin', 'Official'],
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'jules',
    name: 'Jules Gem',
    description: 'Auditor de código y optimizador de rendimiento. Estándares Google.',
    price: 50,
    reputation: 5.0,
    executions: 3200,
    tags: ['Tech', 'Audit', 'Performance'],
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'navigator',
    name: 'Navigator Prime',
    description: 'Análisis espacial y navegación multimodal. Percepción avanzada.',
    price: 35,
    reputation: 4.8,
    executions: 8900,
    tags: ['Vision', 'Maps', 'Logic'],
    color: 'from-emerald-500 to-teal-600',
  },
];

interface PersonaMarketplaceProps {
  activePersonaId: string;
  onSelectPersona: (persona: Persona) => void;
}

export const PersonaMarketplace: React.FC<PersonaMarketplaceProps> = ({
  activePersonaId,
  onSelectPersona,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-purple-400" />
            Voz Soberana — Marketplace
          </h2>
          <p className="text-white/60 text-sm">
            Descubre y contrata agentes de IA con personalidades únicas.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-white text-xs font-medium">Volumen: $42.5K</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-400" />
            <span className="text-white text-xs font-medium">Reputación Global: 4.9</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" />
        <input
          type="text"
          placeholder="Buscar personalidades, habilidades o etiquetas..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {PERSONAS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(
            (persona, idx) => (
              <motion.div
                layout
                key={persona.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all active:scale-95"
              >
                {/* Card Aura */}
                <div
                  className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${persona.color} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`}
                />

                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-br ${persona.color} text-white shadow-lg shadow-black/20`}
                  >
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-orange-400 text-sm font-bold">
                      <Star className="w-4 h-4 fill-orange-400" />
                      {persona.reputation}
                    </div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                      {persona.executions.toLocaleString()} ejecuciones
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors uppercase italic">
                  {persona.name}
                </h3>
                <p className="text-white/60 text-sm mb-6 line-clamp-2">{persona.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {persona.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold uppercase tracking-wider bg-white/10 border border-white/10 px-2 py-1 rounded-md text-white/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 uppercase font-bold">Precio</span>
                    <span className="text-xl font-black text-white">
                      {persona.price === 0 ? 'FREE' : `$${persona.price}`}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectPersona(persona)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-white/10 ${
                      activePersonaId === persona.id
                        ? 'bg-purple-600 text-white border border-purple-400'
                        : 'bg-white text-black hover:bg-purple-100'
                    }`}
                  >
                    {activePersonaId === persona.id ? 'Activo' : 'Contratar'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Sample Voice Trigger */}
                <button className="absolute top-4 right-20 p-2 text-white/20 hover:text-white transition-colors">
                  <Play className="w-4 h-4" />
                </button>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
