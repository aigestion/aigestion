/**
 * Amazon Alexa God Mode Dashboard - AIGestion.net
 * Panel de control para Amazon Alexa y servicios a nivel dios
 */

import React, { useState, useEffect } from 'react';
import { amazonAlexaGodMode } from '../services/amazon-alexa-godmode';
import { Mic, Volume2, Home, Settings, Bell, TrendingUp, Users, Wifi, WifiOff, Play, Pause, SkipForward, SkipBack, MoreVertical, ChevronRight, Star, Zap, Shield, Music, Video, Shopping, Cloud, Brain, Coffee, Sun, Moon, Smartphone, Laptop, Tablet, Tv, Speaker, Lightbulb, Thermometer, Lock, Unlock, Camera, Doorbell } from 'lucide-react';

interface AlexaDevice {
  device_id: string;
  device_name: string;
  device_type: string;
  location: { room: string; floor?: string };
  status: 'online' | 'offline';
  volume: number;
  do_not_disturb: boolean;
  bluetooth_connected: boolean;
}

interface AlexaSkill {
  skill_id: string;
  skill_name: string;
  skill_type: string;
  invocation_name: string;
  enabled: boolean;
  usage_stats: {
    total_invocations: number;
    daily_users: number;
  };
}

interface AmazonService {
  service_id: string;
  service_name: string;
  service_type: string;
  subscription_active: boolean;
  subscription_tier: string;
  features: string[];
}

