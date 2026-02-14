import { motion, useInView } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useSound } from '../hooks/useSound';

interface DataPoint {
  label: string;
  value: number;
  color: string;
  icon: string;
  trend: 'up' | 'down' | 'stable';
}

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / (duration * 1000), 1);

      countRef.current = Math.floor(progress * value);
      setCount(countRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className="font-mono font-bold">
      {prefix}
      {count.toLocaleString('es-ES')}
      {suffix}
    </span>
  );
};

interface CircularProgressProps {
  value: number;
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size,
  strokeWidth,
  color,
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        strokeLinecap="round"
      />
    </svg>
  );
};

export const DataVisualization: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState(0);
  const { playHover } = useSound();
  const ref = useRef(null);
  const isInView = useInView(ref);

  const metrics: DataPoint[] = [
    {
      label: 'Procesamiento Neuronal',
      value: 98.7,
      color: 'text-nexus-cyan-glow',
      icon: '🧠',
      trend: 'up',
    },
    {
      label: 'Automatización Tareas',
      value: 94.2,
      color: 'text-nexus-violet-glow',
      icon: '⚡',
      trend: 'up',
    },
    {
      label: 'Precisión Decisiones',
      value: 99.1,
      color: 'text-nexus-gold',
      icon: '🎯',
      trend: 'stable',
    },
    {
      label: 'Reducción Costos',
      value: 87.3,
      color: 'text-green-400',
      icon: '💰',
      trend: 'up',
    },
    {
      label: 'Satisfacción Cliente',
      value: 96.8,
      color: 'text-pink-400',
      icon: '😊',
      trend: 'up',
    },
  ];

  const realTimeData = [
    { time: '00:00', requests: 1234, response: 0.12 },
    { time: '04:00', requests: 892, response: 0.08 },
    { time: '08:00', requests: 3456, response: 0.15 },
    { time: '12:00', requests: 5678, response: 0.22 },
    { time: '16:00', requests: 4321, response: 0.18 },
    { time: '20:00', requests: 2345, response: 0.14 },
    { time: '23:59', requests: 1567, response: 0.11 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric(prev => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="py-20 px-6 bg-nexus-obsidian-deep relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black font-orbitron mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-nexus-cyan-glow to-nexus-violet-glow">
              MÉTRICAS EN TIEMPO REAL
            </span>
          </h2>
          <p className="text-xl text-nexus-silver/80 max-w-3xl mx-auto">
            Monitoreo continuo del rendimiento del sistema con análisis predictivo avanzado
          </p>
        </motion.div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onMouseEnter={playHover}
              className={`premium-glass p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeMetric === index
                  ? 'border-nexus-cyan/50 shadow-[0_0_30px_rgba(0,245,255,0.3)]'
                  : 'border-white/10'
              }`}
              onClick={() => setActiveMetric(index)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{metric.icon}</span>
                <div className="flex items-center gap-2">
                  {metric.trend === 'up' && <span className="text-green-400 text-sm">↑</span>}
                  {metric.trend === 'down' && <span className="text-red-400 text-sm">↓</span>}
                  {metric.trend === 'stable' && <span className="text-yellow-400 text-sm">→</span>}
                </div>
              </div>

              <h3 className={`text-sm font-orbitron tracking-wider mb-2 ${metric.color}`}>
                {metric.label}
              </h3>

              <div className="flex items-end gap-2 mb-4">
                <span className={`text-3xl font-black ${metric.color}`}>
                  {isInView && <AnimatedCounter value={metric.value} suffix="%" />}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-nexus-cyan to-nexus-violet rounded-full"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${metric.value}%` } : {}}
                  transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Real-time Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="premium-glass p-8 rounded-3xl border border-white/10 mb-16"
        >
          <h3 className="text-2xl font-bold font-orbitron mb-8 text-nexus-cyan-glow">
            RENDIMIENTO DEL SISTEMA - ÚLTIMAS 24 HORAS
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Requests Chart */}
            <div>
              <h4 className="text-sm font-orbitron tracking-wider text-nexus-silver/60 mb-4">
                Solicitudes Procesadas
              </h4>
              <div className="relative h-48">
                {/* Simple Bar Chart */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-full gap-2">
                  {realTimeData.map((data, index) => (
                    <motion.div
                      key={data.time}
                      className="flex-1 bg-gradient-to-t from-nexus-cyan to-nexus-violet rounded-t-lg relative group cursor-pointer"
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${(data.requests / 6000) * 100}%` } : {}}
                      transition={{ duration: 0.8, delay: 0.8 + index * 0.05 }}
                      onMouseEnter={playHover}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.requests.toLocaleString('es-ES')}
                      </div>
                    </motion.div>
                  ))}
                </div>
                {/* Time labels */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-nexus-silver/40 font-mono">
                  {realTimeData.map(data => (
                    <span key={data.time} className="hidden sm:block">
                      {data.time}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Response Time Chart */}
            <div>
              <h4 className="text-sm font-orbitron tracking-wider text-nexus-silver/60 mb-4">
                Tiempo de Respuesta (ms)
              </h4>
              <div className="relative h-48">
                {/* Line Chart Simulation */}
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <motion.path
                    d={`M ${realTimeData
                      .map(
                        (data, index) =>
                          `${(index / (realTimeData.length - 1)) * 400},${200 - data.response * 500}`
                      )
                      .join(' L ')}`}
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 2, delay: 1 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8A2BE2" />
                      <stop offset="100%" stopColor="#00F5FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'CPU', value: 67, color: 'from-nexus-cyan to-blue-500' },
            { label: 'Memory', value: 82, color: 'from-nexus-violet to-purple-500' },
            { label: 'Storage', value: 45, color: 'from-nexus-gold to-yellow-500' },
            { label: 'Network', value: 91, color: 'from-green-400 to-emerald-500' },
          ].map((system, index) => (
            <div
              key={system.label}
              className="premium-glass p-6 rounded-2xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-orbitron tracking-wider text-nexus-silver/60">
                  {system.label}
                </h4>
                <div className="relative w-16 h-16">
                  <CircularProgress
                    value={system.value}
                    size={64}
                    strokeWidth={4}
                    color={`url(#gradient-${index})`}
                  />
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop
                        offset="0%"
                        stopColor={system.color.split(' ')[0].replace('from-', '')}
                      />
                      <stop
                        offset="100%"
                        stopColor={system.color.split(' ')[1].replace('to-', '')}
                      />
                    </linearGradient>
                  </defs>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {isInView && <AnimatedCounter value={system.value} suffix="%" />}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className={`h-full bg-gradient-to-r ${system.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${system.value}%` } : {}}
                  transition={{ duration: 1.5, delay: 1 + index * 0.1 }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
