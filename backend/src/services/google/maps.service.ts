import { injectable } from 'inversify';
import { Client } from '@googlemaps/google-maps-services-js';
import { logger } from '../../utils/logger';

/**
 * SOVEREIGN MAPS SERVICE
 * Tactical geospatial intelligence and geocoding.
 */
@injectable()
export class MapsService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({});
  }

  /**
   * Geocodes an address to lat/lng coordinates for Tactical Radar.
   */
  async geocode(address: string) {
    logger.info(`[MapsService] Geocoding tactical objective: ${address}`);
    try {
      const resp = await this.client.geocode({
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY || '',
        },
        timeout: 2000,
      });

      if (resp.data.results.length > 0) {
        return resp.data.results[0].geometry.location;
      }
      throw new Error('No results found for tactical geocoding');
    } catch (error) {
      logger.error('[MapsService] Geocoding failure', error);
      throw error;
    }
  }

  /**
   * Generates a Static Map URL for visual situational awareness.
   */
  getStaticMapUrl(lat: number, lng: number, zoom: number = 13) {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${key}`;
  }

  /**
   * Tactical Radar: Analyzes local points of interest for strategic decisions.
   */
  async getLocalIntelligence(location: { lat: number; lng: number }, query: string = 'business') {
    logger.info(`[MapsService] Scanning local sector: ${location.lat},${location.lng}`);
    try {
      const resp = await this.client.placesNearby({
        params: {
          location: location,
          radius: 5000,
          keyword: query,
          key: process.env.GOOGLE_MAPS_API_KEY || '',
        },
      });
      return resp.data.results.slice(0, 5).map(p => ({
        name: p.name,
        rating: p.rating,
        vicinity: p.vicinity,
      }));
    } catch (error) {
      logger.error('[MapsService] Nearby scan failure', error);
      return [];
    }
  }
}
