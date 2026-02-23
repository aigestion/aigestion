import { google, calendar_v3 } from 'googleapis';
import { injectable } from 'inversify';
import { logger } from '../../utils/logger';
import { getCache, setCache } from '../../cache/redis';

const CACHE_TTL = 300; // 5 minutes

/**
 * GOOGLE CALENDAR SERVICE — God Level Scheduling Engine
 * Full event lifecycle: create, read, update, delete, free/busy, watch.
 * Integrates with Daniela for voice-driven scheduling.
 */
@injectable()
export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar | null = null;
  private readonly SCOPES = ['https://www.googleapis.com/auth/calendar'];
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initializeClient();
  }

  private async initializeClient() {
    try {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        const auth = new google.auth.GoogleAuth({ scopes: this.SCOPES });
        const authClient = await auth.getClient();
        this.calendar = google.calendar({ version: 'v3', auth: authClient as any });
        logger.info('[GoogleCalendar] ✅ Initialized via Service Account');
        return;
      }

      if (process.env.GOOGLE_CALENDAR_API_KEY) {
        this.calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_CALENDAR_API_KEY });
        logger.info('[GoogleCalendar] ⚠️ Initialized via API Key (read-only)');
        return;
      }

      logger.warn('[GoogleCalendar] No credentials found — service inactive');
    } catch (error: any) {
      logger.error(`[GoogleCalendar] Init failure: ${error.message}`);
    }
  }

  private async getClient(): Promise<calendar_v3.Calendar> {
    if (this.initPromise) await this.initPromise;
    if (!this.calendar) throw new Error('Google Calendar client not initialized');
    return this.calendar;
  }

  // ─────────────────────────────────────────────────────────────
  // EVENT OPERATIONS
  // ─────────────────────────────────────────────────────────────

  /**
   * Lists upcoming events from the primary calendar.
   */
  async listEvents(options: {
    calendarId?: string;
    maxResults?: number;
    timeMin?: string;
    timeMax?: string;
    query?: string;
  } = {}): Promise<calendar_v3.Schema$Event[]> {
    const cacheKey = `calendar:events:${JSON.stringify(options)}`;
    const cached = await getCache(cacheKey);
    if (cached) return JSON.parse(cached);

    const cal = await this.getClient();
    const response = await cal.events.list({
      calendarId: options.calendarId || 'primary',
      maxResults: options.maxResults || 20,
      timeMin: options.timeMin || new Date().toISOString(),
      timeMax: options.timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      q: options.query,
    });

    const events = response.data.items || [];
    await setCache(cacheKey, JSON.stringify(events), CACHE_TTL);
    return events;
  }

  /**
   * Gets a single event by ID.
   */
  async getEvent(eventId: string, calendarId = 'primary'): Promise<calendar_v3.Schema$Event> {
    const cal = await this.getClient();
    const response = await cal.events.get({ calendarId, eventId });
    return response.data;
  }

  /**
   * Creates a new calendar event.
   */
  async createEvent(event: {
    summary: string;
    description?: string;
    location?: string;
    start: { dateTime: string; timeZone?: string };
    end: { dateTime: string; timeZone?: string };
    attendees?: Array<{ email: string }>;
    reminders?: { useDefault: boolean; overrides?: Array<{ method: string; minutes: number }> };
    colorId?: string;
  }, calendarId = 'primary'): Promise<calendar_v3.Schema$Event> {
    const cal = await this.getClient();
    const response = await cal.events.insert({
      calendarId,
      requestBody: {
        ...event,
        start: { ...event.start, timeZone: event.start.timeZone || 'Europe/Madrid' },
        end: { ...event.end, timeZone: event.end.timeZone || 'Europe/Madrid' },
      },
    });
    logger.info(`[GoogleCalendar] ✅ Event created: ${response.data.id} (${event.summary})`);
    return response.data;
  }

  /**
   * Updates an existing event.
   */
  async updateEvent(
    eventId: string,
    updates: Partial<calendar_v3.Schema$Event>,
    calendarId = 'primary',
  ): Promise<calendar_v3.Schema$Event> {
    const cal = await this.getClient();
    const response = await cal.events.patch({
      calendarId,
      eventId,
      requestBody: updates,
    });
    logger.info(`[GoogleCalendar] ✏️ Event updated: ${eventId}`);
    return response.data;
  }

  /**
   * Deletes an event.
   */
  async deleteEvent(eventId: string, calendarId = 'primary'): Promise<void> {
    const cal = await this.getClient();
    await cal.events.delete({ calendarId, eventId });
    logger.info(`[GoogleCalendar] 🗑️ Event deleted: ${eventId}`);
  }

  // ─────────────────────────────────────────────────────────────
  // GOD MODE — INTELLIGENT SCHEDULING
  // ─────────────────────────────────────────────────────────────

  /**
   * Checks free/busy slots for scheduling.
   */
  async checkAvailability(
    timeMin: string,
    timeMax: string,
    calendarIds: string[] = ['primary'],
  ): Promise<{ busy: Array<{ start: string; end: string }>; free: Array<{ start: string; end: string }> }> {
    const cal = await this.getClient();
    const response = await cal.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: calendarIds.map(id => ({ id })),
      },
    });

    const busySlots = calendarIds.flatMap(
      id => (response.data.calendars?.[id]?.busy || []) as Array<{ start: string; end: string }>,
    );

    // Calculate free slots
    const freeSlots = this.calculateFreeSlots(timeMin, timeMax, busySlots);

    return { busy: busySlots, free: freeSlots };
  }

  /**
   * Quick-create an event from a text string (natural language).
   * e.g., "Meeting with Juan tomorrow 3pm to 4pm"
   */
  async quickCreate(text: string, calendarId = 'primary'): Promise<calendar_v3.Schema$Event> {
    const cal = await this.getClient();
    const response = await cal.events.quickAdd({
      calendarId,
      text,
    });
    logger.info(`[GoogleCalendar] ⚡ Quick event created: ${response.data.id}`);
    return response.data;
  }

  /**
   * Lists all available calendars.
   */
  async listCalendars(): Promise<calendar_v3.Schema$CalendarListEntry[]> {
    const cal = await this.getClient();
    const response = await cal.calendarList.list();
    return response.data.items || [];
  }

  /**
   * Gets today's agenda summary.
   */
  async getTodayAgenda(calendarId = 'primary'): Promise<{
    date: string;
    events: calendar_v3.Schema$Event[];
    count: number;
  }> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const events = await this.listEvents({
      calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      maxResults: 50,
    });

    return {
      date: startOfDay.toISOString().split('T')[0],
      events,
      count: events.length,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // INTERNAL UTILITIES
  // ─────────────────────────────────────────────────────────────

  private calculateFreeSlots(
    start: string,
    end: string,
    busy: Array<{ start: string; end: string }>,
  ): Array<{ start: string; end: string }> {
    const free: Array<{ start: string; end: string }> = [];
    let current = new Date(start);
    const endDate = new Date(end);

    const sorted = [...busy].sort((a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime());

    for (const slot of sorted) {
      const busyStart = new Date(slot.start!);
      if (current < busyStart) {
        free.push({ start: current.toISOString(), end: busyStart.toISOString() });
      }
      current = new Date(Math.max(current.getTime(), new Date(slot.end!).getTime()));
    }

    if (current < endDate) {
      free.push({ start: current.toISOString(), end: endDate.toISOString() });
    }

    return free;
  }
}
