import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CinematicPresentation } from './components/CinematicPresentation';
import { ClientShowcase } from './components/ClientShowcase';
import { CommandTerminal } from './components/CommandTerminal';
import { ContactSection } from './components/ContactSection';
import { DanielaShowcase } from './components/DanielaShowcase';
import { EnhancedROI } from './components/EnhancedROI';
import { Navigation } from './components/Navigation';
import { NexusAndroid } from './components/NexusAndroid';
import { VitureXRExperience } from './components/VitureXRExperience';

const Footer = () => (
  <footer className="py-32 bg-nexus-obsidian-deep border-t border-white/5 relative overflow-hidden">
    <div className="absolute inset-0 bg-radial-at-bottom from-nexus-violet/5 via-transparent to-transparent pointer-events-none" />
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16 relative z-10">
      <div className="col-span-1 md:col-span-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img src="/images/brand/logo.png" alt="AIGestion" className="h-10 mb-8 filter brightness-110 drop-shadow-[0_0_10px_rgba(138,43,226,0.3)]" />
          <p className="text-nexus-silver/50 text-lg max-w-sm mb-12 font-light leading-relaxed italic">
            "Arquitectura de Inteligencia Soberana. <br />
            El núcleo neuronal para las empresas del mañana."
          </p>
          <div className="text-[10px] text-nexus-silver/20 font-mono uppercase tracking-[0.4em] mt-12">
            © 2026 AIGestion.net | God Level AI Restored
          </div>
        </motion.div>
      </div>
      <div>
        <h4 className="font-orbitron text-xs text-nexus-cyan-glow mb-8 uppercase tracking-[0.3em] font-bold">Ecosistema</h4>
        <ul className="space-y-6 text-[10px] text-nexus-silver/40 font-orbitron tracking-widest uppercase">
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">Casos de Uso</li>
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">Daniela AI</li>
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">Nodos Globales</li>
        </ul>
      </div>
      <div>
        <h4 className="font-orbitron text-xs text-nexus-violet-glow mb-8 uppercase tracking-[0.3em] font-bold">Metaverso</h4>
        <ul className="space-y-6 text-[10px] text-nexus-silver/40 font-orbitron tracking-widest uppercase">
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">Sedes Decentraland</li>
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300">Virtual Office</li>
          <li className="hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300 text-nexus-cyan-glow font-bold">Acceso Terminal</li>
        </ul>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-nexus-obsidian text-white overflow-x-hidden">
        <Navigation />

        <main>
          {/* Advanced Cinematic Presentation - Hero épico */}
          <AnimatePresence mode="wait">
            <CinematicPresentation />
          </AnimatePresence>

          {/* Fortune 500 Showcase - Casos de éxito */}
          <ClientShowcase />

          {/* Synthetic Consciousness - Daniela AI */}
          <DanielaShowcase />

          {/* Quantum Guardian - Nexus Android */}
          <NexusAndroid />

          {/* Strategic ROI Analysis */}
          <EnhancedROI />

          {/* Immersive Contact Experience */}
          <ContactSection />

          {/* VITURE XR Experience */}
          <VitureXRExperience />
        </main>

        {/* Footer */}
        <Footer />

        {/* Command Terminal */}
        <CommandTerminal />
      </div>
    </BrowserRouter>
  );
}

export default App;
