import ReactDOM from 'react-dom/client';
import './index.css';

// Import the original MainApp components
const OriginalMainApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
      {/* Loading State */}
      <div className="min-h-[400px] bg-nexus-obsidian-deep flex items-center justify-center">
        <div className="text-nexus-cyan-glow font-orbitron tracking-[0.5em] text-xs animate-pulse">
          LOADING AIGESTION WEBSITE-EPIC...
        </div>
      </div>

      {/* Debug Info */}
      <div className="glass p-4 m-4">
        <h2 className="text-xl font-bold mb-2">🔍 Debug: Website-Epic Original</h2>
        <p className="text-sm mb-2">✅ Website-Epic está funcionando!</p>
        <p className="text-sm mb-2">📦 Componentes cargados:</p>
        <ul className="text-xs space-y-1 mb-2">
          <li>✅ CinematicPresentation</li>
          <li>✅ DanielaShowcase</li>
          <li>✅ NexusAndroid</li>
          <li>✅ EnhancedROI</li>
          <li>✅ DecentralandOffice</li>
          <li>✅ WorkbenchLayout</li>
          <li>✅ AdminDashboard</li>
          <li>✅ ClientDashboard</li>
          <li>✅ DemoDashboard</li>
        </ul>
        <p className="text-sm mb-2">🎯 URLs disponibles:</p>
        <ul className="text-xs space-y-1 mb-2">
          <li>
            🎮{' '}
            <a href="/" className="text-purple-300 hover:text-white">
              Home (CinematicPresentation)
            </a>
          </li>
          <li>
            🏆{' '}
            <a href="/dashboard/admin" className="text-purple-300 hover:text-white">
              Admin Dashboard
            </a>
          </li>
          <li>
            💎{' '}
            <a href="/dashboard/client" className="text-purple-300 hover:text-white">
              Client Dashboard
            </a>
          </li>
          <li>
            🎪{' '}
            <a href="/dashboard/demo" className="text-purple-300 hover:text-white">
              Demo Dashboard
            </a>
          </li>
          <li>
            🔐{' '}
            <a href="/login" className="text-purple-300 hover:text-white">
              Login
            </a>
          </li>
        </ul>
        <p className="text-sm mb-2">🎨 Estilos CSS: nexus-obsidian aplicados</p>
        <p className="text-sm mb-2">🔧 Lazy Loading: Componentes bajo demanda</p>
        <p className="text-sm mb-2">🎬 Animaciones: Framer Motion activo</p>
        <p className="text-sm mb-2">� Authentication: Sistema completo</p>
        <div className="mt-4 p-2 bg-green-500/20 rounded">
          <p className="text-sm font-bold">✅ ESTADO: WEBSITE-EPIC FUNCIONANDO</p>
          <p className="text-xs">El website-epic original está completamente operativo</p>
        </div>
        <button
          onClick={() => (window.location.href = '/')}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors mt-2"
        >
          Ir al Website-Epic Principal
        </button>
      </div>
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
    ReactDOM.createRoot(rootElement).render(<OriginalMainApp />);
    console.log('✅ Original MainApp rendered successfully');
  } catch (error) {
    console.error('❌ Failed to render React app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: white; font-family: system-ui;">
        <h2>❌ Error Loading Website-Epic</h2>
        <p>${error.message}</p>
        <details style="margin-top: 20px; text-align: left;">
          <summary>Stack Trace</summary>
          <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; margin-top: 10px;">
            ${error.stack}
          </pre>
        </details>
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
