import { Wifi, Cpu, Bell, CheckCircle2, GitBranch, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const StatusBar = () => {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors group">
          <GitBranch size={12} className="text-cyan-400 group-hover:drop-shadow-[0_0_5px_cyan]" />
          <span className="font-semibold text-gray-300 group-hover:text-white">main</span>
        </div>

        <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
          <CheckCircle2 size={12} className="text-gray-400" />
          <span className="text-gray-400 text-[10px]">Todo Perfecto</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
          <span className="text-gray-500">Ln 14, Col 32</span>
          <span className="text-gray-500">UTF-8</span>
          <span className="text-cyan-600 font-bold text-[10px]">TSX</span>
        </div>

        <div className="flex items-center gap-1.5 hover:bg-purple-500/10 px-2 py-0.5 rounded cursor-pointer transition-colors group">
          <Activity size={12} className="text-purple-400 animate-pulse" />
          <div className="w-12 h-4 relative overflow-hidden hidden md:block">
            <motion.svg
              viewBox="0 0 100 20"
              className="absolute inset-0 w-full h-full text-purple-400/30"
            >
              <motion.path
                d="M 0,10 L 20,10 L 25,2 L 30,18 L 35,10 L 100,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                animate={{ x: [0, -100] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.path
                d="M 100,10 L 120,10 L 125,2 L 130,18 L 135,10 L 200,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                animate={{ x: [0, -100] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.svg>
          </div>
          <span className="text-purple-300 group-hover:text-purple-200 transition-colors">
            Cerebro: Muy bien
          </span>
        </div>

        <div className="flex items-center gap-1.5 hover:bg-green-500/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
          <Wifi size={12} className="text-green-400" />
          <span className="text-green-300">Conectado</span>
        </div>

        <Bell size={12} className="text-gray-400 hover:text-white cursor-pointer" />
      </div>
    </>
  );
};
