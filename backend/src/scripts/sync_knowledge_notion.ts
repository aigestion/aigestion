import 'reflect-metadata';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { NotionManagerService } from '../services/notion-manager.service';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

async function syncKnowledge() {
    const notionManager = container.get<NotionManagerService>(TYPES.NotionManagerService);
    const knowledgeRoot = 'C:\\Users\\Alejandro\\.gemini\\antigravity\\knowledge';

    if (!fs.existsSync(knowledgeRoot)) {
        logger.error(`Knowledge root not found: ${knowledgeRoot}`);
        process.exit(1);
    }

    const items = fs.readdirSync(knowledgeRoot);
    logger.info(`Found ${items.length} potential knowledge items.`);

    for (const item of items) {
        const itemPath = path.join(knowledgeRoot, item);
        if (fs.statSync(itemPath).isDirectory()) {
            const metadataPath = path.join(itemPath, 'metadata.json');
            if (fs.existsSync(metadataPath)) {
                try {
                    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                    const title = metadata.title || item;
                    const summary = metadata.summary || 'No summary available.';
                    
                    logger.info(`Syncing: ${title}`);
                    await notionManager.createNeuralBrainEntry(title, summary, ['Knowledge', 'Nexus']);
                } catch (e: any) {
                    logger.error(`Failed to sync ${item}: ${e.message}`);
                }
            }
        }
    }
}

syncKnowledge().then(() => {
    logger.info('Knowledge sync sequence complete.');
    process.exit(0);
}).catch(err => {
    logger.error(`Fatal sync error: ${err.message}`);
    process.exit(1);
});
