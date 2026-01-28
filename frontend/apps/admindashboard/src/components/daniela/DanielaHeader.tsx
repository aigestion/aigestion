import React from 'react';

export const DanielaHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-orbitron font-black text-white mb-2">
          PANEL DE CONTROL <span className="text-nexus-cyan-glow">DANIELA</span>
        </h2>
        <p className="text-nexus-silver/60 font-mono text-sm">
          Gestión avanzada de asistente IA futurista
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
          <span className="text-green-400 text-sm font-orbitron font-black">SISTEMA ACTIVO</span>
        </div>
        <div className="px-4 py-2 bg-nexus-cyan/10 border border-nexus-cyan/20 rounded-full">
          <span className="text-nexus-cyan-glow text-sm font-orbitron font-black">
            MODO ADMIN
          </span>
        </div>
      </div>
    </div>
  );
};
