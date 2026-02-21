import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { logger } from '../../utils/logger';
import { FirebaseService } from './firebase.service';
import { RagService } from '../rag.service';

/**
 * NEURAL HOME BRIDGE
 * Connects the Nexus Intelligence to the physical environment via IoT / Home Assistant.
 */
@injectable()
export class NeuralHomeBridge {
  constructor(
    @inject(TYPES.FirebaseService) private readonly firebase: FirebaseService,
    @inject(TYPES.RagService) private readonly rag: RagService,
  ) {}

  /**
   * Syncs the physical office state with Nexus telemetry.
   */
  async syncAmbientState(level: 'low' | 'medium' | 'critical') {
    logger.info(`[NeuralHome] Syncing ambient state to level: ${level}`);

    // High-performance light/signal triggers via Home Assistant API (Simulated)
    const color = level === 'critical' ? '#ff0000' : level === 'medium' ? '#4f46e5' : '#22c55e';

    logger.info(`[NeuralHome] Ambient Color Sync: ${color}`);

    // Log to Firebase so the UI dashboard matches the physical state
    await this.firebase.pushAlert('nexus_global', {
      type: 'AMBIENT_SYNC',
      level,
      color,
      source: 'NeuralHomeBridge',
    });
  }

  /**
   * [GOD MODE] Physical Handshake
   * Triggers a visual/audible confirmation in the physical room when a critical decision is made.
   */
  async triggerDecisionSignal() {
    logger.info('[NeuralHome] Physical Handshake Signal Dispatched.');
    // Simulated Home Assistant Service Call
  }

  /**
   * Ingests a physical event into the AI's neural context.
   * This bridges Home Assistant/n8n events directly into ChromaDB.
   */
  async ingestIoTEvent(event: string, source: string, data: any) {
    logger.info(`[NeuralHome] Ingesting IoT event: ${event} from ${source}`);

    const content = `IoT Event: ${event}\nSource: ${source}\nTimestamp: ${new Date().toISOString()}\nDetails: ${JSON.stringify(data, null, 2)}`;
    const filename = `iot_event_${Date.now()}.txt`;
    const tags = ['iot', source, event];

    // Ingest into RAG context
    await this.rag.ingestDocument(filename, content, tags);

    // Sync ambient state if it's a critical event
    if (event.toLowerCase().includes('critical') || event.toLowerCase().includes('alert')) {
      await this.syncAmbientState('critical');
    }

    return { ingested: true, filename };
  }
}
