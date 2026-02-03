/**
 * Calendar God Mode - AIGestion.net
 * Sistema de gestión de Google Calendar a nivel dios
 */

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  attendees?: Array<{ email: string; name?: string }>;
  reminders: { useDefault: boolean; overrides?: Array<{ method: string; minutes: number }> };
  context_analysis?: {
    priority: 'low' | 'medium' | 'high' | 'critical';
    type: 'meeting' | 'deadline' | 'reminder' | 'personal';
    preparation_time: number;
    follow_up_required: boolean;
    ai_suggestions: string[];
  };
}

export const calendarGodModeConfig = {
  calendars: [
    {
      id: 'personal-primary',
      email: 'nemisanalex@gmail.com',
      name: 'Calendario Personal',
      color: '#4285F4',
      timezone: 'Europe/Madrid',
    },
    {
      id: 'professional-aigestion',
      email: 'admin@aigestion.net',
      name: 'AIGestion Business',
      color: '#34A853',
      timezone: 'Europe/Madrid',
    },
    {
      id: 'projects-aigestion',
      email: 'admin@aigestion.net',
      name: 'Proyectos AIGestion',
      color: '#EA4335',
      timezone: 'Europe/Madrid',
    },
  ],
  working_hours: {
    monday: { start: '09:00', end: '18:00', enabled: true },
    tuesday: { start: '09:00', end: '18:00', enabled: true },
    wednesday: { start: '09:00', end: '18:00', enabled: true },
    thursday: { start: '09:00', end: '18:00', enabled: true },
    friday: { start: '09:00', end: '18:00', enabled: true },
    saturday: { start: '10:00', end: '14:00', enabled: false },
    sunday: { start: 'closed', end: 'closed', enabled: false },
  },
};

