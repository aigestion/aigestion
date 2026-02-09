// Admin Dashboard Component
function AdminDashboard() {
  return `
    <div class="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-8">🏆 Cuartel General Admin</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div class="text-3xl mb-2">👥</div>
            <div class="text-2xl font-bold text-white">1,234</div>
            <div class="text-purple-200">Usuarios Activos</div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div class="text-3xl mb-2">💰</div>
            <div class="text-2xl font-bold text-white">€45.6K</div>
            <div class="text-purple-200">Ingresos Hoy</div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div class="text-3xl mb-2">📈</div>
            <div class="text-2xl font-bold text-white">+23%</div>
            <div class="text-purple-200">Crecimiento</div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div class="text-3xl mb-2">⚡</div>
            <div class="text-2xl font-bold text-white">99.9%</div>
            <div class="text-purple-200">Uptime</div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 class="text-xl font-bold text-white mb-4">📊 Actividad del Sistema</h2>
            <div class="space-y-3">
              <div class="flex justify-between text-white">
                <span>CPU Usage</span>
                <span class="text-green-400">23%</span>
              </div>
              <div class="flex justify-between text-white">
                <span>Memory</span>
                <span class="text-yellow-400">67%</span>
              </div>
              <div class="flex justify-between text-white">
                <span>Storage</span>
                <span class="text-blue-400">45%</span>
              </div>
            </div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 class="text-xl font-bold text-white mb-4">🔐 Panel de Control</h2>
            <div class="grid grid-cols-2 gap-3">
              <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                Base de Datos
              </button>
              <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                Seguridad
              </button>
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Rendimiento
              </button>
              <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('admin-root')
  if (root) {
    root.innerHTML = AdminDashboard()
  }
})
