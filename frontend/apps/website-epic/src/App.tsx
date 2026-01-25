import type { Session } from '@supabase/supabase-js';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { CommandTerminal } from './components/CommandTerminal';
import { Dashboard } from './components/Dashboard';
import { VitureXRExperience } from './components/VitureXRExperience';
import { Login } from './pages/Login';
import WeaponDashboard from './pages/WeaponDashboard';
import { supabase } from './services/supabase';

// God Mode Components
import { CinematicPresentation } from './components/CinematicPresentation';
import { ClientShowcase } from './components/ClientShowcase';
import { CommandPalette } from './components/CommandPalette';
import { ContactSection } from './components/ContactSection';
import { DanielaOmniWidget } from './components/DanielaOmniWidget';
import { DanielaShowcase } from './components/DanielaShowcase';
import { DecentralandOffice } from './components/DecentralandOffice';
import { EnhancedROI } from './components/EnhancedROI';
import { Navigation } from './components/Navigation';
import { NexusAndroid } from './components/NexusAndroid';
import { DanielaDemo } from './pages/DanielaDemo';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      const user = data.user
      const role = user.user_metadata?.role || 'client'

      // Check if admin
      const adminEmails = ['admin@aigestion.net', 'nemisanalex@gmail.com']
      if (adminEmails.includes(user.email!) || role === 'admin') {
        window.location.href = 'https://admin.aigestion.net'
        return
      }

      setSession(data.session)
      setCurrentUser({
        email: user.email!,
        name: user.user_metadata?.name || user.email!.split('@')[0],
        subscription: user.user_metadata?.subscription || 'free'
      })
      setIsAuthenticated(true)

    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase no configurado; usando modo demo')
      setTimeout(() => setLoading(false), 0)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session)
      if (session) {
        const user = session.user
        const role = user.user_metadata?.role || 'client'

        // Check if admin
        const adminEmails = ['admin@aigestion.net', 'nemisanalex@gmail.com']
        if (adminEmails.includes(user.email!) || role === 'admin') {
          window.location.href = 'https://admin.aigestion.net'
          return
        }

        setCurrentUser({
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          subscription: user.user_metadata?.subscription || 'free'
        })
        setIsAuthenticated(true)
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
      if (session) {
        const user = session.user
        const role = user.user_metadata?.role || 'client'

        // Check if admin
        const adminEmails = ['admin@aigestion.net', 'nemisanalex@gmail.com']
        if (adminEmails.includes(user.email!) || role === 'admin') {
          window.location.href = 'https://admin.aigestion.net'
          return
        }

        setCurrentUser({
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          subscription: user.user_metadata?.subscription || 'free'
        })
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        setCurrentUser(null)
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
        {!isAuthenticated ? <Navigation /> : null}
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/" element={
            !isAuthenticated ? (
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

                {/* Decentraland Headquarters */}
                <DecentralandOffice />

                {/* Immersive Contact Experience */}
                <ContactSection />

                {/* VITURE XR Experience */}
                <VitureXRExperience />
              </main>
            ) : (
              <Navigate to="/dashboard" />
            )
          } />

          <Route path="/lab" element={
            <div className="pt-32 pb-20 px-6">
              <h1 className="text-4xl font-orbitron text-white text-center">Lab Section</h1>
            </div>
          } />

          <Route path="/weapon" element={<WeaponDashboard />} />

          {/* Dashboard Routes */}
          <Route path="/admin" element={<div className="min-h-screen bg-nexus-obsidian flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-orbitron text-nexus-violet-glow mb-4">Admin Dashboard</h1>
              <p className="text-nexus-silver/60 mb-8">Panel de administración avanzada</p>
              <a href="https://admin.aigestion.net" className="btn-enterprise px-8 py-3 rounded-full">
                Acceder al Admin Dashboard
              </a>
            </div>
          </div>} />

          <Route path="/client" element={<div className="min-h-screen bg-nexus-obsidian flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-orbitron text-nexus-cyan-glow mb-4">Client Dashboard</h1>
              <p className="text-nexus-silver/60 mb-8">Portal exclusivo para clientes</p>
              <a href="https://client.aigestion.net" className="btn-enterprise px-8 py-3 rounded-full">
                Acceder al Client Dashboard
              </a>
            </div>
          </div>} />

          <Route path="/demo" element={<div className="min-h-screen bg-nexus-obsidian flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-orbitron text-nexus-gold mb-4">Demo Dashboard</h1>
              <p className="text-nexus-silver/60 mb-8">Experiencia interactiva de demostración</p>
              <a href="https://demo.aigestion.net" className="btn-enterprise px-8 py-3 rounded-full">
                Acceder al Demo Dashboard
              </a>
            </div>
          </div>} />

          {/* Daniela AI Routes */}
          <Route path="/daniela" element={<DanielaDemo />} />
          <Route path="/daniela/demo" element={<DanielaDemo />} />

          {/* Virtual Office Route */}
          <Route path="/virtual-office" element={<DecentralandOffice />} />
        </Routes>

        <Footer />
        <CommandTerminal />
        <CommandPalette />
        <DanielaOmniWidget />
      </div>
    </Router>
  );
}

export default App;
