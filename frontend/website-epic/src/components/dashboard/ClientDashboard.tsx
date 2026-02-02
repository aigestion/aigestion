import { Briefcase, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { DanielaCore } from '../daniela';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export function ClientDashboard() {
  // 🌟 Panel Súper Fácil para Clientes - Como tu App Favorita
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 🎈 Header Divertido - Como el Inicio de una Aventura */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-3 animate-pulse">
            � Tu Portal Personal Mágico
          </h1>
          <p className="text-cyan-200 text-lg">
            ¡Bienvenido a tu espacio especial! Aquí controlas tus proyectos como un verdadero jefe.
            🎯
          </p>
        </div>

        {/* 🧠 Tu Amiga Daniela IA - Siempre Lista para Ayudar */}
        <div className="mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-cyan-500/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                🧠 Daniela IA - Tu Mejor Amiga Inteligente
              </CardTitle>
              <p className="text-cyan-200 text-sm">
                ¡Pregúntale lo que necesites! Ella te ayuda con todo. 💬✨
              </p>
            </CardHeader>
            <CardContent>
              <DanielaCore
                config={{
                  variant: 'assistant',
                  context: 'client',
                  voice: {
                    enabled: true,
                    provider: 'vapi',
                    voiceId: 'EXAVITQu4vr4xnSDxMaL',
                    autoStart: false,
                  },
                  personality: {
                    mode: 'friendly',
                    language: 'es',
                    name: 'Daniela',
                  },
                  features: {
                    memory: true,
                    analytics: false,
                    multiUser: false,
                    realTime: true,
                  },
                }}
                className="min-h-[400px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* 🏆 Panel de Logros - Como en los Videojuegos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-cyan-500/20 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-200">
                🎯 Proyectos Activos
              </CardTitle>
              <Briefcase className="h-6 w-6 text-cyan-400 animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">12</div>
              <p className="text-xs text-cyan-300">🚀 3 en progreso ahora</p>
              <div className="mt-2 text-xs text-green-400">⭐ ¡Vas súper bien!</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-green-500/20 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">✅ Tareas Hechas</CardTitle>
              <Users className="h-6 w-6 text-green-400 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">87</div>
              <p className="text-xs text-green-300">📅 Este mes</p>
              <div className="mt-2 text-xs text-green-400">🎉 ¡Eres un campeón!</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-yellow-500/20 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-200">
                💰 Dinero Ganado (ROI)
              </CardTitle>
              <TrendingUp className="h-6 w-6 text-yellow-400 animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">+245%</div>
              <p className="text-xs text-yellow-300">💸 Retorno de inversión</p>
              <div className="mt-2 text-xs text-yellow-400">🤑 ¡Más dinero que nunca!</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-purple-500/20 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">💬 Chats con IA</CardTitle>
              <MessageSquare className="h-6 w-6 text-purple-400 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">156</div>
              <p className="text-xs text-purple-300">🤖 Conversaciones</p>
              <div className="mt-2 text-xs text-purple-400">💜 ¡Daniela te adora!</div>
            </CardContent>
          </Card>
        </div>

        {/* 🎮 Centro de Control - Como los Botones de tu Juego Favorito */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 🕹️ Botones Mágicos - Haz Clic y Pasa Cosas Geniales */}
          <Card className="bg-white/10 backdrop-blur-md border-cyan-500/20 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white text-lg">🎮 Botones Mágicos</CardTitle>
              <p className="text-cyan-200 text-sm">
                Presiona los botones para hacer magia con tus proyectos
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-sm hover:scale-105 transition-transform">
                📝 Crear Nuevo Proyecto
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm hover:scale-105 transition-transform">
                📊 Ver Mis Reportes
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-sm hover:scale-105 transition-transform">
                💬 Hablar con Daniela
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-sm hover:scale-105 transition-transform">
                📈 Calcular Mis Ganancias
              </Button>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-sm hover:scale-105 transition-transform">
                🎯 Fijar Nuevas Metas
              </Button>
            </CardContent>
          </Card>

          {/* 🏗️ Tus Proyectos - Como Construir con Bloques Mágicos */}
          <Card className="bg-white/10 backdrop-blur-md border-cyan-500/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white text-lg">🏗️ Tus Proyectos Increíbles</CardTitle>
              <p className="text-cyan-200 text-sm">
                Mira cómo crecen tus proyectos como flores mágicas
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: '🚀 Transformación Digital Total',
                    status: '🔥 En Progreso',
                    progress: 75,
                    deadline: '15 Feb',
                    emoji: '🎯',
                  },
                  {
                    name: '⚡ Optimización Súper Rápida',
                    status: '✅ Completado',
                    progress: 100,
                    deadline: '1 Feb',
                    emoji: '🏆',
                  },
                  {
                    name: '🤖 Implementación de IA Inteligente',
                    status: '🔥 En Progreso',
                    progress: 45,
                    deadline: '28 Feb',
                    emoji: '🧠',
                  },
                  {
                    name: '🔮 Análisis Futuro Predictivo',
                    status: '📋 Planificando',
                    progress: 10,
                    deadline: '15 Mar',
                    emoji: '🔮',
                  },
                ].map((project, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium text-sm flex items-center gap-2">
                        <span className="text-lg">{project.emoji}</span>
                        {project.name}
                      </h3>
                      <Badge
                        variant={
                          project.status === '✅ Completado'
                            ? 'default'
                            : project.status === '🔥 En Progreso'
                              ? 'secondary'
                              : 'outline'
                        }
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-cyan-300">
                      <span>📊 {project.progress}% listo</span>
                      <span>📅 Fecha: {project.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🧠 Ideas Mágicas de Daniela IA - Como Consejos de un Genio */}
        <Card className="bg-white/10 backdrop-blur-md border-cyan-500/20 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">🧠 Ideas Mágicas de Daniela IA</CardTitle>
            <p className="text-cyan-200 text-sm">
              Daniela te da súper consejos para tener más éxito
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  insight: '🚀 Detecté una forma de hacer tu trabajo 2x más rápido',
                  impact: '🔥 Impacto Alto',
                  action: '👀 Revisa el proceso actual',
                  color: 'text-yellow-400',
                  bg: 'bg-yellow-500/10',
                },
                {
                  insight: '🤖 Puedes automatizar 5 tareas aburridas',
                  impact: '⚡ Impacto Medio',
                  action: '🔧 Prueba nuevas herramientas',
                  color: 'text-blue-400',
                  bg: 'bg-blue-500/10',
                },
                {
                  insight: '📈 Tu productividad está subiendo como cohete',
                  impact: '✅ Impacto Positivo',
                  action: '🎉 Sigue así',
                  color: 'text-green-400',
                  bg: 'bg-green-500/10',
                },
                {
                  insight: '👥 Tu equipo necesita un poco más de práctica',
                  impact: '📚 Impacto Bajo',
                  action: '🎓 Programa una capacitación',
                  color: 'text-purple-400',
                  bg: 'bg-purple-500/10',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${item.bg} hover:scale-105 transition-transform cursor-pointer`}
                >
                  <div className={`text-xs font-bold ${item.color} mb-2`}>{item.impact}</div>
                  <div className="text-white text-sm mb-3 font-medium">{item.insight}</div>
                  <div className="text-cyan-300 text-xs">{item.action}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 🎯 Zona de Logros - Como los Trofeos de tus Videojuegos */}
        <Card className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-md border-cyan-500/20 mt-6">
          <CardContent className="p-6">
            <h3 className="text-white text-lg font-bold mb-4">🏆 Tus Logros Increíbles</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <div className="text-cyan-200 text-sm font-medium">Velocidad</div>
                <div className="text-white text-xs">Nivel Experto</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🧠</div>
                <div className="text-cyan-200 text-sm font-medium">Inteligencia</div>
                <div className="text-white text-xs">Nivel Genio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-cyan-200 text-sm font-medium">Ganancias</div>
                <div className="text-white text-xs">Nivel Millonario</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-cyan-200 text-sm font-medium">Éxito</div>
                <div className="text-white text-xs">Nivel Leyenda</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
