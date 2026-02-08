import fs from 'fs/promises';
import path from 'path';
import { vertexAIService } from '../services/google/vertex-ai.service';
import { logger } from '../utils/logger';

/**
 * Self-Documentation Script
 * Scans the src/services and src/routes directories and uses AI to generate an architecture overview.
 */
async function autoDocument() {
  const rootDir = path.resolve(__dirname, '../../');
  const servicesDir = path.join(rootDir, 'src/services');
  const routesDir = path.join(rootDir, 'src/routes');
  const artifactPath =
    'C:\\Users\\Alejandro\\.gemini\\antigravity\\brain\\c28c1882-fd44-4bf0-9109-65d5b6a4217c\\auto_architecture.md';

  try {
    logger.info('[AutoDoc] Starting self-documentation scan...');

    const serviceFiles = await fs.readdir(servicesDir);
    const routeFiles = await fs.readdir(routesDir);

    const context = `
      Current Services: ${serviceFiles.filter(f => f.endsWith('.ts')).join(', ')}
      Current Routes: ${routeFiles.filter(f => f.endsWith('.ts')).join(', ')}
    `;

    const prompt = `
      You are the AIGestion System Architect. Based on the following files, generate a concise technical summary of the new God Mode capabilities added recently.
      Focus on VoiceService, DocumentProcessorService, PineconeService, ElevenLabsService, and ContentFactoryService.
      Use professional markdown.
      Context: ${context}
    `;

    const documentation = await vertexAIService.generateText(prompt);

    await fs.writeFile(
      artifactPath,
      `# 🏛️ Auto-Generated System Architecture\n\n> Last updated: ${new Date().toLocaleString()}\n\n${documentation}`,
    );

    logger.info(`[AutoDoc] Documentation successfully written to ${artifactPath}`);
  } catch (error) {
    logger.error('[AutoDoc] Failed to auto-document:', error);
  }
}

// Run directly
autoDocument();

export { autoDocument };
