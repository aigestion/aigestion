// Client Dashboard Component
function ClientDashboard() {
  return `
    <div class="min-h-screen bg-gradient-to-br from-emerald-600 to-cyan-800 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-8">💎 Base Personal Clientes</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div class="text-3xl mb-2">🎯</div>
            <div class="text-2xl font-bold text-white">89%</div>
            <div class="text-emerald-200">Progreso Total</div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div class="text-3xl mb-2">🏆</div>
            <div class="text-2xl font-bold text-white">12</div>
            <div class="text-emerald-200">Logros</div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div class="text-3xl mb-2">⭐</div>
            <div class="text-2xl font-bold text-white">4.8</div>
            <div class="text-emerald-200">Satisfacción</div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div class="text-3xl mb-2">🚀</div>
            <div class="text-2xl font-bold text-white">23</div>
            <div class="text-emerald-200">Proyectos</div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 class="text-xl font-bold text-white mb-4">📈 Progreso de Proyectos</h2>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-white mb-1">
                  <span>Website Redesign</span>
                  <span class="text-green-400">95%</span>
                </div>
                <div class="w-full bg-white/20 rounded-full h-2">
                  <div class="bg-green-400 h-2 rounded-full" style="width: 95%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-white mb-1">
                  <span>Mobile App</span>
                  <span class="text-yellow-400">75%</span>
                </div>
                <div class="w-full bg-white/20 rounded-full h-2">
                  <div class="bg-yellow-400 h-2 rounded-full" style="width: 75%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-white mb-1">
                  <span>API Integration</span>
                  <span class="text-blue-400">60%</span>
                </div>
                <div class="w-full bg-white/20 rounded-full h-2">
                  <div class="bg-blue-400 h-2 rounded-full" style="width: 60%"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 class="text-xl font-bold text-white mb-4">🎮 Logros Desbloqueados</h2>
            <div class="grid grid-cols-3 gap-3">
              <div class="text-center">
                <div class="text-2xl mb-1">🏅</div>
                <div class="text-xs text-emerald-200">Primer Proyecto</div>
              </div>
              <div class="text-center">
                <div class="text-2xl mb-1">🌟</div>
                <div class="text-xs text-emerald-200">5 Estrellas</div>
              </div>
              <div class="text-center">
                <div class="text-2xl mb-1">🚀</div>
                <div class="text-xs text-emerald-200">Entrega Rápida</div>
              </div>
              <div class="text-center">
                <div class="text-2xl mb-1">💎</div>
                <div class="text-xs text-emerald-200">Premium</div>
              </div>
              <div class="text-center">
                <div class="text-2xl mb-1">🎯</div>
                <div class="text-xs text-emerald-200">Perfect Score</div>
              </div>
              <div class="text-center">
                <div class="text-2xl mb-1">⚡</div>
                <div class="text-xs text-emerald-200">Veloz</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('client-root');
  if (root) {
    root.innerHTML = ClientDashboard();
  }
});
