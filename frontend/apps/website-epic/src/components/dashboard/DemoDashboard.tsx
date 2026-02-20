import { Play, Rocket, Star, Zap } from 'lucide-react';
import { DanielaCore } from '../daniela';
import { Badge } from '../ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export function DemoDashboard() {
  // 🎮 Panel de Demo Súper Divertido - Como un Parque de Juegos IA
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 🎪 Header del Circo Mágico - Donde la Magia Sucede */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-3 animate-pulse">
            🎪 Parque de Juegos Mágico IA
          </h1>
          <p className="text-pink-200 text-lg">
            ¡Bienvenido al lugar más divertido! Aquí juegas con la IA como si fuera un videojuego.
            🎮✨
          </p>
        </div>

        {/* 🧠 Daniela IA en el Escenario Principal - La Estrella del Show */}
        <div className="mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-pink-500/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                🌟 Daniela IA - La Super Estrella Inteligente
              </CardTitle>
              <p className="text-pink-200 text-sm">
                ¡Habla con ella! Es como tener una amiga genio que sabe todo. 💬🧠✨
              </p>
            </CardHeader>
            <CardContent>
              <DanielaCore
                config={{
                  variant: 'full',
                  context: 'demo',
                  voice: {
                    enabled: true,
                    provider: 'vapi',
                    voiceId: 'EXAVITQu4vr4xnSDxMaL',
                    autoStart: true,
                  },
                  personality: {
                    mode: 'professional',
                    language: 'es',
                    name: 'Daniela Demo',
                  },
                  features: {
                    memory: true,
                    analytics: true,
                    multiUser: false,
                    realTime: true,
                  },
                }}
                className="min-h-[500px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* 🎯 Panel de Súper Poderes - Como los Superhéroes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-pink-500/20 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-200">🗣️ Voz Mágica</CardTitle>
              <Zap className="h-6 w-6 text-yellow-400 animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">🟢 Activa</div>
              <p className="text-xs text-pink-300">✨ Habla y escucha en tiempo real</p>
              <div className="mt-2 text-xs text-yellow-400">🎤 Como un micrófono mágico</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-pink-500/20 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-200">🧠 Cerebro IA</CardTitle>
              <Star className="h-6 w-6 text-purple-400 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">GPT-4</div>
              <p className="text-xs text-pink-300">🎓 El más inteligente de todos</p>
              <div className="mt-2 text-xs text-purple-400">🏆 Como tener un Einstein en tu PC</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-pink-500/20 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-200">
                ⚡ Velocidad Flash
              </CardTitle>
              <Rocket className="h-6 w-6 text-green-400 animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">&lt;1s</div>
              <p className="text-xs text-pink-300">🏃‍♂️ Más rápido que Flash</p>
              <div className="mt-2 text-xs text-green-400">💨 Respuesta instantánea</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-pink-500/20 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-200">🌍 Mundo Global</CardTitle>
              <Play className="h-6 w-6 text-blue-400 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">5+</div>
              <p className="text-xs text-pink-300">🗺️ Habla todos los idiomas</p>
              <div className="mt-2 text-xs text-blue-400">🌐 Como un traductor universal</div>
            </CardContent>
          </Card>
        </div>

        {/* 🎮 Zona de Juegos - Diferentes Nivelitos para Divertirte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 🕹️ Misiones Divertidas - Como los Niveles de un Juego */}
          <Card className="bg-white/10 backdrop-blur-md border-pink-500/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">🕹️ Misiones Divertidas</CardTitle>
              <p className="text-pink-200 text-sm">Elige un nivel y juega con Daniela IA</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: '🌱 Nivel Fácil: Ayuda de Negocio',
                  description: 'Preguntas fáciles sobre negocios',
                  prompt: '¿Cómo gano más dinero con mi empresa?',
                  difficulty: '🟢 Fácil',
                  emoji: '🌱',
                },
                {
                  title: '⚡ Nivel Medio: Estrategia Pro',
                  description: 'Consejos para hacer crecer tu negocio',
                  prompt: 'Dame 3 ideas para digitalizar mi empresa',
                  difficulty: '🟡 Medio',
                  emoji: '⚡',
                },
                {
                  title: '🔥 Nivel Difícil: Resolver Problemas',
                  description: 'Problemas complicados con soluciones geniales',
                  prompt: 'Mi equipo no produce, ¿qué hago?',
                  difficulty: '🟠 Difícil',
                  emoji: '🔥',
                },
                {
                  title: '🏆 Nivel Experto: Futuro IA',
                  description: 'Lo más nuevo y avanzado en inteligencia artificial',
                  prompt: '¿Cómo será el mundo en 10 años con IA?',
                  difficulty: '🔴 Experto',
                  emoji: '🏆',
                },
              ].map((scenario, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium text-sm flex items-center gap-2">
                      <span className="text-lg">{scenario.emoji}</span>
                      {scenario.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {scenario.difficulty}
                    </Badge>
                  </div>
                  <p className="text-pink-200 text-sm mb-2">{scenario.description}</p>
                  <div className="text-xs text-pink-300 font-mono bg-black/20 p-2 rounded">
                    💬 Di: "{scenario.prompt}"
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 🎯 Galería de Súper Poderes - Lo que Daniela Puede Hacer */}
          <Card className="bg-white/10 backdrop-blur-md border-pink-500/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">🎯 Galería de Súper Poderes</CardTitle>
              <p className="text-pink-200 text-sm">
                Mira todas las cosas increíbles que puede hacer Daniela
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    capability: '🧠 Entiende Todo lo que Dices',
                    description: 'Como si leyera tu mente, entiende perfectamente',
                    demo: 'Habla con ella como con un amigo',
                    emoji: '🧠',
                  },
                  {
                    capability: '🔮 Adivina el Futuro',
                    description: 'Predice lo que pasará con datos mágicos',
                    demo: 'Pregúntale qué pasará en tu negocio',
                    emoji: '🔮',
                  },
                  {
                    capability: '✍️ Escribe como Poeta',
                    description: 'Crea textos bonitos y profesionales',
                    demo: 'Pídele que escriba un email o historia',
                    emoji: '✍️',
                  },
                  {
                    capability: '🎓 Resuelve Acertijos',
                    description: 'Piensa como un detective para resolver problemas',
                    demo: 'Dale un problema complicado y verás magia',
                    emoji: '🎓',
                  },
                  {
                    capability: '💬 Recuerda Todo',
                    description: 'Nunca olvida lo que hablan, como un elefante',
                    demo: 'Mantén conversaciones largas y ella recordará todo',
                    emoji: '💬',
                  },
                  {
                    capability: '🌍 Está en Todas Partes',
                    description: 'Funciona en tu compu, celular y tablet',
                    demo: 'Prueba Daniela en diferentes aparatos',
                    emoji: '🌍',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-pink-400 pl-4 hover:bg-white/5 p-2 rounded transition-colors"
                  >
                    <h4 className="text-white font-medium mb-1 flex items-center gap-2">
                      <span className="text-lg">{item.emoji}</span>
                      {item.capability}
                    </h4>
                    <p className="text-pink-200 text-sm mb-2">{item.description}</p>
                    <p className="text-pink-300 text-xs">🎮 {item.demo}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 📊 Tablero de Puntuaciones - Como en los Videojuegos */}
        <Card className="bg-white/10 backdrop-blur-md border-pink-500/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">📊 Tablero de Puntuaciones en Vivo</CardTitle>
            <p className="text-pink-200 text-sm">Mira cómo rinde Daniela IA en tiempo real</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-400 mb-2 animate-pulse">99.9%</div>
                <div className="text-pink-200 mb-1 font-medium">⏰ Tiempo Activo</div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-green-400 h-3 rounded-full animate-pulse"
                    style={{ width: '99.9%' }}
                  />
                </div>
                <div className="text-xs text-green-400 mt-1">🟢 Siempre despierta</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-400 mb-2 animate-pulse">847ms</div>
                <div className="text-pink-200 mb-1 font-medium">⚡ Velocidad de Respuesta</div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-blue-400 h-3 rounded-full animate-pulse"
                    style={{ width: '85%' }}
                  />
                </div>
                <div className="text-xs text-blue-400 mt-1">🚀 Súper rápida</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-400 mb-2 animate-pulse">12.5K</div>
                <div className="text-pink-200 mb-1 font-medium">💬 Conversaciones Hoy</div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-purple-400 h-3 rounded-full animate-pulse"
                    style={{ width: '65%' }}
                  />
                </div>
                <div className="text-xs text-purple-400 mt-1">🔥 Muy popular</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🎁 Regalo Especial - Tips para Jugar Mejor */}
        <Card className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-md border-pink-500/20 mt-6">
          <CardContent className="p-6">
            <h3 className="text-white text-lg font-bold mb-4">🎮 Tips para ser el Mejor Jugador</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-pink-200">
                <span className="text-pink-400 font-bold text-lg">🎯</span> Haz preguntas
                específicas para mejores respuestas
              </div>
              <div className="text-purple-200">
                <span className="text-purple-400 font-bold text-lg">🗣️</span> Usa la voz para una
                experiencia más divertida
              </div>
              <div className="text-blue-200">
                <span className="text-blue-400 font-bold text-lg">🎪</span> Prueba todos los niveles
                para descubrir sorpresas
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
