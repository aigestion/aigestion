import 'reflect-metadata';
import { container } from '../config/inversify.config';
import { TYPES } from '../types';
import { SovereignNotionSync } from '../services/SovereignNotionSync';
import { logger } from '../utils/logger';

async function initDashboard() {
    const syncService = container.get<SovereignNotionSync>(TYPES.SovereignNotionSync);
    logger.info('🚀 Manual Dashboard Sync Triggered...');
    await syncService.syncDashboard();
}

initDashboard().then(() => {
    logger.info('Dashboard initialization complete.');
    process.exit(0);
}).catch(err => {
    logger.error(`Initialization failed: ${err.message}`);
    process.exit(1);
});
