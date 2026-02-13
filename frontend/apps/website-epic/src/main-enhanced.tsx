import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Enhanced Simple App with all components
const EnhancedApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
      {/* Header */}
      <header className="glass fade-in" style={{ padding: '2rem', margin: '2rem' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">AIGestion Nexus</h1>
                <p className="text-white/70">The Sovereign Intelligence Platform</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-white/70 hover:text-white transition-colors">
                Features
              </a>
              <a href="#dashboards" className="text-white/70 hover:text-white transition-colors">
                Dashboards
              </a>
              <a href="#about" className="text-white/70 hover:text-white transition-colors">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="glass fade-in" style={{ padding: '4rem', margin: '2rem' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-4 text-gradient">
              Experience the Future of
              <br />
              <span className="text-gradient">Sovereign AI</span>
            </h2>
            <p className="text-xl text-white/80 mb-6">
              Real-time voice agents, neural memory, and decentralized intelligence orchestration.
              Built for the God Mode era.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors">
                Explore Dashboards
              </button>
              <button className="border border-purple-400 hover:bg-purple-400/20 px-6 py-3 rounded-lg transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mb-8">
        <h2
          className="text-3xl font-bold text-center mb-6 fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          ⚡ God Mode Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          <div className="glass fade-in text-center" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎤</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Voice Agents</h3>
            <p className="text-white/70 text-sm">
              Real-time voice processing with neural understanding
            </p>
          </div>
          <div className="glass fade-in text-center" style={{ animationDelay: '0.4s' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Neural Memory</h3>
            <p className="text-white/70 text-sm">Persistent memory across all interactions</p>
          </div>
          <div className="glass fade-in text-center" style={{ animationDelay: '0.5s' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Decentralized</h3>
            <p className="text-white/70 text-sm">Blockchain-powered intelligence orchestration</p>
          </div>
          <div className="glass fade-in text-center" style={{ animationDelay: '0.6s' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">God Mode</h3>
            <p className="text-white/70 text-sm">Ultimate performance and capabilities</p>
          </div>
        </div>
      </section>

      {/* Dashboards Section */}
      <section id="dashboards" className="mb-8">
        <h2
          className="text-3xl font-bold text-center mb-6 fade-in"
          style={{ animationDelay: '0.7s' }}
        >
          🎮 Intelligent Dashboards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          <div className="glass fade-in game-card" style={{ animationDelay: '0.8s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
            <p className="text-white/70 mb-4">
              Cuartel General con estadísticas en tiempo real y control total del sistema.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors inline-block w-full text-center">
              Access Admin
            </button>
          </div>

          <div className="glass fade-in game-card" style={{ animationDelay: '0.9s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Client Dashboard</h3>
            <p className="text-white/70 mb-4">
              Panel de control personal con progreso, logros y métricas individuales.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors inline-block w-full text-center">
              Access Client
            </button>
          </div>

          <div className="glass fade-in game-card" style={{ animationDelay: '1.0s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎪</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Demo Dashboard</h3>
            <p className="text-white/70 mb-4">
              Parque de juegos interactivo con gamificación, mini juegos y leaderboard.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors inline-block w-full text-center">
              Access Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="glass rounded-xl p-8 mb-8 fade-in" style={{ animationDelay: '1.1s' }}>
        <h2 className="text-3xl font-bold text-center mb-6">📊 Platform Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-400">12.5K+</p>
            <p className="text-white/70">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-400">99.9%</p>
            <p className="text-white/70">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-400">1.2M</p>
            <p className="text-white/70">API Calls</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-orange-400">24/7</p>
            <p className="text-white/70">Support</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass rounded-xl p-6 fade-in" style={{ animationDelay: '1.2s' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div>
            <h3 className="text-lg font-semibold mb-3">AIGestion Nexus</h3>
            <p className="text-white/70 text-sm">
              The future of sovereign intelligence is here. Experience the power of God Mode AI.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <a href="#dashboards" className="hover:text-purple-300 transition-colors">
                  Dashboards
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-purple-300 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a
                  href="https://aig-estion-final.vercel.app"
                  className="hover:text-purple-300 transition-colors"
                >
                  Live Demo
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <span className="text-sm">📧</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <span className="text-sm">💬</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <span className="text-sm">🐦</span>
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-white/20 mt-6 pt-6 text-center text-white/70 text-sm">
          <p>&copy; 2024 AIGestion Nexus. Built with ❤️ for the God Mode era.</p>
        </div>
      </footer>
    </div>
  );
};

// Main App Entry with error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML =
    '<div style="color: white; text-align: center; padding: 20px;">❌ Root element not found</div>';
} else {
  try {
    ReactDOM.createRoot(rootElement).render(<EnhancedApp />);
    console.log('✅ Enhanced React app rendered successfully');
  } catch (error) {
    console.error('❌ Failed to render React app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: white; font-family: system-ui;">
        <h2>❌ Error Loading React App</h2>
        <p>${error.message}</p>
        <button onclick="window.location.reload()" style="
          background: #ef4444;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 10px;
        ">Recargar</button>
      </div>
    `;
  }
}
