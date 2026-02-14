import { injectable } from 'inversify';
import { logger } from '../../utils/logger';

/**
 * SOVEREIGN KEPLER SERVICE
 * Manages Kepler.gl configurations for high-fidelity geospatial visualization.
 */
@injectable()
export class KeplerService {
  /**
   * Generates a standard Kepler.gl configuration based on the data type.
   */
  generateConfig(layerType: 'point' | 'arc' | 'hexagon' = 'point') {
    logger.info(`[KeplerService] Generating high-fidelity config for layer type: ${layerType}`);
    
    return {
      version: 'v1',
      config: {
        visState: {
          layers: [
            {
              id: 'sovereign-layer-1',
              type: layerType,
              config: {
                dataId: 'nexus-telemetry',
                label: 'Nexus Activity',
                color: [34, 211, 238], // Cyan-400
                columns: {
                  lat: 'lat',
                  lng: 'lng'
                },
                isVisible: true
              }
            }
          ],
          interactionConfig: {
            tooltip: {
              fieldsToShow: {
                'nexus-telemetry': ['agent', 'action', 'timestamp']
              },
              enabled: true
            }
          }
        },
        mapState: {
          bearing: 0,
          dragRotate: true,
          latitude: 40.4168,
          longitude: -3.7038,
          pitch: 0,
          zoom: 2
        }
      }
    };
  }

  /**
   * Formats BigQuery results for Kepler.gl ingestion.
   */
  formatData(rows: any[]) {
      return {
          fields: [
              { name: 'lat', format: '', type: 'real' },
              { name: 'lng', format: '', type: 'real' },
              { name: 'agent', format: '', type: 'string' },
              { name: 'action', format: '', type: 'string' },
              { name: 'timestamp', format: '', type: 'timestamp' }
          ],
          rows: rows.map(r => [
              r.lat || 0,
              r.lng || 0,
              r.agent,
              r.action,
              r.timestamp
          ])
      };
  }
}
