/**
 * Echo Bluetooth God Mode Dashboard - AIGestion.net
 * Panel de control para Echo Dot con Bluetooth a nivel dios
 */

import React, { useState, useEffect } from 'react';
import { echoBluetoothGodMode } from '../services/echo-bluetooth-godmode';
import {
  Bluetooth,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Settings,
  Volume2,
  Headphones,
  Smartphone,
  Laptop,
  Tablet,
  Tv,
  Speaker,
  Phone,
  Music,
  Mic,
  Zap,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  MoreVertical,
  ChevronRight,
  Star,
  Signal,
  Radio,
  Activity,
  Clock,
  BarChart3,
  PieChart,
} from 'lucide-react';

interface BluetoothDevice {
  device_id: string;
  name: string;
  mac_address: string;
  device_type: string;
  rssi_signal: number;
  battery_level?: number;
  connection_quality: 'poor' | 'fair' | 'good' | 'excellent';
  trusted: boolean;
  auto_connect: boolean;
}

interface ActiveConnection {
  device_id: string;
  profile: string;
  status: string;
  bitrate_kbps: number;
  codec: string;
  latency_ms: number;
  data_transferred_mb: number;
}

interface AudioProfile {
  profile_name: string;
  description: string;
  codec: string;
  bitrate_kbps: number;
  sample_rate_hz: number;
  channels: string;
  latency_ms: number;
}

