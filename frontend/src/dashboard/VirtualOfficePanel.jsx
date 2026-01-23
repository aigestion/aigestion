import React from 'react';

/**
 * Panel de Oficina Virtual en Decentraland (Parcela).
 * Permite a los clientes visitar nuestra sede en el metaverso.
 */
export const VirtualOfficePanel = () => {
  // Coordenadas de la parcela en Decentraland
  // Posición recuperada: -51,114 (Sede Central AIG)
  const decentralizedUrl = "https://play.decentraland.org/?position=-51,114";

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <img src="/brand/favicon_icon.png" alt="AIG" className="w-10 h-10" />
            Oficina Virtual AIGestion
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            Vive la experiencia AIGestion 360 en el metaverso de Decentraland.
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800">
          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 tracking-widest uppercase">
            META-PARCELA ACTIVADA
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <div className="relative group rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-lg h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1614728263952-84ea206f25ab?auto=format&fit=crop&q=80&w=800"
            alt="Decentraland Office Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-6 left-6 z-20">
            <h3 className="text-white text-xl font-bold">Nuestra Parcela en Decentraland</h3>
            <p className="text-white/70 text-sm mt-1">
              Sede corporativa virtual para reuniones y eventos.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-sm mb-1">📍 Localización Directa</h4>
              <p className="text-xs text-gray-400">
                Accede directamente a nuestra oficina mediante las coordenadas de red.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-sm mb-1">🤝 Reuniones en el Metaverso</h4>
              <p className="text-xs text-gray-400">
                Atención al cliente virtual y salas de conferencias privadas.
              </p>
            </div>
          </div>

          <a
            href={decentralizedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black py-5 rounded-2xl text-center shadow-xl shadow-red-900/20 transition-all transform hover:-translate-y-1 block"
          >
            VIAJAR A LA OFICINA VIRTUAL 🚀
          </a>

          <p className="text-[10px] text-center text-gray-400 italic">
            * Requiere navegador compatible con WebGL o cliente de Decentraland.
          </p>
        </div>
      </div>
    </div>
  );
};
