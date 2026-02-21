// src/routes/phone-action.routes.ts
import { Router } from 'express';
import { executePhoneAction, listContacts, addContact } from '../controllers/phone-action.controller';

/**
 * 🌌 [GOD MODE] Phone Action Routes
 * Sovereign endpoints for Daniela Call Bridge & SMS.
 */
const router = Router();

// Execute a phone action (call or sms)
router.post('/phone-action', executePhoneAction);

// Manage sovereign contacts
router.get('/contacts', listContacts);
router.post('/contacts', addContact);

export default router;