export const EchoBluetoothGodModeDashboard: React.FC = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>([]);
  const [audioProfiles, setAudioProfiles] = useState<AudioProfile[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string>('ultra');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadBluetoothData();
  }, []);

  const loadBluetoothData = async () => {
    try {
      await echoBluetoothGodMode.initialize();

      const pairedDevices = echoBluetoothGodMode.getPairedDevices();
      const connections = echoBluetoothGodMode.getActiveConnections();
      const profiles = echoBluetoothGodMode.getAudioProfiles();
      const diagnostics = echoBluetoothGodMode.getDiagnostics();

      setDevices(pairedDevices);
      setActiveConnections(connections);
      setAudioProfiles(profiles);
      setStats(diagnostics.performance_metrics);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar datos Bluetooth:', error);
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'headphones':
        return <Headphones className="w-5 h-5" />;
      case 'speaker':
        return <Speaker className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'laptop':
        return <Laptop className="w-5 h-5" />;
      case 'smartwatch':
        return <Activity className="w-5 h-5" />;
      case 'car_audio':
        return <Radio className="w-5 h-5" />;
      case 'tv':
        return <Tv className="w-5 h-5" />;
      case 'gaming_console':
        return <Play className="w-5 h-5" />;
      default:
        return <Bluetooth className="w-5 h-5" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-600 bg-green-50';
      case 'good':
        return 'text-blue-600 bg-blue-50';
      case 'fair':
        return 'text-yellow-600 bg-yellow-50';
      case 'poor':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return { strength: 4, color: 'text-green-600' };
    if (rssi > -60) return { strength: 3, color: 'text-blue-600' };
    if (rssi > -70) return { strength: 2, color: 'text-yellow-600' };
    return { strength: 1, color: 'text-red-600' };
  };

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-gray-400';
    if (level > 60) return 'text-green-600';
    if (level > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleConnect = async (deviceId: string) => {
    try {
      const result = await echoBluetoothGodMode.connectToDevice(deviceId);
      if (result.success) {
        console.log(`✅ Conectado a ${result.message}`);
        loadBluetoothData();
      } else {
        console.error(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error al conectar:', error);
    }
  };

  const handleDisconnect = async (deviceId: string) => {
    try {
      const success = await echoBluetoothGodMode.disconnectFromDevice(deviceId);
      if (success) {
        console.log(`✅ Desconectado del dispositivo ${deviceId}`);
        loadBluetoothData();
      }
    } catch (error) {
      console.error('Error al desconectar:', error);
    }
  };

  const handleApplyProfile = async (profileName: string) => {
    try {
      const result = await echoBluetoothGodMode.applyAudioProfile(profileName);
      if (result.success) {
        console.log(`✅ ${result.message}`);
        setSelectedProfile(profileName);
      } else {
        console.error(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error al aplicar perfil:', error);
    }
  };

  const formatDataSize = (mb: number): string => {
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(1)} GB`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Echo Bluetooth God Mode...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎧 Echo Bluetooth God Mode
              </h1>
              <p className="text-gray-600 mt-2">
                Configuración avanzada de Echo Dot con Bluetooth a nivel dios
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Echo Dot</p>
                <p className="font-semibold text-blue-600">Bluetooth 5.2</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                <Bluetooth className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Dispositivos Emparejados</p>
                  <p className="text-3xl font-bold">{devices.length}</p>
                  <p className="text-blue-200 text-xs">{activeConnections.length} conectados</p>
                </div>
                <Headphones className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Calidad Promedio</p>
                  <p className="text-3xl font-bold">{stats.avg_bitrate_kbps} kbps</p>
                  <p className="text-green-200 text-xs">Bitrate</p>
                </div>
                <Signal className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Datos Transferidos</p>
                  <p className="text-3xl font-bold">
                    {stats.total_data_transferred_gb.toFixed(1)} GB
                  </p>
                  <p className="text-purple-200 text-xs">Total</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Uptime</p>
                  <p className="text-3xl font-bold">{stats.uptime_percentage.toFixed(1)}%</p>
                  <p className="text-orange-200 text-xs">Confiabilidad</p>
                </div>
                <Shield className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>
        )}

        {/* Audio Profile Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Music className="w-5 h-5 mr-2 text-purple-600" />
            Perfil de Audio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {audioProfiles.map(profile => (
              <div
                key={profile.profile_name}
                onClick={() => handleApplyProfile(profile.profile_name)}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedProfile === profile.profile_name
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{profile.profile_name}</h4>
                  {selectedProfile === profile.profile_name && (
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">{profile.description}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Codec:</span>
                    <span className="font-medium">{profile.codec}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bitrate:</span>
                    <span className="font-medium">{profile.bitrate_kbps} kbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latencia:</span>
                    <span className="font-medium">{profile.latency_ms} ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paired Devices */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Bluetooth className="w-5 h-5 mr-2 text-blue-600" />
            Dispositivos Emparejados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map(device => {
              const signal = getSignalStrength(device.rssi_signal);
              const isConnected = activeConnections.some(
                conn => conn.device_id === device.device_id
              );

              return (
                <div
                  key={device.device_id}
                  className="border rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${isConnected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {getDeviceIcon(device.device_type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{device.name}</h4>
                        <p className="text-sm text-gray-500">{device.device_type}</p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {isConnected ? 'Conectado' : 'Desconectado'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Señal:</span>
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-3 rounded-full ${
                                i < signal.strength ? signal.color : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs">{device.rssi_signal} dBm</span>
                      </div>
                    </div>

                    {device.battery_level !== undefined && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Batería:</span>
                        <div className="flex items-center space-x-1">
                          {device.battery_level > 20 ? (
                            <Battery
                              className={`w-4 h-4 ${getBatteryColor(device.battery_level)}`}
                            />
                          ) : (
                            <BatteryLow className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-xs ${getBatteryColor(device.battery_level)}`}>
                            {device.battery_level}%
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Calidad:</span>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(device.connection_quality)}`}
                      >
                        {device.connection_quality}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">MAC:</span>
                      <span className="text-xs font-mono">{device.mac_address}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedDevice(device)}
                        className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Ver detalles"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      {isConnected ? (
                        <button
                          onClick={() => handleDisconnect(device.device_id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Desconectar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(device.device_id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Conectar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Connections */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-600" />
            Conexiones Activas
          </h3>
          <div className="space-y-4">
            {activeConnections.map(connection => {
              const device = devices.find(d => d.device_id === connection.device_id);

              return (
                <div
                  key={`${connection.device_id}-${connection.profile}`}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <h4 className="font-medium text-gray-800">{device?.name}</h4>
                          <p className="text-sm text-gray-500">Perfil: {connection.profile}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-right">
                        <p className="text-gray-600">Codec</p>
                        <p className="font-medium">{connection.codec}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">Bitrate</p>
                        <p className="font-medium">{connection.bitrate_kbps} kbps</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">Latencia</p>
                        <p className="font-medium">{connection.latency_ms} ms</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">Datos</p>
                        <p className="font-medium">
                          {formatDataSize(connection.data_transferred_mb)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {activeConnections.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bluetooth className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No hay conexiones activas</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Bluetooth className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Escanear Dispositivos</div>
                <div className="text-sm text-gray-500">Buscar nuevos dispositivos</div>
              </div>
            </button>

            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Music className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Optimizar Audio</div>
                <div className="text-sm text-gray-500">Ajustar calidad y codec</div>
              </div>
            </button>

            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Diagnóstico</div>
                <div className="text-sm text-gray-500">Verificar conexiones</div>
              </div>
            </button>

            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Settings className="w-5 h-5 text-orange-600" />
              <div className="text-left">
                <div className="font-medium">Configuración</div>
                <div className="text-sm text-gray-500">Ajustes avanzados</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
