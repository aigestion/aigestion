import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function DemoDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎪 Demostración Interactiva
          </h1>
          <p className="text-emerald-200">
            Experimenta las Características de AIGestion - Demos Interactivas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-emerald-500/20">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🎭 Demo de Daniela IA</h3>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Probar Daniela IA
              </Button>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-emerald-500/20">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🌌 Demo de NEXUS</h3>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Explorar NEXUS
              </Button>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-emerald-500/20">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">📊 Demo de Análisis</h3>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Ver Análisis
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
