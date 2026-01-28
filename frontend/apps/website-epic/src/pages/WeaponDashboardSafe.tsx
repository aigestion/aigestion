import React from 'react';

const WeaponDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">MODO SEGURO</h1>
      <p className="text-xl mb-8">Si ves esto, el Dashboard "God Mode" falló al cargar.</p>
      <div className="p-4 border border-white/20 rounded">
        <p>Posibles causas:</p>
        <ul className="list-disc pl-5 mt-2 text-sm text-gray-400">
            <li>Error de importación (Iconos/Librerías)</li>
            <li>Variables de entorno faltantes (Supabase)</li>
            <li>Memoria insuficiente</li>
        </ul>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="mt-8 px-6 py-3 bg-blue-600 rounded-full"
      >
        Reintentar
      </button>
    </div>
  );
};

export default WeaponDashboard;
