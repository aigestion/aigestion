import { Request, Response } from 'express';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { HomeAssistantService } from '../services/iot/home-assistant.service';
import { User } from '../models/User';
import { logger } from '../utils/logger';

@controller('/api/iot')
export class IoTController {
  constructor(@inject(HomeAssistantService) private haService: HomeAssistantService) {}

  @httpPost('/connect')
  async connect(req: Request, res: Response) {
    const { baseUrl, accessToken } = req.body;

    // Validate inputs
    if (!baseUrl || !accessToken) {
      return res.status(400).json({ success: false, message: 'URL and Token are required' });
    }

    const isValid = await this.haService.validateConnection({ baseUrl, accessToken });

    if (isValid) {
      // Save to database for this user
      const request = req as any;
      if (request.user) {
        const user = await User.findById(request.user.id);
        if (user) {
          user.haBaseUrl = baseUrl;
          user.haAccessToken = accessToken;
          await user.save();
        }
      }
      return res.json({
        success: true,
        message: 'Successfully connected and saved Home Assistant credentials',
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: 'Could not connect. Check credentials.' });
    }
  }

  @httpGet('/devices')
  async getDevices(req: Request, res: Response) {
    const request = req as any;
    let haUrl = req.headers['x-ha-url'] as string;
    let haToken = req.headers['x-ha-token'] as string;

    // Fallback to DB if user is logged in
    if (!haUrl && request.user) {
      const user = await User.findById(request.user.id).select('+haAccessToken');
      if (user?.haBaseUrl && user?.haAccessToken) {
        haUrl = user.haBaseUrl;
        haToken = user.haAccessToken;
      }
    }

    if (!haUrl || !haToken) {
      return res
        .status(400)
        .json({ success: false, message: 'Home Assistant not configured for this user' });
    }

    const config = { baseUrl: haUrl, accessToken: haToken };

    try {
      const states = await this.haService.getStates(config);
      // Filter for relevant domains (light, switch, camera, sensor, climate)
      const relevantDomains = ['light', 'switch', 'camera', 'sensor', 'climate', 'lock', 'cover'];
      const devices = states.filter(s => relevantDomains.includes(s.entity_id.split('.')[0]));

      return res.json({ success: true, count: devices.length, data: devices });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  @httpPost('/control')
  async controlDevice(req: Request, res: Response) {
    const { domain, service, serviceData } = req.body;
    const request = req as any;
    let haUrl = req.headers['x-ha-url'] as string;
    let haToken = req.headers['x-ha-token'] as string;

    if (!haUrl && request.user) {
      const user = await User.findById(request.user.id).select('+haAccessToken');
      haUrl = user?.haBaseUrl || '';
      haToken = user?.haAccessToken || '';
    }

    if (!haUrl || !haToken) {
      return res.status(400).json({ success: false, message: 'Home Assistant not configured' });
    }

    try {
      await this.haService.callService(
        { baseUrl: haUrl, accessToken: haToken },
        domain,
        service,
        serviceData,
      );
      return res.json({ success: true, message: 'Command executed' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
