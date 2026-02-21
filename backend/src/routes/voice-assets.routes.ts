import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { DanielaCallAgent } from '../services/daniela-call-agent.service';
import { logger } from '../utils/logger';

// ──────────────────────────────────────────────────────
// 🌌 Voice Assets Router — Serves Daniela's TTS audio
// For Tasker to download and play during active calls
// ──────────────────────────────────────────────────────

const router = express.Router();

/**
 * GET /voice-assets/:filename
 * Serves pre-generated TTS audio files for Daniela's voice calls.
 * Tasker downloads these and plays them through the phone speaker.
 */
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Security: only allow .mp3 files, no path traversal
    if (!filename.endsWith('.mp3') || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const audioDir = path.join(process.cwd(), 'uploads', 'voice-calls');
    const filePath = path.join(audioDir, filename);

    // Check file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Audio not found or expired' });
    }

    const stat = await fs.stat(filePath);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Cache-Control', 'private, max-age=1800'); // 30 min

    const stream = require('fs').createReadStream(filePath);
    stream.pipe(res);

    logger.info(`[VoiceAssets] 🔊 Served audio: ${filename}`);
  } catch (error) {
    logger.error(error, '[VoiceAssets] Error serving audio file');
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /voice-assets/call/:callId
 * Returns metadata about a call context (for Tasker to know what to do)
 */
router.get('/call/:callId', async (req, res) => {
  try {
    const callAgent = container.get<DanielaCallAgent>(TYPES.DanielaCallAgent);
    const ctx = callAgent.getCallContext(req.params.callId);

    if (!ctx) {
      return res.status(404).json({ error: 'Call context not found or expired' });
    }

    res.json({
      callId: ctx.callId,
      contactName: ctx.contact.name,
      phone: ctx.contact.phone,
      audioUrl: ctx.audioUrl,
      status: ctx.status,
      script: ctx.danielaScript,
    });
  } catch (error) {
    logger.error(error, '[VoiceAssets] Error fetching call context');
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /voice-assets/call/:callId/follow-up
 * Contact responded — generate AI follow-up audio
 * Body: { response: "ok gracias dile que..." }
 */
router.post('/call/:callId/follow-up', async (req, res) => {
  try {
    const { response } = req.body;
    if (!response) {
      return res.status(400).json({ error: 'Missing response text' });
    }

    const callAgent = container.get<DanielaCallAgent>(TYPES.DanielaCallAgent);
    const reply = await callAgent.generateFollowUpReply(req.params.callId, response);

    res.json({
      replyText: reply.replyText,
      audioUrl: reply.audioUrl,
    });
  } catch (error) {
    logger.error(error, '[VoiceAssets] Error generating follow-up');
    res.status(500).json({ error: 'Failed to generate follow-up' });
  }
});

export default router;
