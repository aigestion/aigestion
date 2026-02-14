import { injectable } from 'inversify';

@injectable()
export class GoogleCalendarService {
  async listEvents(calendarId: string) {
    return [];
  }
}
