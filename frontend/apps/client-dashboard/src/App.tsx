import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClientDashboard } from './components/ClientDashboard'

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900"
    >
      <Routes>
        <Route path="/" element={<ClientDashboard />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="*" element={<ClientDashboard />} />
      </Routes>
    </motion.div>
  )
}

export default App
