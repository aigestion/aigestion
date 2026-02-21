import React, { useState } from 'react';
import { Shield, Brain, Scale, ChevronRight, Activity } from 'lucide-react';

interface Resolution {
  id: string;
  timestamp: string;
  topic: string;
  perspectives: {
    agent: string;
    opinion: string;
  }[];
  decision: string;
  justification: string;
}

const mockResolutions: Resolution[] = [
  {
    id: 'res_1',
    timestamp: '2026-02-14 08:15',
    topic: 'Optimización de Nodos en LATAM',
    perspectives: [
      { agent: 'Daniela-Si', opinion: 'Expandir inmediatamente para capturar mercado.' },
      { agent: 'Jules-Code', opinion: 'Retrasar por inconsistencias en la latencia de la API de GCP.' }
    ],
    decision: 'Expansión Gradual con Fallback Local',
    justification: 'Se prioriza el ROI de Daniela pero bajo los protocolos de seguridad técnica de Jules.'
  },
  {
    id: 'res_2',
    timestamp: '2026-02-14 07:45',
    topic: 'Protocolo de Seguridad Quantum',
    perspectives: [
      { agent: 'Daniela-Si', opinion: 'Mantener estándares actuales para reducir costos.' },
      { agent: 'Jules-Code', opinion: 'Implementar PQC (Post-Quantum Cryptography) de inmediato.' }
    ],
    decision: 'Implementación Selectiva de PQC',
    justification: 'La soberanía del sistema requiere seguridad impenetrable, incluso a mayor costo operativo.'
  }
];

export const SovereignJudgeLog: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Scale size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Bitácora del Juez Soberana</h2>
            <p className="text-sm text-gray-400">Resolución de Conflictos Cognitivos</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
          <Activity size={12} />
          Arbitraje Activo
        </div>
      </div>

      <div className="space-y-4">
        {mockResolutions.map((res) => (
          <div
            key={res.id}
            onClick={() => setSelected(selected === res.id ? null : res.id)}
            className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
              selected === res.id
                ? 'bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/10'
                : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="mt-1">
                  <Brain size={18} className={selected === res.id ? 'text-purple-400' : 'text-gray-500'} />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {res.topic}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{res.timestamp}</p>
                </div>
              </div>
              <ChevronRight
                size={16}
                className={`text-gray-600 transition-transform duration-300 ${
                  selected === res.id ? 'rotate-90' : ''
                }`}
              />
            </div>

            {selected === res.id && (
              <div className="mt-6 space-y-4 border-t border-white/10 pt-4 animate-in fade-in slide-in-from-top-1">
                <div className="grid grid-cols-2 gap-4">
                  {res.perspectives.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                        {p.agent}
                      </span>
                      <p className="text-xs text-gray-300 mt-1 italic">"{p.opinion}"</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={14} className="text-purple-300" />
                    <span className="text-xs font-bold text-purple-100 uppercase tracking-widest">
                      Veredicto Soberano
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mb-2">{res.decision}</p>
                  <p className="text-xs text-purple-200/70 leading-relaxed italic">
                    {res.justification}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
