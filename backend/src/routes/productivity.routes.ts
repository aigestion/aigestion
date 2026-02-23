import { Router } from 'express';
import { container } from '../config/inversify.config';
import { ProductivityController } from '../controllers/productivity.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Lazy resolution for DI timing
let _ctrl: ProductivityController;
function getCtrl(): ProductivityController {
  if (!_ctrl) _ctrl = container.resolve(ProductivityController);
  return _ctrl;
}

// ═══════════════════════════════════════════════════════════
// CALENDAR ROUTES
// ═══════════════════════════════════════════════════════════
router.get('/calendar/events', requireAuth, (req, res, next) => getCtrl().calendarListEvents(req, res, next));
router.get('/calendar/events/:id', requireAuth, (req, res, next) => getCtrl().calendarGetEvent(req, res, next));
router.post('/calendar/events', requireAuth, (req, res, next) => getCtrl().calendarCreateEvent(req, res, next));
router.patch('/calendar/events/:id', requireAuth, (req, res, next) => getCtrl().calendarUpdateEvent(req, res, next));
router.delete('/calendar/events/:id', requireAuth, (req, res, next) => getCtrl().calendarDeleteEvent(req, res, next));
router.post('/calendar/quick-create', requireAuth, (req, res, next) => getCtrl().calendarQuickCreate(req, res, next));
router.post('/calendar/availability', requireAuth, (req, res, next) => getCtrl().calendarAvailability(req, res, next));
router.get('/calendar/today', requireAuth, (req, res, next) => getCtrl().calendarTodayAgenda(req, res, next));
router.get('/calendar/list', requireAuth, (req, res, next) => getCtrl().calendarListCalendars(req, res, next));

// ═══════════════════════════════════════════════════════════
// GMAIL ROUTES
// ═══════════════════════════════════════════════════════════
router.get('/gmail/messages', requireAuth, (req, res, next) => getCtrl().gmailListMessages(req, res, next));
router.get('/gmail/messages/:id', requireAuth, (req, res, next) => getCtrl().gmailGetMessage(req, res, next));
router.post('/gmail/search', requireAuth, (req, res, next) => getCtrl().gmailSearch(req, res, next));
router.post('/gmail/send', requireAuth, (req, res, next) => getCtrl().gmailSend(req, res, next));
router.post('/gmail/draft', requireAuth, (req, res, next) => getCtrl().gmailDraft(req, res, next));
router.get('/gmail/labels', requireAuth, (req, res, next) => getCtrl().gmailLabels(req, res, next));
router.get('/gmail/inbox-summary', requireAuth, (req, res, next) => getCtrl().gmailInboxSummary(req, res, next));

// ═══════════════════════════════════════════════════════════
// SHEETS ROUTES
// ═══════════════════════════════════════════════════════════
router.post('/sheets/read', requireAuth, (req, res, next) => getCtrl().sheetsRead(req, res, next));
router.post('/sheets/write', requireAuth, (req, res, next) => getCtrl().sheetsWrite(req, res, next));
router.post('/sheets/append', requireAuth, (req, res, next) => getCtrl().sheetsAppend(req, res, next));
router.post('/sheets/create', requireAuth, (req, res, next) => getCtrl().sheetsCreate(req, res, next));
router.get('/sheets/info/:id', requireAuth, (req, res, next) => getCtrl().sheetsInfo(req, res, next));
router.post('/sheets/report', requireAuth, (req, res, next) => getCtrl().sheetsReport(req, res, next));

export default router;