export const AmazonAlexaGodModeDashboard: React.FC = () => {
  const [devices, setDevices] = useState<AlexaDevice[]>([]);
  const [skills, setSkills] = useState<AlexaSkill[]>([]);
  const [services, setServices] = useState<AmazonService[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedDevice, setSelectedDevice] = useState<AlexaDevice | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<AlexaSkill | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAlexaData();
  }, []);

  const loadAlexaData = async () => {
    try {
      await amazonAlexaGodMode.initialize();
      
      const alexaDevices = amazonAlexaGodMode.getDevices();
      const alexaSkills = amazonAlexaGodMode.getSkills();
      const alexaServices = amazonAlexaGodMode.getServices();
      const alexaStats = amazonAlexaGodMode.getStats();
      
      setDevices(alexaDevices);
      setSkills(alexaSkills);
      setServices(alexaServices);
      setStats(alexaStats);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar datos de Alexa:', error);
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'echo_studio': return <Speaker className="w-6 h-6" />;
      case 'echo_show': return <Tablet className="w-6 h-6" />;
      case 'echo_dot': return <Speaker className="w-5 h-5" />;
      case 'echo_spot': return <Tv className="w-5 h-5" />;
      case 'echo_flex': return <Speaker className="w-5 h-5" />;
      case 'echo_pop': return <Speaker className="w-4 h-4" />;
      default: return <Speaker className="w-5 h-5" />;
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'prime': return <Video className="w-5 h-5" />;
      case 'aws': return <Cloud className="w-5 h-5" />;
      case 'music': return <Music className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'shopping': return <Shopping className="w-5 h-5" />;
      case 'kindle': return <Book className="w-5 h-5" />;
      case 'audible': return <Headphones className="w-5 h-5" />;
      case 'twitch': return <Tv className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-50';
      case 'offline': return 'text-red-600 bg-red-50';
      case 'sleeping': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleDeviceCommand = async (deviceId: string, command: string) => {
    try {
      const result = await amazonAlexaGodMode.executeDeviceCommand(deviceId, command);
      if (result.success) {
        console.log(`✅ Comando ejecutado: ${command}`);
        // Actualizar estado del dispositivo si es necesario
        loadAlexaData();
      } else {
        console.error(`❌ Error en comando: ${result.message}`);
      }
    } catch (error) {
      console.error('Error al ejecutar comando:', error);
    }
  };

  const handleSkillInvocation = async (skillId: string, intent: string) => {
    try {
      const result = await amazonAlexaGodMode.invokeSkill(skillId, intent);
      if (result.success) {
        console.log(`✅ Skill invocado: ${result.response}`);
        // Mostrar respuesta al usuario
        alert(result.response || 'Skill ejecutado exitosamente');
      } else {
        console.error(`❌ Error en skill: ${result.response}`);
      }
    } catch (error) {
      console.error('Error al invocar skill:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Amazon Alexa God Mode...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                🎙️ Amazon Alexa God Mode
              </h1>
              <p className="text-gray-600 mt-2">
                Sistema de control Alexa y servicios Amazon a nivel dios
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Cuenta Amazon</p>
                <p className="font-semibold text-orange-600">noemisanalex@hotmail.com</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                <Mic className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Dispositivos</p>
                  <p className="text-3xl font-bold">{stats.devices.total}</p>
                  <p className="text-orange-200 text-xs">{stats.devices.online} online</p>
                </div>
                <Home className="w-8 h-8 text-orange-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Skills AIGestion</p>
                  <p className="text-3xl font-bold">{stats.skills.enabled}</p>
                  <p className="text-blue-200 text-xs">{stats.skills.total_invocations} invocaciones</p>
                </div>
                <Brain className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Servicios Amazon</p>
                  <p className="text-3xl font-bold">{stats.services.active}</p>
                  <p className="text-purple-200 text-xs">${stats.services.monthly_cost}/mes</p>
                </div>
                <Shopping className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Rutinas Activas</p>
                  <p className="text-3xl font-bold">{stats.routines.enabled}</p>
                  <p className="text-green-200 text-xs">{stats.routines.executions_today} hoy</p>
                </div>
                <Zap className="w-8 h-8 text-green-200" />
              </div>
            </div>
          </div>
        )}

        {/* Devices Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Home className="w-5 h-5 mr-2 text-orange-600" />
            Dispositivos Alexa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <div key={device.device_id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${device.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {getDeviceIcon(device.device_type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{device.device_name}</h4>
                      <p className="text-sm text-gray-500">{device.location.room}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                    {device.status}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Volumen:</span>
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-gray-400" />
                      <span>{device.volume}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Bluetooth:</span>
                    <div className={`px-2 py-1 rounded text-xs ${device.bluetooth_connected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {device.bluetooth_connected ? 'Conectado' : 'Desconectado'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">No Molestar:</span>
                    <div className={`px-2 py-1 rounded text-xs ${device.do_not_disturb ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                      {device.do_not_disturb ? 'Activado' : 'Desactivado'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeviceCommand(device.device_id, 'play_music')}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Reproducir música"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeviceCommand(device.device_id, 'set_volume')}
                      className="p-1 text-green-600 hover:text-green-800 transition-colors"
                      title="Ajustar volumen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeviceCommand(device.device_id, 'toggle_dnd')}
                      className="p-1 text-orange-600 hover:text-orange-800 transition-colors"
                      title="No molestar"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedDevice(device)}
                    className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                    title="Más opciones"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            Skills de AIGestion
          </h3>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.skill_id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${skill.enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{skill.skill_name}</h4>
                      <p className="text-sm text-gray-500">Invocación: "Alexa, {skill.invocation_name}"</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${skill.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {skill.enabled ? 'Activo' : 'Inactivo'}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{skill.usage_stats.total_invocations} usos</p>
                      <p className="text-xs text-gray-500">{skill.usage_stats.daily_users} usuarios/día</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSkillInvocation(skill.skill_id, 'GetBusinessMetrics')}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Métricas
                    </button>
                    <button
                      onClick={() => handleSkillInvocation(skill.skill_id, 'AnalyzeData')}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Analizar
                    </button>
                    <button
                      onClick={() => handleSkillInvocation(skill.skill_id, 'GenerateReport')}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                    >
                      Reporte
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(skill)}
                    className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                    title="Más opciones"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amazon Services Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Shopping className="w-5 h-5 mr-2 text-purple-600" />
            Servicios Amazon
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service.service_id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${service.subscription_active ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                      {getServiceIcon(service.service_type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{service.service_name}</h4>
                      <p className="text-sm text-gray-500">{service.subscription_tier.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${service.subscription_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {service.subscription_active ? 'Activo' : 'Inactivo'}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{service.features.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-gradient-to-r from-orange-100 to-blue-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Mic className="w-5 h-5 text-orange-600" />
              <div className="text-left">
                <div className="font-medium">Comando de Voz</div>
                <div className="text-sm text-gray-500">Habla con Alexa</div>
              </div>
            </button>
            
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Music className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Reproducir Música</div>
                <div className="text-sm text-gray-500">Amazon Music</div>
              </div>
            </button>
            
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Control Hogar</div>
                <div className="text-sm text-gray-500">Smart Home</div>
              </div>
            </button>
            
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Settings className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Configuración</div>
                <div className="text-sm text-gray-500">Ajustes Alexa</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Iconos adicionales que no estaban en el import
const Book = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const Headphones = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a7 7 0 0114 0v7a7 7 0 01-14 0V5zM7 12h10M7 12l-2 2m2-2l2 2m6-2l2 2m-2-2l-2 2" />
  </svg>
);
