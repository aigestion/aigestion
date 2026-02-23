import { injectable } from 'inversify';
import axios from 'axios';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';
import { getCache, setCache } from '../cache/redis';

const CACHE_TTL = 1800; // 30 minutes for weather data

/**
 * SOVEREIGN WEATHER SERVICE
 * Sensory perception for environmental awareness and regional intelligence.
 */
@injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = env.OPENWEATHER_API_KEY || '';
  }

  /**
   * Retrieves current weather for a specific location.
   */
  async getCurrentWeather(location: string) {
    if (!this.apiKey) {
      throw new Error('OPENWEATHER_API_KEY is not configured');
    }

    const cacheKey = `weather:current:${Buffer.from(location).toString('base64')}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    logger.info(`[WeatherService] Sensing environment in: ${location}`);
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: 'metric',
          lang: 'es'
        }
      });

      const data = {
        city: response.data.name,
        temp: response.data.main.temp,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        wind_speed: response.data.wind.speed,
        timestamp: new Date().toISOString()
      };

      await setCache(cacheKey, data, CACHE_TTL);
      return data;
    } catch (error: any) {
      logger.error('[WeatherService] Sensory failure', { 
        location, 
        message: error.response?.data?.message || error.message 
      });
      throw new Error(`Failed to retrieve weather: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Retrieves current weather by coordinates.
   */
  async getWeatherByCoords(lat: number, lon: number) {
    if (!this.apiKey) {
      throw new Error('OPENWEATHER_API_KEY is not configured');
    }

    const cacheKey = `weather:coords:${lat},${lon}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    logger.info(`[WeatherService] Sensing environment at coords: ${lat}, ${lon}`);
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'es'
        }
      });

      const data = {
        city: response.data.name,
        temp: response.data.main.temp,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        wind_speed: response.data.wind.speed,
        timestamp: new Date().toISOString()
      };

      await setCache(cacheKey, data, CACHE_TTL);
      return data;
    } catch (error: any) {
      logger.error('[WeatherService] Sensory failure at coords', { 
        lat, lon, 
        message: error.response?.data?.message || error.message 
      });
      throw new Error(`Failed to retrieve weather by coords: ${error.response?.data?.message || error.message}`);
    }
  }
}
