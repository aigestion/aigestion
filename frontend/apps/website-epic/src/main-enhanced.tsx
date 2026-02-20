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
                <h1 className="text-4xl font-bold text-white">AIGestion</h1>
                <p className="text-white/70">Tu Asistente Inteligente de Confianza</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-white/70 hover:text-white transition-colors">
                Qué hacemos
              </a>
              <a href="#dashboards" className="text-white/70 hover:text-white transition-colors">
                Cómo te ayuda
              </a>
              <a href="#about" className="text-white/70 hover:text-white transition-colors">
                Sobre nosotros
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
              Tu Negocio en
              <br />
              <span className="text-gradient">Piloto Automático</span>
            </h2>
            <p className="text-xl text-white/80 mb-6">
              Asistentes de voz en tiempo real, memoria compartida y organización inteligente.
              Diseñado para que recuperes tu tiempo.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors">
                Probar los Paneles
              </button>
              <button className="border border-purple-400 hover:bg-purple-400/20 px-6 py-3 rounded-lg transition-colors">
                Saber Más
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
          ⚡ Funciones Útiles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          <div className="glass fade-in text-center" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎤</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Ayuda por Voz</h3>
            <p className="text-white/70 text-sm">
              Habla con Daniela y ella entenderá todo lo que necesitas
            </p>
          </div>
          <div className="glass fade-in text-center" style={{ animationDelay: '0.4s' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Agenda Inteligente</h3>
            <p className="text-white/70 text-sm">Recuerda cada detalle de tus clientes y citas</p>
          </div>
          <div className="glass fade-in text-center" style={{ animationDelay: '0.5s' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Control Total</h3>
            <p className="text-white/70 text-sm">Toda tu información unificada y siempre segura</p>
          </div>
          <div className="glass fade-in text-center" style={{ animationDelay: '0.6s' }}>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Modo Experto</h3>
            <p className="text-white/70 text-sm">Potencia máxima para los negocios más exigentes</p>
          </div>
        </div>
      </section>

      {/* Dashboards Section */}
      <section id="dashboards" className="mb-8">
        <h2
          className="text-3xl font-bold text-center mb-6 fade-in"
          style={{ animationDelay: '0.7s' }}
        >
          🎮 Paneles de Control
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          <div className="glass fade-in game-card" style={{ animationDelay: '0.8s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Administrador</h3>
            <p className="text-white/70 mb-4">Control central para dueños de negocio y gestores.</p>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors inline-block w-full text-center">
              Entrar
            </button>
          </div>

          <div className="glass fade-in game-card" style={{ animationDelay: '0.9s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Cliente</h3>
            <p className="text-white/70 mb-4">Tu espacio personal para ver tu progreso y tareas.</p>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors inline-block w-full text-center">
              Entrar
            </button>
          </div>

          <div className="glass fade-in game-card" style={{ animationDelay: '1.0s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎪</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Muestras</h3>
            <p className="text-white/70 mb-4">Mira cómo funciona todo de forma interactiva.</p>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors inline-block w-full text-center">
              Ver Muestra
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="glass rounded-xl p-8 mb-8 fade-in" style={{ animationDelay: '1.1s' }}>
        <h2 className="text-3xl font-bold text-center mb-6">📊 Cifras de la Plataforma</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-400">12.5K+</p>
            <p className="text-white/70">Usuarios Activos</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-400">99.9%</p>
            <p className="text-white/70">Tiempo Online</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-400">1.2M</p>
            <p className="text-white/70">Tareas Hechas</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-orange-400">24/7</p>
            <p className="text-white/70">Ayuda Siempre</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass rounded-xl p-6 fade-in" style={{ animationDelay: '1.2s' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div>
            <h3 className="text-lg font-semibold mb-3">AIGestion</h3>
            <p className="text-white/70 text-sm">
              El futuro de la ayuda inteligente para personas reales ya está aquí.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Enlaces Rápidos</h3>
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
                  Muestra Online
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Conectar</h3>
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
        <div className="border-t border-white/20 mt-6 pt-6 text-center text-white/70 text-sm">
          <p>&copy; 2024 AIGestion. Hecho con ❤️ para que disfrutes de tu tiempo pronto.</p>
        </div>
      </footer>
    </div>
  );
};

// Main App Entry with error handling
const rootElement = document.getElementById('root');
if (rootElement) {
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
} else {
  console.error('Root element not found!');
  document.body.innerHTML =
    '<div style="color: white; text-align: center; padding: 20px;">❌ Root element not found</div>';
}
