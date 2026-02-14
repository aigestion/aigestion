
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminDashboard } from './components/AdminDashboard';
import { EcosystemProvider } from './providers/EcosystemProvider';
import QuantumCanvas from './components/QuantumCanvas';

function App() {
  return (
    <EcosystemProvider>
      <div className="relative min-h-screen bg-[#020617] text-slate-50 overflow-x-hidden">
        <QuantumCanvas />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<AdminDashboard />} />
          </Routes>
        </motion.div>
      </div>
    </EcosystemProvider>
  );
}

export default App;
