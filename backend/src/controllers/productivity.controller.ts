// src/controllers/productivity.controller.ts
// GOD MODE — Unified Google Productivity Command Center
import type { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { GoogleCalendarService } from '../services/google/google-calendar.service';
import { GmailService } from '../services/google/gmail.service';
import { GoogleSheetsService } from '../services/google/google-sheets.service';
import { GoogleContactsService } from '../services/google/google-contacts.service';
import { logger } from '../utils/logger';

@injectable()
export class ProductivityController {
  constructor(
    @inject(TYPES.GoogleCalendarService) private readonly calendar: GoogleCalendarService,
    @inject(TYPES.GmailService) private readonly gmail: GmailService,
    @inject(TYPES.GoogleSheetsService) private readonly sheets: GoogleSheetsService,
    @inject(TYPES.GoogleContactsService) private readonly contacts: GoogleContactsService,
  ) {}

  // ═══════════════════════════════════════════════════════════
  // CALENDAR
  // ═══════════════════════════════════════════════════════════

  public async calendarListEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await this.calendar.listEvents(req.query as any);
      res.json({ events, count: events.length });
    } catch (error) {
      next(error);
    }
  }

  public async calendarGetEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await this.calendar.getEvent(req.params.id);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  public async calendarCreateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await this.calendar.createEvent(req.body);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  public async calendarUpdateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await this.calendar.updateEvent(req.params.id, req.body);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  public async calendarDeleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      await this.calendar.deleteEvent(req.params.id);
      res.json({ deleted: true });
    } catch (error) {
      next(error);
    }
  }

  public async calendarQuickCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await this.calendar.quickCreate(req.body.text);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  public async calendarAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { timeMin, timeMax, calendarIds } = req.body;
      const result = await this.calendar.checkAvailability(timeMin, timeMax, calendarIds);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async calendarTodayAgenda(_req: Request, res: Response, next: NextFunction) {
    try {
      const agenda = await this.calendar.getTodayAgenda();
      res.json(agenda);
    } catch (error) {
      next(error);
    }
  }

  public async calendarListCalendars(_req: Request, res: Response, next: NextFunction) {
    try {
      const calendars = await this.calendar.listCalendars();
      res.json({ calendars });
    } catch (error) {
      next(error);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // GMAIL
  // ═══════════════════════════════════════════════════════════

  public async gmailListMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.gmail.listMessages(req.query as any);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async gmailGetMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await this.gmail.getMessage(req.params.id);
      res.json(message);
    } catch (error) {
      next(error);
    }
  }

  public async gmailSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, maxResults } = req.body;
      const results = await this.gmail.searchMessages(query, maxResults);
      res.json({ results, count: results.length });
    } catch (error) {
      next(error);
    }
  }

  public async gmailSend(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.gmail.sendEmail(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async gmailDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.gmail.createDraft(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async gmailLabels(_req: Request, res: Response, next: NextFunction) {
    try {
      const labels = await this.gmail.listLabels();
      res.json({ labels });
    } catch (error) {
      next(error);
    }
  }

  public async gmailInboxSummary(_req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await this.gmail.getInboxSummary();
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // SHEETS
  // ═══════════════════════════════════════════════════════════

  public async sheetsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { spreadsheetId, range } = req.body;
      const values = await this.sheets.readRange(spreadsheetId, range);
      res.json({ values, rows: values.length });
    } catch (error) {
      next(error);
    }
  }

  public async sheetsWrite(req: Request, res: Response, next: NextFunction) {
    try {
      const { spreadsheetId, range, values } = req.body;
      const result = await this.sheets.writeRange(spreadsheetId, range, values);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async sheetsAppend(req: Request, res: Response, next: NextFunction) {
    try {
      const { spreadsheetId, range, values } = req.body;
      const result = await this.sheets.appendRows(spreadsheetId, range, values);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async sheetsCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, sheetNames } = req.body;
      const result = await this.sheets.createSpreadsheet(title, sheetNames);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async sheetsInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const info = await this.sheets.getSpreadsheetInfo(req.params.id);
      res.json(info);
    } catch (error) {
      next(error);
    }
  }

  public async sheetsReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, headers, data } = req.body;
      const result = await this.sheets.generateReport(title, headers, data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // CONTACTS (PEOPLE API)
  // ─────────────────────────────────────────────────────────────

  public async contactsList(req: Request, res: Response, next: NextFunction) {
    try {
      const pageSize = parseInt(req.query.pageSize as string) || 100;
      const contacts = await this.contacts.listContacts(pageSize);
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  }

  public async contactsSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;
      const results = await this.contacts.searchContacts(q as string);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  public async contactsCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await this.contacts.createContact(req.body);
      res.json(contact);
    } catch (error) {
      next(error);
    }
  }

  public async contactsDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { resourceName } = req.body;
      await this.contacts.deleteContact(resourceName);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
