/**
 * Free Minutes Dashboard - AIGestion.net
 * Panel de control para gestión inteligente de minutos gratis
 * Maximizar ahorro sin gastar dinero
 */

import React, { useState, useEffect } from 'react';
import { freeMinutesManager, freeMinutesServices } from '../services/free-minutes-plan';
import { Phone, DollarSign, TrendingUp, Users, Clock, Zap, Award, AlertCircle, CheckCircle, BarChart3, Target, Gift, Calendar, Settings, RefreshCw, Play, Pause } from 'lucide-react';

interface ServiceStatus {
  name: string;
  allocated: number;
  used: number;
  remaining: number;
  percentage: number;
  color: string;
}

interface CallRecommendation {
  type: 'usage' | 'signup' | 'referral' | 'routing';
  title: string;
  description: string;
  potential_savings: number;
  priority: 'high' | 'medium' | 'low';
}

export const FreeMinutesDashboard: React.FC = () => {
  const [budgetStatus, setBudgetStatus] = useState<any>(null);
  const [servicesStatus, setServicesStatus] = useState<ServiceStatus[]>([]);
  const [recommendations, setRecommendations] = useState<CallRecommendation[]>([]);
  const [savingsReport, setSavingsReport] = useState<any>(null);
  const [isAutoRouting, setIsAutoRouting] = useState(true);
  const [selectedService, setSelectedService] = useState<string>('');
  const [callDetails, setCallDetails] = useState({
    recipient: '',
    recipient_country: 'ES',
    estimated_duration: 5,
    importance: 'medium' as const,
    call_type: 'business' as const,
    time_of_day: 'business_hours' as const,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const budget = freeMinutesManager.getBudgetStatus();
    const recs = freeMinutesManager.getOptimizationRecommendations();
    const report = freeMinutesManager.generateSavingsReport();

    setBudgetStatus(budget);
    setRecommendations(recs);
    setSavingsReport(report);

    // Procesar estado de servicios
    const services = Object.entries(budget.services_breakdown).map(([name, data]: [string, any]) => ({
      name,
      allocated: data.allocated,
      used: data.used,
      remaining: data.remaining,
      percentage: data.allocated > 0 ? (data.used / data.allocated) * 100 : 0,
      color: getColorForService(name),
    }));
    setServicesStatus(services);
  };

  const getColorForService = (serviceName: string): string => {
    const colors: Record<string, string> = {
      'Google Voice': 'bg-blue-500',
      'Skype': 'bg-purple-500',
      'Discord': 'bg-indigo-500',
      'WhatsApp': 'bg-green-500',
      'Signal': 'bg-yellow-500',
      'Telegram': 'bg-blue-400',
      'Vapi Trial': 'bg-pink-500',
      'Twilio Trial': 'bg-red-500',
    };
    return colors[serviceName] || 'bg-gray-500';
  };

  const handleInitiateCall = async () => {
    if (!callDetails.recipient) {
      alert('Por favor, ingresa el número del destinatario');
      return;
    }

    const result = await freeMinutesManager.initiateCall(callDetails);
    
    if (result.success) {
      alert(`✅ Llamada iniciada con ${result.service?.name}\nMotivo: ${result.reason}\nAhorro: $${result.cost_saving?.toFixed(2)}`);
      loadDashboardData(); // Actualizar dashboard
    } else {
      alert(`❌ No se pudo iniciar la llamada: ${result.reason}`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                💰 Plan de Minutos Gratis
              </h1>
              <p className="text-gray-600 mt-2">
                Sistema inteligente para maximizar minutos gratis y no gastar dinero
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAutoRouting(!isAutoRouting)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  isAutoRouting 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Auto-Routing: {isAutoRouting ? 'ON' : 'OFF'}</span>
              </button>
              <button
                onClick={loadDashboardData}
                className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Savings Summary */}
        {savingsReport && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Minutos Ahorrados</p>
                  <p className="text-3xl font-bold">{savingsReport.total_minutes_saved}</p>
                </div>
                <Clock className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Dinero Ahorrado</p>
                  <p className="text-3xl font-bold">${savingsReport.total_money_saved.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Servicio Más Usado</p>
                  <p className="text-xl font-bold">{savingsReport.most_valuable_service}</p>
                </div>
                <Award className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Eficiencia</p>
                  <p className="text-3xl font-bold">{savingsReport.usage_efficiency}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>
        )}

        {/* Services Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Services Usage */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Estado de Servicios
            </h3>
            
            <div className="space-y-4">
              {servicesStatus.map((service) => (
                <div key={service.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{service.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs text-white ${service.color}`}>
                      {service.remaining} min restantes
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Uso: {service.used}/{service.allocated}</span>
                      <span className="text-gray-600">{service.percentage.toFixed(1)}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${service.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(service.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Recomendaciones de Ahorro
            </h3>
            
            <div className="space-y-3">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getPriorityIcon(rec.priority)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium">
                            Ahorro potencial: ${rec.potential_savings}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(rec.priority)}`}>
                            {rec.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p>¡Excelente! No hay recomendaciones pendientes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call Simulator */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-purple-600" />
            Simulador de Llamadas Inteligentes
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destinatario
                </label>
                <input
                  type="text"
                  value={callDetails.recipient}
                  onChange={(e) => setCallDetails({...callDetails, recipient: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+34 600 000 000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País del Destinatario
                </label>
                <select
                  value={callDetails.recipient_country}
                  onChange={(e) => setCallDetails({...callDetails, recipient_country: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="ES">España</option>
                  <option value="US">Estados Unidos</option>
                  <option value="MX">México</option>
                  <option value="AR">Argentina</option>
                  <option value="CO">Colombia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración Estimada (minutos)
                </label>
                <input
                  type="number"
                  value={callDetails.estimated_duration}
                  onChange={(e) => setCallDetails({...callDetails, estimated_duration: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                  max="60"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Llamada
                </label>
                <select
                  value={callDetails.call_type}
                  onChange={(e) => setCallDetails({...callDetails, call_type: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="business">Negocios</option>
                  <option value="domestic">Nacional</option>
                  <option value="international">Internacional</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Importancia
                </label>
                <select
                  value={callDetails.importance}
                  onChange={(e) => setCallDetails({...callDetails, importance: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Momento del Día
                </label>
                <select
                  value={callDetails.time_of_day}
                  onChange={(e) => setCallDetails({...callDetails, time_of_day: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="business_hours">Horario Laboral</option>
                  <option value="after_hours">Fuera de Horario</option>
                  <option value="weekend">Fin de Semana</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleInitiateCall}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Iniciar Llamada Inteligente</span>
            </button>
          </div>
        </div>

        {/* Available Services Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Gift className="w-5 h-5 mr-2 text-purple-600" />
            Servicios con Minutos Gratis Disponibles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {freeMinutesServices.map((service) => (
              <div key={service.name} className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">{service.name}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Minutos gratis:</span>
                    <span className="font-medium">{service.free_minutes_per_month}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bono registro:</span>
                    <span className="font-medium">{service.signup_bonus_minutes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Requiere tarjeta:</span>
                    <span className={`font-medium ${service.limitations.require_credit_card ? 'text-red-600' : 'text-green-600'}`}>
                      {service.limitations.require_credit_card ? 'Sí' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
