import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DemoDashboard } from './components/DemoDashboard'

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900"
    >
      <Routes>
        <Route path="/" element={<DemoDashboard />} />
        <Route path="/dashboard" element={<DemoDashboard />} />
        <Route path="*" element={<DemoDashboard />} />
      </Routes>
    </motion.div>
  )
}

export default App
