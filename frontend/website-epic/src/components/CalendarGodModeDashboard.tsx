/**
 * Calendar God Mode Dashboard - AIGestion.net
 * Panel de control para Google Calendar a nivel dios
 */

import React, { useState, useEffect } from 'react';
import { calendarGodMode } from '../services/calendar-godmode';
import { Calendar, Clock, Users, Plus, Search, Filter, Bell, Settings, TrendingUp, Target, CheckCircle, AlertCircle, BarChart3, Video, Phone, MapPin, Coffee, Briefcase, Star, ChevronRight, ChevronLeft, MoreVertical, Edit, Trash2, VideoOff, Mic, MicOff } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  attendees?: Array<{ email: string; name?: string }>;
  reminders: { useDefault: boolean; overrides?: Array<{ method: string; minutes: number }> };
  context_analysis?: {
    priority: string;
    type: string;
    preparation_time: number;
    follow_up_required: boolean;
    ai_suggestions: string[];
  };
}

export const CalendarGodModeDashboard: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = async () => {
    try {
      await calendarGodMode.initialize();
      
      const calendarEvents = calendarGodMode.getEvents();
      const calendarStats = calendarGodMode.getStats();
      
      setEvents(calendarEvents);
      setStats(calendarStats);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar datos del calendario:', error);
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'text-blue-600 bg-blue-50';
      case 'deadline': return 'text-red-600 bg-red-50';
      case 'reminder': return 'text-purple-600 bg-purple-50';
      case 'personal': return 'text-green-600 bg-green-50';
      case 'task': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatEventTime = (start: any, end: any) => {
    const startDate = new Date(start.dateTime || start.date);
    const endDate = new Date(end.dateTime || end.date);
    
    if (start.date) {
      return startDate.toLocaleDateString('es-ES', { weekday: 'short' });
    }
    
    return startDate.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) + ' - ' + endDate.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEventDuration = (event: CalendarEvent): string => {
    if (!event.start.dateTime || !event.end.dateTime) return '';
    
    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    
    if (duration < 60) {
      return `${duration}min`;
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours}h ${minutes}min`;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCalendar = selectedCalendar === 'all' || 
                          event.start.dateTime?.includes(selectedCalendar);
    
    return matchesSearch && matchesCalendar;
  });

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Calendar God Mode...</p>
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
                📅 Calendar God Mode
              </h1>
              <p className="text-gray-600 mt-2">
                Google Calendar organizado con IA y automatización inteligente
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('day')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'day' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Día
              </button>
              <button
                onClick={() => setCurrentView('week')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setCurrentView('month')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setCurrentView('agenda')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'agenda' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Agenda
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Eventos</p>
                  <p className="text-3xl font-bold">{stats.total_events}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Próximos</p>
                  <p className="text-3xl font-bold">{stats.upcoming_events}</p>
                </div>
                <Clock className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Hoy</p>
                  <p className="text-3xl font-bold">{stats.events_today}</p>
                </div>
                <Target className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Horas Reunión</p>
                  <p className="text-3xl font-bold">{stats.meeting_hours}h</p>
                </div>
                <Video className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>
        )}

        {/* Calendar Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateCalendar('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentDate.toLocaleDateString('es-ES', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h2>
                {currentView === 'week' && (
                  <p className="text-sm text-gray-500">
                    Semana del {new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)).getDate()} al {new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7)).getDate()}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => navigateCalendar('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Nuevo Evento</span>
              </button>
              
              <button className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filtros</span>
              </button>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <div 
                key={event.id} 
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-3 h-3 rounded-full mt-1" 
                         style={{ backgroundColor: calendarGodModeConfig.calendars.find(c => c.id === event.start.dateTime?.split('T')[0])?.color || '#4285F4' }}>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        {event.context_analysis && (
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.context_analysis.priority)}`}>
                              {event.context_analysis.priority}
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.context_analysis.type)}`}>
                              {event.context_analysis.type}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {event.description.substring(0, 100)}...
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatEventTime(event.start, event.end)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees?.length || 1} participantes</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Coffee className="w-4 h-4" />
                          <span>{getEventDuration(event)}</span>
                        </div>
                      </div>
                      
                      {event.context_analysis?.follow_up_required && (
                        <div className="flex items-center space-x-1 text-orange-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs">Requiere seguimiento</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {event.reminders && !event.reminders.useDefault && (
                      <Bell className="w-4 h-4 text-gray-400" />
                    )}
                    
                    {event.start.dateTime?.includes('T') && (
                      <Video className="w-4 h-4 text-blue-500" />
                    )}
                    
                    <button
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Más opciones"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Plus className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Crear Evento</div>
                <div className="text-sm text-gray-500">Nueva reunión o tarea</div>
              </div>
            </button>
            
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Users className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Invitar Personas</div>
                <div className="text-sm text-gray-500">Añadir asistentes</div>
              </div>
            </button>
            
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Video className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Video Conferencia</div>
                <div className="text-sm text-gray-500">Google Meet</div>
              </div>
            </button>
            
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Settings className="w-5 h-5 text-orange-600" />
              <div className="text-left">
                <div className="font-medium">Configuración</div>
                <div className="text-sm text-gray-500">Ajustes y sincronización</div>
              </div>
            </button>
          </div>
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Detalles del Evento</h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{selectedEvent.title}</h3>
                  
                  {selectedEvent.description && (
                    <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Información del Evento</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Inicio: {new Date(selectedEvent.start.dateTime || selectedEvent.start.date).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Fin: {new Date(selectedEvent.end.dateTime || selectedEvent.end.date).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Duración: {getEventDuration(selectedEvent)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Participantes</h4>
                      <div className="space-y-2">
                        {selectedEvent.attendees?.map((attendee, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="font-medium">{attendee.name || attendee.email}</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              {attendee.responseStatus || 'pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedEvent.context_analysis && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Análisis IA</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Prioridad:</span>
                        <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedEvent.context_analysis.priority)}`}>
                          {selectedEvent.context_analysis.priority}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Tipo:</span>
                        <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedEvent.context_analysis.type)}`}>
                          {selectedEvent.context_analysis.type}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Tiempo preparación:</span>
                        <div className="mt-1 text-sm font-medium">
                          {selectedEvent.context_analysis.preparation_time} minutos
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Seguimiento requerido:</span>
                        <div className="mt-1 text-sm font-medium">
                          {selectedEvent.context_analysis.follow_up_required ? 'Sí' : 'No'}
                        </div>
                      </div>
                    </div>
                    
                    {selectedEvent.context_analysis.ai_suggestions.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Sugerencias de IA</h4>
                        <div className="space-y-2">
                          {selectedEvent.context_analysis.ai_suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cerrar
                  </button>
                  
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