export class CalendarGodMode {
  private events: CalendarEvent[] = [];
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🚀 Inicializando Calendar God Mode...');
    await this.setupCalendars();
    await this.analyzeExistingEvents();
    this.isInitialized = true;
    console.log('✅ Calendar God Mode inicializado');
  }

  private async setupCalendars(): Promise<void> {
    console.log('📅 Configurando calendarios...');
    calendarGodModeConfig.calendars.forEach(cal => {
      console.log(`✅ ${cal.name} (${cal.email})`);
    });
  }

  private async analyzeExistingEvents(): Promise<void> {
    console.log('📊 Analizando eventos existentes...');

    const mockEvents: CalendarEvent[] = [
      {
        id: 'event-1',
        title: 'Reunión con Cliente Tech Solutions',
        description: 'Presentación de propuesta de IA',
        start: { dateTime: '2024-01-25T10:00:00+01:00' },
        end: { dateTime: '2024-01-25T11:00:00+01:00' },
        attendees: [
          { email: 'cliente@techsolutions.com', name: 'María García' },
          { email: 'admin@aigestion.net', name: 'Alejandro' },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 30 },
            { method: 'popup', minutes: 15 },
          ],
        },
        context_analysis: {
          priority: 'high',
          type: 'meeting',
          preparation_time: 30,
          follow_up_required: true,
          ai_suggestions: [
            'Preparar caso de éxito similar',
            'Revisar propuesta técnica',
            'Configurar demo en vivo',
          ],
        },
      },
      {
        id: 'event-2',
        title: 'Daily Standup - Equipo AIGestion',
        description: 'Reunión diaria de sincronización',
        start: { dateTime: '2024-01-25T09:00:00+01:00' },
        end: { dateTime: '2024-01-25T09:15:00+01:00' },
        reminders: {
          useDefault: false,
          overrides: [{ method: 'popup', minutes: 5 }],
        },
        context_analysis: {
          priority: 'medium',
          type: 'meeting',
          preparation_time: 5,
          follow_up_required: false,
          ai_suggestions: ['Preparar actualización de tareas', 'Revisar bloqueos del día'],
        },
      },
      {
        id: 'event-3',
        title: 'Deep Work - Planificación Q1 2024',
        description: 'Sesión专注 para planificar objetivos',
        start: { dateTime: '2024-01-25T15:00:00+01:00' },
        end: { dateTime: '2024-01-25T17:00:00+01:00' },
        reminders: {
          useDefault: false,
          overrides: [{ method: 'popup', minutes: 5 }],
        },
        context_analysis: {
          priority: 'high',
          type: 'meeting',
          preparation_time: 15,
          follow_up_required: false,
          ai_suggestions: [
            'Revisar objetivos Q4 2023',
            'Analizar métricas de negocio',
            'Definir KPIs Q1 2024',
          ],
        },
      },
    ];

    this.events.push(...mockEvents);
    console.log(`✅ ${mockEvents.length} eventos analizados con IA`);
  }

  async createEvent(eventData: Partial<CalendarEvent>): Promise<{
    success: boolean;
    event?: CalendarEvent;
    suggestions?: string[];
  }> {
    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: eventData.title || 'Nuevo Evento',
      description: eventData.description || '',
      start: eventData.start || { dateTime: new Date().toISOString() },
      end: eventData.end || {
        dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
      attendees: eventData.attendees || [],
      reminders: eventData.reminders || { useDefault: true },
      context_analysis: (await this.analyzeEventContext(eventData)) || undefined,
    } as CalendarEvent;

    this.events.push(newEvent);

    return {
      success: true,
      event: newEvent,
      suggestions: newEvent.context_analysis?.ai_suggestions || undefined,
    } as {
      success: boolean;
      event?: CalendarEvent;
      suggestions?: string[];
    };
  }

  private async analyzeEventContext(
    eventData: Partial<CalendarEvent>
  ): Promise<CalendarEvent['context_analysis']> {
    const title = (eventData.title || '').toLowerCase();
    const description = (eventData.description || '').toLowerCase();
    const fullText = title + ' ' + description;
    const attendees = eventData.attendees || [];

    let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    if (fullText.includes('urgente') || fullText.includes('crítico')) {
      priority = 'critical';
    } else if (fullText.includes('importante')) {
      priority = 'high';
    }

    let type: 'meeting' | 'deadline' | 'reminder' | 'personal' = 'meeting';
    if (fullText.includes('deadline') || fullText.includes('entrega')) {
      type = 'deadline';
    } else if (fullText.includes('recordatorio')) {
      type = 'reminder';
    } else if (fullText.includes('personal')) {
      type = 'personal';
    } else if (fullText.includes('trabajo')) {
      type = 'meeting'; // Changed from 'task' to 'meeting'
    }

    let preparationTime = 15;
    if (type === 'meeting') {
      if (attendees.length > 2) preparationTime = 30;
      if (fullText.includes('presentación')) preparationTime = 60;
    } else if (type === 'deadline') {
      preparationTime = 0;
    }

    const followUpRequired =
      attendees.length > 1 || type === 'meeting' || fullText.includes('cliente');

    const aiSuggestions: string[] = [];
    if (type === 'meeting') {
      aiSuggestions.push('Preparar agenda detallada');
      if (attendees.length > 1) {
        aiSuggestions.push('Enviar recordatorio 24h antes');
      }
    }
    if (fullText.includes('cliente')) {
      aiSuggestions.push('Revisar historial del cliente');
    }

    return {
      priority,
      type,
      preparation_time: preparationTime,
      follow_up_required: followUpRequired,
      ai_suggestions: aiSuggestions,
    };
  }

  getEvents(calendarId?: string): CalendarEvent[] {
    if (calendarId) {
      return this.events.filter(e => e.start.dateTime?.includes(calendarId));
    }
    return this.events;
  }

  getTodayEvents(): CalendarEvent[] {
    const today = new Date().toDateString();
    return this.events.filter(event => {
      const eventDate = new Date(event.start.dateTime || event.start.date || '');
      return eventDate.toDateString() === today;
    });
  }

  getUpcomingEvents(days: number = 7): CalendarEvent[] {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return this.events.filter(event => {
      const eventDate = new Date(event.start.dateTime || event.start.date || '');
      return eventDate >= now && eventDate <= future;
    });
  }

  getStats(): {
    total_events: number;
    upcoming_events: number;
    events_today: number;
    events_this_week: number;
    meeting_hours: number;
    productivity_score: number;
  } {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() + (6 - now.getDay())));

    const todayEvents = this.getTodayEvents();
    const upcomingEvents = this.getUpcomingEvents();
    const weekEvents = this.events.filter(event => {
      const eventDate = new Date(event.start.dateTime || event.start.date || '');
      return eventDate >= weekStart && eventDate <= weekEnd;
    });

    const meetingHours = this.events
      .filter(e => e.context_analysis?.type === 'meeting')
      .reduce((total, event) => {
        const duration =
          event.start.dateTime && event.end.dateTime
            ? (new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime()) /
              (1000 * 60 * 60)
            : 0;
        return total + duration;
      }, 0);

    return {
      total_events: this.events.length,
      upcoming_events: upcomingEvents.length,
      events_today: todayEvents.length,
      events_this_week: weekEvents.length,
      meeting_hours: Math.round(meetingHours),
      productivity_score: Math.min(100, Math.round((meetingHours / 40) * 100)), // 40h/semana = 100%
    };
  }
}

export const calendarGodMode = new CalendarGodMode();
