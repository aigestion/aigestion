import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Star,
  Zap,
  Target,
  Gamepad2,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Briefcase,
  CheckCircle,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { api, SystemHealth } from '../services/api';

const DemoDashboard = () => {
  const [health, setHealth] = React.useState<SystemHealth | null>(null);
  const [connectionStatus, setConnectionStatus] = React.useState<
    'checking' | 'connected' | 'error'
  >('checking');

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const data = await api.getSystemHealth();
        setHealth(data);
        setConnectionStatus('connected');
      } catch (error) {
        setConnectionStatus('error');
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);

  const levels = [
    {
      id: 1,
      name: '🎮 Nivel 1: Exploración Básica',
      description: 'Descubre las funciones principales',
      unlocked: true,
    },
    {
      id: 2,
      name: '🚀 Nivel 2: Velocidad y Rendimiento',
      description: 'Optimiza tu experiencia',
      unlocked: true,
    },
    {
      id: 3,
      name: '🎯 Nivel 3: Precisión y Control',
      description: 'Domina las herramientas avanzadas',
      unlocked: false,
    },
    {
      id: 4,
      name: '⭐ Nivel 4: Experto Maestro',
      description: 'Conviértete en un profesional',
      unlocked: false,
    },
  ];

  const games = [
    {
      id: 1,
      name: '🧠 Memory IA',
      description: 'Memoriza patrones de IA',
      difficulty: 'Fácil',
      players: '1,234',
    },
    {
      id: 2,
      name: '⚡ Speed Code',
      description: 'Programación rápida',
      difficulty: 'Medio',
      players: '892',
    },
    {
      id: 3,
      name: '🎯 Target Practice',
      description: 'Práctica de precisión',
      difficulty: 'Difícil',
      players: '567',
    },
    {
      id: 4,
      name: '🏆 Championship',
      description: 'Torneo semanal',
      difficulty: 'Extremo',
      players: '234',
    },
  ];

  const achievements = [
    {
      id: 1,
      title: '🌟 Primer Juego',
      description: 'Juega tu primera partida',
      progress: 100,
      unlocked: true,
    },
    {
      id: 2,
      title: '🚀 Velocista',
      description: 'Completa en menos de 1 minuto',
      progress: 75,
      unlocked: false,
    },
    {
      id: 3,
      title: '🎯 Precisión',
      description: '100% de aciertos',
      progress: 45,
      unlocked: false,
    },
    {
      id: 4,
      title: '🏆 Campeón',
      description: 'Gana 10 partidas seguidas',
      progress: 20,
      unlocked: false,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-4xl font-bold text-white">🎪 Parque de Juegos Demo</h1>
        <div className="flex items-center space-x-4">
          <div className="text-white">
            <span className="text-sm">Puntuación: </span>
            <span className="text-2xl font-bold text-yellow-400">{score}</span>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </motion.div>

      {/* System Status Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 mb-4"
      >
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
            connectionStatus === 'connected'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : connectionStatus === 'error'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
          }`}
        >
          {connectionStatus === 'connected' ? (
            <>
              <Activity className="w-3 h-3" />
              <span>System Online</span>
            </>
          ) : connectionStatus === 'error' ? (
            <>
              <AlertCircle className="w-3 h-3" />
              <span>System Offline</span>
            </>
          ) : (
            <>
              <Activity className="w-3 h-3 animate-pulse" />
              <span>Connecting...</span>
            </>
          )}
        </div>
        {health?.data?.version && (
          <span className="text-xs text-white/30">v{health.data.version}</span>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-orange-400" />
            Niveles de Dificultad
          </h2>
          <div className="space-y-3">
            {levels.map((level, index) => (
              <motion.div
                key={level.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => level.unlocked && setCurrentLevel(level.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  level.unlocked
                    ? currentLevel === level.id
                      ? 'bg-orange-500/30 border-orange-500'
                      : 'bg-white/10 border-white/30 hover:bg-white/20'
                    : 'bg-gray-500/20 border-gray-500/50 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`font-semibold ${level.unlocked ? 'text-white' : 'text-gray-400'}`}
                    >
                      {level.name}
                    </h3>
                    <p className={`text-sm ${level.unlocked ? 'text-white/70' : 'text-gray-500'}`}>
                      {level.description}
                    </p>
                  </div>
                  <div className={`text-2xl ${level.unlocked ? '' : 'opacity-50'}`}>
                    {level.unlocked ? '🎮' : '🔒'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Gamepad2 className="w-5 h-5 mr-2 text-purple-400" />
            Juegos Disponibles
          </h2>
          <div className="space-y-3">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/10 rounded-lg border border-white/30 hover:bg-white/20 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{game.name}</h3>
                    <p className="text-sm text-white/70">{game.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          game.difficulty === 'Fácil'
                            ? 'bg-green-500/30 text-green-400'
                            : game.difficulty === 'Medio'
                              ? 'bg-yellow-500/30 text-yellow-400'
                              : game.difficulty === 'Difícil'
                                ? 'bg-orange-500/30 text-orange-400'
                                : 'bg-red-500/30 text-red-400'
                        }`}
                      >
                        {game.difficulty}
                      </span>
                      <span className="text-xs text-white/50">👥 {game.players} jugadores</span>
                    </div>
                  </div>
                  <button className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                    <Play className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
          Logros y Trofeos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                achievement.unlocked
                  ? 'bg-yellow-500/20 border-yellow-500/50'
                  : 'bg-gray-500/20 border-gray-500/50'
              }`}
            >
              <div className="text-center">
                <div className={`text-3xl mb-2 ${achievement.unlocked ? '' : 'opacity-50'}`}>
                  {achievement.unlocked ? '🏆' : '🔒'}
                </div>
                <h3
                  className={`font-semibold text-sm ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}
                >
                  {achievement.title}
                </h3>
                <p className={`text-xs text-white/70 mt-1`}>{achievement.description}</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        achievement.unlocked ? 'bg-yellow-400' : 'bg-gray-500'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-1">{achievement.progress}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
            Estadísticas de Juego
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-white/70">
              <span>Partidas jugadas</span>
              <span className="text-pink-400">47</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Victorias</span>
              <span className="text-green-400">32</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Tiempo total</span>
              <span className="text-blue-400">12h 34m</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Power-ups Activos
          </h3>
          <div className="space-y-2">
            <div className="p-2 bg-yellow-500/20 rounded border border-yellow-500/50">
              <p className="text-white font-medium">⚡ Doble Velocidad</p>
              <p className="text-white/70 text-sm">Activo • 5 min restantes</p>
            </div>
            <div className="p-2 bg-blue-500/20 rounded border border-blue-500/50">
              <p className="text-white font-medium">🛡️ Escudo Protector</p>
              <p className="text-white/70 text-sm">Activo • 3 usos</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-purple-400" />
            Ranking Global
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-white/70">
              <span>Tu posición</span>
              <span className="text-purple-400">#127</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Jugadores totales</span>
              <span className="text-white">10,234</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Top 1%</span>
              <span className="text-yellow-400">🔥</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export { DemoDashboard };
