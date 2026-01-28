import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AppProvider } from './contexts/AppContext'
import './index.css'

// Debug mode for White Screen fix
ReactDOM.createRoot(document.getElementById('root')!).render(
  <div style={{ color: 'red', fontSize: '30px', padding: '50px', background: 'white', minHeight: '100vh' }}>
    <h1>DEBUG MODE</h1>
    <p>Si lees esto, React funciona.</p>
    <p>Timestamp: {new Date().toISOString()}</p>
  </div>
)
// Deployment trigger 01/25/2026 12:11:32
