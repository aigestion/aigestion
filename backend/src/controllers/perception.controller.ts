import { Request, Response, NextFunction } from 'express';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { WeatherService } from '../services/weather.service';
import { MapsService } from '../services/google/maps.service';
import { BrowserlessService } from '../services/browserless.service';
import { logger } from '../utils/logger';

@controller('/perception')
export class PerceptionController {
  constructor(
    @inject(TYPES.WeatherService) private weatherService: WeatherService,
    @inject(TYPES.MapsService) private mapsService: MapsService,
    @inject(TYPES.BrowserlessService) private browserlessService: BrowserlessService,
  ) {}

  @httpGet('/weather')
  async getWeather(req: Request, res: Response, next: NextFunction) {
    try {
      const { location, lat, lon } = req.query;
      
      if (lat && lon) {
        const result = await this.weatherService.getWeatherByCoords(Number(lat), Number(lon));
        return res.json(result);
      }

      if (location) {
        const result = await this.weatherService.getCurrentWeather(location as string);
        return res.json(result);
      }

      return res.status(400).json({ error: 'location or lat/lon required' });
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/maps/geocode')
  async geocode(req: Request, res: Response, next: NextFunction) {
    try {
      const { address } = req.query;
      if (!address) {
        return res.status(400).json({ error: 'address is required' });
      }
      const result = await this.mapsService.geocode(address as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/maps/nearby')
  async getNearby(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lng, query } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ error: 'lat and lng are required' });
      }
      const result = await this.mapsService.getLocalIntelligence(
        { lat: Number(lat), lng: Number(lng) },
        query as string
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  @httpPost('/navigate')
  async navigate(req: Request, res: Response, next: NextFunction) {
    let browser;
    try {
      const { url, extractContent = true } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'url is required' });
      }

      logger.info(`[PerceptionController] Tactical navigation to: ${url}`);
      browser = await this.browserlessService.connect();
      const page = await this.browserlessService.setupPage(browser);
      await this.browserlessService.navigate(page, url);

      let content = null;
      if (extractContent) {
        content = await page.evaluate(() => ({
          title: document.title,
          text: document.body.innerText.substring(0, 10000), // Clip for LLM
          html: document.documentElement.outerHTML.substring(0, 5000)
        }));
      }

      res.json({ success: true, url, content });
    } catch (error) {
      next(error);
    } finally {
      if (browser) await browser.close();
    }
  }
}
