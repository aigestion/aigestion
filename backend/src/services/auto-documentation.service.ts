import fs from 'fs/promises';
import { inject, injectable } from 'inversify';
import path from 'path';
import { TYPES } from '../types';
import { logger } from '../utils/logger';
import { AIService } from './ai.service';

@injectable()
export class AutoDocumentationService {
    constructor(
        @inject(TYPES.AIService) private aiService: AIService
    ) {}

    /**
     * Generates a README/documentation for a specific file or directory.
     */
    async generateDocs(targetPath: string): Promise<string> {
        logger.info(`[AutoDoc] Generating documentation for ${targetPath}`);

        try {
            const stats = await fs.stat(targetPath);
            let content = '';

            if (stats.isFile()) {
                content = await fs.readFile(targetPath, 'utf8');
            } else {
                const files = await fs.readdir(targetPath);
                content = `Directory contains: ${files.join(', ')}`;
            }

            const prompt = `Generate a technical documentation for the following code or directory: ${content}. Use Markdown format. Focus on architecture, usage, and dependencies.`;
            const docs = await this.aiService.generateContent(prompt, 'system', 'tech_writer');

            return docs;
        } catch (error) {
            logger.error(`[AutoDoc] Error generating docs: ${error}`);
            return 'Failed to generate documentation.';
        }
    }

    /**
     * Saves generated documentation to a file.
     */
    async saveDocs(targetPath: string, docContent: string): Promise<void> {
        const docFileName = `${path.basename(targetPath)}.docs.md`;
        const docFilePath = path.join(path.dirname(targetPath), docFileName);

        await fs.writeFile(docFilePath, docContent);
        logger.info(`[AutoDoc] Saved documentation to ${docFilePath}`);
    }
}
