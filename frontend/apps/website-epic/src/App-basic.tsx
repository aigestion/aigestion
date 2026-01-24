
function App() {
  return (
    <div className="bg-nexus-obsidian min-h-screen text-white font-sans">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-nexus-cyan to-nexus-violet bg-clip-text text-transparent">
              AIGestion
            </h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-white/80 hover:text-white transition-colors">Inicio</a>
              <a href="#daniela" className="text-white/80 hover:text-white transition-colors">Daniela AI</a>
              <a href="#services" className="text-white/80 hover:text-white transition-colors">Servicios</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contacto</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nexus-cyan/20 to-nexus-violet/20"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-nexus-cyan to-nexus-violet bg-clip-text text-transparent">
            Daniela AI
          </h1>
          <p className="text-xl md:text-2xl text-nexus-silver mb-8 max-w-3xl mx-auto">
            Tu asistente de IA emocional con inteligencia avanzada y comprensión contextual
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all">
              Comenzar Ahora
            </button>
            <button className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Daniela AI Section */}
      <section id="daniela" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-nexus-cyan to-nexus-violet bg-clip-text text-transparent">
              Características Principales
            </h2>
            <p className="text-nexus-silver text-lg max-w-2xl mx-auto">
              Daniela AI combina tecnología de vanguardia con inteligencia emocional para ofrecer una experiencia única
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-nexus-cyan to-nexus-violet rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Inteligencia Emocional</h3>
              <p className="text-nexus-silver">
                Comprende y responde a las emociones humanas con empatía y precisión
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-nexus-cyan to-nexus-violet rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🗣️</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Conversación Natural</h3>
              <p className="text-nexus-silver">
                Interactúa por voz o texto con fluidez y naturalidad
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-nexus-cyan to-nexus-violet rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Análisis en Tiempo Real</h3>
              <p className="text-nexus-silver">
                Procesa y analiza información contextualmente para respuestas precisas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-black/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Servicios</h2>
            <p className="text-nexus-silver text-lg max-w-2xl mx-auto">
              Soluciones integrales de IA para transformar tu negocio
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4">Consultoría IA</h3>
              <p className="text-nexus-silver mb-4">
                Implementación estratégica de soluciones de IA personalizadas
              </p>
              <ul className="space-y-2 text-nexus-silver">
                <li>• Análisis de necesidades</li>
                <li>• Diseño de soluciones</li>
                <li>• Implementación personalizada</li>
                <li>• Soporte continuo</li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4">Desarrollo a Medida</h3>
              <p className="text-nexus-silver mb-4">
                Creación de aplicaciones de IA adaptadas a tus requerimientos específicos
              </p>
              <ul className="space-y-2 text-nexus-silver">
                <li>• Desarrollo personalizado</li>
                <li>• Integración con sistemas existentes</li>
                <li>• Optimización y escalabilidad</li>
                <li>• Mantenimiento y actualizaciones</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Contacto</h2>
            <p className="text-nexus-silver text-lg max-w-2xl mx-auto">
              Comienza tu transformación con Daniela AI hoy mismo
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre</label>
                  <input type="text" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-nexus-silver focus:outline-none focus:border-nexus-cyan" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-nexus-silver focus:outline-none focus:border-nexus-cyan" placeholder="tu@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mensaje</label>
                  <textarea className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-nexus-silver focus:outline-none focus:border-nexus-cyan" rows={4} placeholder="Cuéntanos sobre tu proyecto"></textarea>
                </div>
                <button type="submit" className="w-full px-8 py-4 bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-lg border-t border-white/10 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-nexus-silver">
              © 2026 AIGestion - Daniela AI. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
