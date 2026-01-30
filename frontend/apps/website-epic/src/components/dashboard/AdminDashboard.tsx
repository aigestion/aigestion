import { Activity, Settings, Shield, Users } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🏆 Panel Administrativo
          </h1>
          <p className="text-purple-200">
            Panel de Administración AIGestion - Centro de Control NEXUS
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">
                Usuarios Activos
              </CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1,234</div>
              <p className="text-xs text-purple-300">+12% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">
                Estado del Sistema
              </CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">Online</div>
              <p className="text-xs text-purple-300">99.9% tiempo activo</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">
                Solicitudes de IA
              </CardTitle>
              <Shield className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">45.2K</div>
              <p className="text-xs text-purple-300">Hoy</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">
                Rendimiento
              </CardTitle>
              <Settings className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">98ms</div>
              <p className="text-xs text-purple-300">Respuesta promedio</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="bg-white/10 backdrop-blur-md border-purple-500/20 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                🎭 Gestionar Daniela IA
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                👥 Gestión de Usuarios
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                📊 Panel de Análisis
              </Button>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                🔧 Configuración del Sistema
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/10 backdrop-blur-md border-purple-500/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: 'Usuario Admin', action: 'Modelo IA actualizado', time: 'hace 2 min', status: 'success' },
                  { user: 'Sistema', action: 'Respaldo completado', time: 'hace 15 min', status: 'info' },
                  { user: 'Daniela IA', action: 'Procesó 1.2K solicitudes', time: 'hace 1 hora', status: 'success' },
                  { user: 'Seguridad', action: 'Certificado SSL renovado', time: 'hace 2 horas', status: 'warning' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{activity.user}</p>
                      <p className="text-purple-200 text-sm">{activity.action}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        activity.status === 'success' ? 'default' :
                          activity.status === 'warning' ? 'secondary' : 'outline'
                      }>
                        {activity.time}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="bg-white/10 backdrop-blur-md border-purple-500/20 mt-6">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { service: 'Daniela AI Engine', status: 'Operational', color: 'text-green-400' },
                { service: 'Database', status: 'Operational', color: 'text-green-400' },
                { service: 'API Gateway', status: 'Operational', color: 'text-green-400' },
                { service: 'CDN', status: 'Operational', color: 'text-green-400' },
                { service: 'Authentication', status: 'Operational', color: 'text-green-400' },
                { service: 'Monitoring', status: 'Operational', color: 'text-green-400' },
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white">{service.service}</span>
                  <Badge className={service.color}>{service.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
