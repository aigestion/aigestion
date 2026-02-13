// Demo Dashboard Component
function DemoDashboard() {
  return `
    <div class="min-h-screen bg-gradient-to-br from-orange-600 to-red-800 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-8">🎪 Parque de Juegos Demo</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div class="text-3xl mb-2">🎮</div>
            <div class="text-2xl font-bold text-white">Nivel 4</div>
            <div class="text-orange-200">Nivel Actual</div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div class="text-3xl mb-2">🏆</div>
            <div class="text-2xl font-bold text-white">1,250</div>
            <div class="text-orange-200">Puntos</div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div class="text-3xl mb-2">🎯</div>
            <div class="text-2xl font-bold text-white">89%</div>
            <div class="text-orange-200">Precisión</div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div class="text-3xl mb-2">⚡</div>
            <div class="text-2xl font-bold text-white">23</div>
            <div class="text-orange-200">Racha</div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 class="text-xl font-bold text-white mb-4">🎯 Juegos Disponibles</h2>
            <div class="space-y-3">
              <div class="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer">
                <div class="flex justify-between items-center text-white">
                  <span>🚀 Speed Challenge</span>
                  <span class="text-yellow-400">⭐⭐⭐</span>
                </div>
              </div>
              <div class="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer">
                <div class="flex justify-between items-center text-white">
                  <span>🧩 Puzzle Master</span>
                  <span class="text-green-400">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div class="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer">
                <div class="flex justify-between items-center text-white">
                  <span>🎯 Target Practice</span>
                  <span class="text-blue-400">⭐⭐⭐⭐</span>
                </div>
              </div>
              <div class="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer">
                <div class="flex justify-between items-center text-white">
                  <span>⚡ Lightning Round</span>
                  <span class="text-red-400">⭐⭐</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 class="text-xl font-bold text-white mb-4">🏆 Ranking Global</h2>
            <div class="space-y-2">
              <div class="flex justify-between items-center text-white p-2 bg-yellow-500/20 rounded-lg">
                <span>🥇 ProPlayer123</span>
                <span class="text-yellow-400">2,450 pts</span>
              </div>
              <div class="flex justify-between items-center text-white p-2 bg-gray-500/20 rounded-lg">
                <span>🥈 GamerGirl</span>
                <span class="text-gray-300">2,100 pts</span>
              </div>
              <div class="flex justify-between items-center text-white p-2 bg-orange-500/20 rounded-lg">
                <span>🥉 SpeedDemon</span>
                <span class="text-orange-400">1,850 pts</span>
              </div>
              <div class="flex justify-between items-center text-white p-2 bg-blue-500/20 rounded-lg">
                <span>4️⃣ Tú</span>
                <span class="text-blue-400">1,250 pts</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 class="text-xl font-bold text-white mb-4">💎 Power-Ups Disponibles</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg transition-colors">
              ⚡ Speed Boost
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors">
              🎯 Precision+
            </button>
            <button class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg transition-colors">
              🛡️ Shield
            </button>
            <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors">
              🌟 Multiplier
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('demo-root');
  if (root) {
    root.innerHTML = DemoDashboard();
  }
});
