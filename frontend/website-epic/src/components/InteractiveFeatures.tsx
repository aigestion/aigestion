import { useSound } from '../hooks/useSound';
import { motion } from 'framer-motion';

export const InteractiveFeatures: React.FC = () => {
  const { playHover } = useSound();

  const features = [
    {
      id: 'ai-automation',
      title: 'AUTOMATIZACIÓN INTELIGENTE',
      subtitle: 'Procesos autónomos con IA avanzada',
      description: 'Sistemas que aprenden, se adaptan y evolucionan solos. Desde la toma de decisiones hasta la ejecución automática de tareas complejas.',
      icon: '🤖',
      color: 'from-nexus-violet to-purple-600',
      stats: [
        { label: 'Eficiencia', value: '+347%' },
        { label: 'Reducción Costos', value: '-68%' },
        { label: 'Velocidad', value: '10x' }
      ],
      demo: {
        title: 'Demo en Vivo',
        description: 'Observa cómo nuestra IA procesa 1M de datos en segundos'
      }
    },
    {
      id: 'quantum-computing',
      title: 'COMPUTACIÓN CUÁNTICA',
      subtitle: 'Procesamiento a velocidad lumínica',
      description: 'Algoritmos cuánticos que resuelven problemas imposibles para la computación tradicional. Optimización perfecta en tiempo real.',
      icon: '⚛️',
      color: 'from-nexus-cyan to-blue-600',
      stats: [
        { label: 'Velocidad', value: '1000x' },
        { label: 'Precisión', value: '99.97%' },
        { label: 'Escalabilidad', value: '∞' }
      ],
      demo: {
        title: 'Simulación Cuántica',
        description: 'Experimenta el poder de la superposición cuántica'
      }
    },
    {
      id: 'neural-interface',
      title: 'INTERFAZ NEURAL',
      subtitle: 'Conexión directo cerebro-máquina',
      description: 'Control de sistemas con el pensamiento. Interfaces que traducen señales neuronales en acciones digitales precisas.',
      icon: '🧠',
      color: 'from-green-400 to-emerald-600',
      stats: [
        { label: 'Latencia', value: '0.1ms' },
        { label: 'Precisión', value: '99.9%' },
        { label: 'Compatibilidad', value: '100%' }
      ],
      demo: {
        title: 'Control Neural',
        description: 'Maneja sistemas con tu mente'
      }
    },
    {
      id: 'metaverse-integration',
      title: 'METAVERSO EMPRESARIAL',
      subtitle: 'Oficinas virtuales inmersivas',
      description: 'Espacios de trabajo 3D donde la distancia física desaparece. Colaboración global como si estuvieras en la misma sala.',
      icon: '🌐',
      color: 'from-orange-400 to-red-600',
      stats: [
        { label: 'Productividad', value: '+89%' },
        { label: 'Colaboración', value: '+156%' },
        { label: 'Innovación', value: '+234%' }
      ],
      demo: {
        title: 'Tour Virtual',
        description: 'Explora nuestras oficinas virtuales'
      }
    }
  ];


  return (
    <section
      id="features"
      className="relative py-32 bg-gradient-to-b from-black via-gray-900/20 to-black overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(138,43,226,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(0,245,255,0.1),transparent_60%)]" />

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-nexus-cyan/20"
              style={{
                left: `${(i % 5) * 25}%`,
                top: `${Math.floor(i / 5) * 25}%`,
                width: '25%',
                height: '25%',
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <ShowcaseGrid
          title="CARACTERÍSTICAS REVOLUCIONARIAS"
          subtitle="Tecnología que redefine lo posible. Soluciones que transforman el futuro."
          items={features}
        />
      </div>
    </section>
  );
};
