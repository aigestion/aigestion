import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

import { SovereignErrorBoundary } from './components/SovereignErrorBoundary';

// ⚡ Code Splitting: Load dashboard on demand
const ClientDashboard = lazy(() =>
  import('./components/ClientDashboard').then(m => ({ default: m.ClientDashboard }))
);

function App() {
  return (
    <SovereignErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-black"
      >
        <Suspense
          fallback={
            <div className="h-screen w-screen flex items-center justify-center bg-black">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-12 h-12 rounded-full border-2 border-emerald-500/50 border-t-emerald-500 animate-spin"
              />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<ClientDashboard />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="*" element={<ClientDashboard />} />
          </Routes>
        </Suspense>
      </motion.div>
    </SovereignErrorBoundary>
  );
}

export default App;
