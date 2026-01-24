import type { Session } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { CommandTerminal } from './components/CommandTerminal';
import { VitureXRExperience } from './components/VitureXRExperience';
import Login from './pages/Login';
import WeaponDashboard from './pages/WeaponDashboard';
import { supabase } from './services/supabase';

// God Mode Components
import { CinematicPresentation } from './components/CinematicPresentation';
import { ClientShowcase } from './components/ClientShowcase';
import { ContactSection } from './components/ContactSection';
import { DanielaShowcase } from './components/DanielaShowcase';
import { EnhancedROI } from './components/EnhancedROI';
import { Navigation } from './components/Navigation';
import { NexusAndroid } from './components/NexusAndroid';

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
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const handleRedirection = (user: { email?: string; user_metadata?: { role?: string } }) => {
    if (!user.email) return;

    const role = user.user_metadata?.role || 'client'
    const adminEmails = ['admin@aigestion.net', 'nemisanalex@gmail.com']

    // Redirect logic
    if (adminEmails.includes(user.email) || role === 'admin') {
      window.location.href = 'https://admin.aigestion.net'
    } else if (role === 'demo') {
      window.location.href = 'https://demo.aigestion.net'
    } else {
      window.location.href = 'https://client.aigestion.net'
    }
  }

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase no configurado; se omiten redirecciones automáticas')
      setTimeout(() => setLoading(false), 0)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session)
      if (session && window.location.pathname === '/login') {
        handleRedirection(session.user)
      }
      setLoading(false)
    }).catch(err => {
      console.error('Supabase Session Error:', err)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session)
      if (session && window.location.pathname === '/login') {
        handleRedirection(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-nexus-obsidian-deep flex flex-col items-center justify-center text-nexus-cyan-glow font-orbitron tracking-[0.5em] text-xs">
        <div className="w-12 h-px bg-nexus-cyan-glow mb-4 animate-[pulse_1s_infinite]" />
        INITIALIZING CORE...
      </div>
    );
  }

  return (
    <Router>
      <div className="bg-nexus-obsidian min-h-screen text-white font-sans selection:bg-nexus-violet selection:text-white relative">
        <Navigation />
        <Routes>
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={
            <main>
              {/* Advanced Presentation - Ahora es la primera sección */}
              <AnimatePresence mode="wait">
                <CinematicPresentation />
              </AnimatePresence>

              {/* Fortune 500 Showcase */}
              <ClientShowcase />

              {/* synthetic Consciousness - Daniela AI */}
              <DanielaShowcase />

              {/* Quantum Guardian - Nexus Android */}
              <NexusAndroid />

              {/* Strategic ROI analysis */}
              <EnhancedROI />

              {/* Immersive Contact Experience */}
              <ContactSection />

              {/* VITURE XR Experience */}
              <VitureXRExperience />
            </main>
          } />

          <Route path="/lab" element={
            <div className="pt-32 pb-20 px-6">
              <h1 className="text-4xl font-orbitron text-white text-center">Lab Section</h1>
            </div>
          } />

          <Route path="/weapon" element={<WeaponDashboard />} />
        </Routes>

        <Footer />
        <CommandTerminal />
      </div>
    </Router>
  );
}

export default App;
