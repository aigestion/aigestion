import { Activity, Brain, Users, Zap } from 'lucide-react';
import { DanielaCore } from '../daniela';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { danielaApi } from '../../services/daniela-api.service';
import { useEffect, useState } from 'react';

export function AdminDashboard() {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [status, insightsData] = await Promise.all([
          danielaApi.getSystemStatus(),
          danielaApi.getInsights(),
        ]);
        setSystemStatus(status);
        setInsights(insightsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🎮 Panel Súper Fácil de Entender - Como un Videojuego de Administración
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 🌟 Header Principal - Como el Título de tu Juego Favorito */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-3 animate-pulse">
            🚀 Panel del Súper Administrador
          </h1>
          <p className="text-blue-200 text-lg">
            ¡Bienvenido al Centro de Control! Aquí manejas todo como un verdadero héroe tecnológico.
            🦸‍♂️
          </p>
        </div>

        {/* 🤖 Asistente IA Daniela - Tu Amiga Inteligente */}
        <div className="mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-purple-500/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                🧠 Daniela IA - Tu Asistente Mágica
              </CardTitle>
              <p className="text-blue-200 text-sm">
                ¡Pregúntale lo que sea! Ella sabe todo sobre el sistema. 🪄
              </p>
            </CardHeader>
            <CardContent>
              <DanielaCore
                config={{
                  variant: 'assistant',
                  context: 'admin',
                  voice: {
                    enabled: true,
                    provider: 'vapi',
                    voiceId: 'EXAVITQu4vr4xnSDxMaL',
                    autoStart: false,
                  },
                  personality: {
                    mode: 'strategic',
                    language: 'es',
                    name: 'Daniela Admin',
                  },
                  features: {
                    memory: true,
                    analytics: true,
                    multiUser: true,
                    realTime: true,
                  },
                }}
                className="min-h-[400px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* 📊 Panel de Estadísticas - Como los Puntos en tu Videojuego */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-purple-500/20 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">
                👥 Usuarios Activos
              </CardTitle>
              <Users className="h-6 w-6 text-purple-400 animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">1,234</div>
              <p className="text-xs text-purple-300">📈 +12% más que el mes pasado</p>
              <div className="mt-2 text-xs text-green-400">✨ ¡Todo va súper bien!</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-green-500/20 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">
                🟢 Estado del Sistema
              </CardTitle>
              <Activity className="h-6 w-6 text-green-400 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">🟢 Online</div>
              <p className="text-xs text-green-300">⚡ Funcionando 99.9% del tiempo</p>
              <div className="mt-2 text-xs text-green-400">🚀 Más rápido que un rayo</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-blue-500/20 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">
                🤖 Peticiones a la IA
              </CardTitle>
              <Brain className="h-6 w-6 text-blue-400 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">45.2K</div>
              <p className="text-xs text-blue-300">📅 Solo hoy</p>
              <div className="mt-2 text-xs text-blue-400">🧠 La IA está súper ocupada</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-yellow-500/20 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-200">⚡ Velocidad</CardTitle>
              <Zap className="h-6 w-6 text-yellow-400 animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">98ms</div>
              <p className="text-xs text-yellow-300">🏃‍♂️ Tiempo de respuesta</p>
              <div className="mt-2 text-xs text-yellow-400">⚡ Más rápido que Flash</div>
            </CardContent>
          </Card>
        </div>

        {/* 🧠 Insights Estratégicos de Daniela */}
        {insights.length > 0 && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  ✨ Insights Estratégicos de Daniela
                </CardTitle>
                <p className="text-blue-200 text-sm">
                  Consejos tácticos generados en tiempo real para tu negocio
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{insight.icon || '🚀'}</span>
                        <h4 className="text-white font-bold">{insight.title}</h4>
                      </div>
                      <p className="text-blue-100 text-sm mb-3">{insight.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                          {insight.category}
                        </Badge>
                        <span
                          className={`text-xs font-bold ${insight.impact === 'High' ? 'text-green-400' : 'text-blue-400'}`}
                        >
                          Impacto: {insight.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 🎮 Centro de Control - Como los Botones de un Mando */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 🕹️ Acciones Rápidas - Botones Mágicos */}
          <Card className="bg-white/10 backdrop-blur-md border-purple-500/20 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white text-lg">🎮 Botones Mágicos</CardTitle>
              <p className="text-purple-200 text-sm">
                Haz clic en los botones para hacer cosas increíbles
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-sm hover:scale-105 transition-transform">
                🧠 Configurar Daniela IA
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm hover:scale-105 transition-transform">
                👥 Gestionar Usuarios
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-sm hover:scale-105 transition-transform">
                📊 Ver Estadísticas
              </Button>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-sm hover:scale-105 transition-transform">
                🔧 Ajustes del Sistema
              </Button>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-sm hover:scale-105 transition-transform">
                🛡️ Seguridad y Protección
              </Button>
            </CardContent>
          </Card>

          {/* 📜 Libro de Hechos Recientes - Como el Historial de tu Juego */}
          <Card className="bg-white/10 backdrop-blur-md border-purple-500/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white text-lg">📜 Libro de Aventuras Recientes</CardTitle>
              <p className="text-purple-200 text-sm">Aquí ves todo lo que ha pasado últimamente</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    user: '🦸‍♂️ Super Admin',
                    action: '🧠 Actualizó el cerebro de Daniela IA',
                    time: '⏰ hace 2 min',
                    status: 'success',
                  },
                  {
                    user: '🤖 Sistema Automático',
                    action: '💾 Hizo una copia de seguridad',
                    time: '⏰ hace 15 min',
                    status: 'info',
                  },
                  {
                    user: '🧠 Daniela IA',
                    action: '📊 Procesó 1,200 peticiones',
                    time: '⏰ hace 1 hora',
                    status: 'success',
                  },
                  {
                    user: '🛡️ Guardián de Seguridad',
                    action: '🔐 Renovó el escudo SSL',
                    time: '⏰ hace 2 horas',
                    status: 'warning',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{activity.user}</p>
                      <p className="text-purple-200 text-sm">{activity.action}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          activity.status === 'success'
                            ? 'default'
                            : activity.status === 'warning'
                              ? 'secondary'
                              : 'outline'
                        }
                        className="text-xs"
                      >
                        {activity.time}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🏥 Centro de Salud del Sistema - Como el Hospital de tu Ciudad */}
        <Card className="bg-white/10 backdrop-blur-md border-purple-500/20 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">🏥 Centro de Salud del Sistema</CardTitle>
            <p className="text-purple-200 text-sm">Revisamos que todo esté perfectamente sano</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  service: '🧠 Cerebro de Daniela IA',
                  status:
                    systemStatus?.status === 'operational' ? '🟢 Súper Saludable' : '🟡 Analizando',
                  color: 'text-green-400',
                },
                {
                  service: '💾 Base de Datos',
                  status:
                    systemStatus?.status === 'operational'
                      ? '🟢 Funcionando Perfecto'
                      : '🟡 Conectando',
                  color: 'text-green-400',
                },
                {
                  service: '🌐 Puerta de Internet (API)',
                  status: '🟢 Todo Bien',
                  color: 'text-green-400',
                },
                {
                  service: '🚀 Red de Entrega (CDN)',
                  status: '🟢 A toda velocidad',
                  color: 'text-green-400',
                },
                {
                  service: '🔐 Guardián de Acceso',
                  status: '🟢 Protegiendo todo',
                  color: 'text-green-400',
                },
                {
                  service: '📡 Sistema de Vigilancia',
                  status: '🟢 Atento a todo',
                  color: 'text-green-400',
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-white text-sm">{service.service}</span>
                  <Badge className={`${service.color} text-xs`}>{service.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 🎓 Tips para el Super Admin */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md border-purple-500/20 mt-6">
          <CardContent className="p-6">
            <h3 className="text-white text-lg font-bold mb-3">💡 Tips para ser el Mejor Admin</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-purple-200">
                <span className="text-purple-400 font-bold">1.</span> Revisa las estadísticas cada
                día para ver cómo crece todo
              </div>
              <div className="text-blue-200">
                <span className="text-blue-400 font-bold">2.</span> Habla con Daniela IA si
                necesitas ayuda con algo complicado
              </div>
              <div className="text-green-200">
                <span className="text-green-400 font-bold">3.</span> Mantén todo actualizado para
                que el sistema esté siempre rápido
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
