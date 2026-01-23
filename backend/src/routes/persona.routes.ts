import { Router } from 'express';
import { createPersona, getMarketplacePersonas } from '../controllers/persona.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Protected routes
router.post('/', protect, createPersona);

// Public routes (Marketplace is public?)
// Requirements said "Marketplace". Usually requires auth to buy, but viewing might be public.
// Implementation plan didn't specify strict auth for GET, but let's assume public view is allowed for now,
// OR simpler to protect everything given the context of "Persona Management".
// Let's make it protected for now as verified in requirements "Create/View".
router.get('/marketplace', protect, getMarketplacePersonas);

export default router;
