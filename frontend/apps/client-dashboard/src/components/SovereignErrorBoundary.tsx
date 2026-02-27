import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SovereignErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[SovereignError] Critical failure detected:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-black flex items-center justify-center p-6 text-center">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-lg p-10 rounded-[3rem] border-red-500/20 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/5 blur-[80px]" />

            <div className="mb-8 relative flex justify-center">
              <div className="p-6 bg-red-500/20 rounded-full border border-red-500/40 relative">
                <ShieldAlert className="w-12 h-12 text-red-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full border-2 border-red-500/30"
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent mb-4 tracking-tighter">
              Fractura en el Nexus
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
              Se ha detectado una inestabilidad crítica en la red neural. El sistema ha activado los
              protocolos de contención.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/40 active:scale-95"
              >
                <RefreshCcw className="w-4 h-4" />
                Reiniciar Núcleo
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Home className="w-4 h-4" />
                Volver a la Base
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.3em]">
                Error Code: SOVEREIGN_FRACTURE_0x99
              </span>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
