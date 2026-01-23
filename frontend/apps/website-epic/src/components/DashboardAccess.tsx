import { motion } from 'framer-motion';

const DashboardAccess = () => {
  const dashboards = [
    {
      title: "ADMIN DASHBOARD",
      subtitle: "Comando Omnipotente",
      description: "Control total del sistema, automatización avanzada y análisis predictivo",
      url: "/admin",
      color: "from-purple-600 to-pink-600",
      icon: "⚡",
      features: ["DecisionSynthesizer", "AutomationEngine", "OracleChart", "WearableBridge"]
    },
    {
      title: "CLIENT DASHBOARD", 
      subtitle: "Centro de Empresa Divino",
      description: "Panel VIP para clientes premium con inteligencia de negocio",
      url: "/client",
      color: "from-cyan-600 to-blue-600", 
      icon: "💎",
      features: ["BusinessIntelligence", "GoogleServiceHub", "IdeaSynthesizer"]
    },
    {
      title: "DEMO DASHBOARD",
      subtitle: "Dominio Inteligente", 
      description: "Showcase interactivo de capacidades del ecosistema AIG",
      url: "/demo",
      color: "from-green-600 to-emerald-600",
      icon: "🎮",
      features: ["NexusHome", "Componentes Showcase", "Live Demos"]
    }
  ];

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-black via-nexus-obsidian to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-orbitron font-black mb-8">
            ACCESO A
            <br />
            <span className="text-nexus-violet-glow text-glow uppercase">DASHBOARDS</span>
          </h2>
          <p className="text-xl text-nexus-silver/70 max-w-3xl mx-auto">
            El ecosistema completo de AIGestion. Tres paneles especializados para control total.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {dashboards.map((dashboard, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="premium-glass rounded-2xl p-8 h-full transition-all duration-500 hover:scale-[1.02] hover:border-white/20">
                <div className="text-6xl mb-6">{dashboard.icon}</div>
                
                <h3 className="text-2xl font-orbitron font-bold mb-2">
                  {dashboard.title}
                </h3>
                
                <p className="text-nexus-cyan-glow font-orbitron text-sm mb-4">
                  {dashboard.subtitle}
                </p>
                
                <p className="text-nexus-silver/70 mb-6">
                  {dashboard.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-xs font-orbitron text-nexus-silver/40 uppercase tracking-[0.3em] mb-3">
                    Características
                  </h4>
                  <div className="space-y-2">
                    {dashboard.features.map((feature, idx) => (
                      <div key={idx} className="text-[10px] font-mono text-nexus-silver/50">
                        → {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={dashboard.url}
                  className={`block w-full py-3 px-6 rounded-xl text-center font-orbitron font-bold text-sm uppercase tracking-[0.2em] transition-all duration-300 bg-gradient-to-r ${dashboard.color} hover:scale-105 active:scale-95`}
                >
                  Acceder Dashboard
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="premium-glass rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-orbitron font-bold mb-6 text-nexus-cyan-glow">
              🔌 ARDUINO INTEGRATION
            </h3>
            <p className="text-nexus-silver/70 mb-8">
              Control físico y sensores IoT conectados directamente al ecosistema AIGestion.
              Monitoreo en tiempo real y automatización del mundo real.
            </p>
            <button className="btn-enterprise">
              Ver Arduino Hub
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { DashboardAccess };