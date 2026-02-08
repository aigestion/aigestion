import { injectable, inject } from 'inversify';
import axios from 'axios';
import mongoose from 'mongoose';
import { TYPES } from '../types';
import { PineconeService } from './pinecone.service';
import { getRedisClient } from '../cache/redis';
import { container } from '../config/inversify.config';
import { MalwareScannerService } from './malware-scanner.service';

@injectable()
export class HealthService {
  constructor(@inject(TYPES.PineconeService) private pineconeService: PineconeService) {}

  public async getDetailedHealth() {
    const results: any = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: [],
    };

    // 1. MongoDB Check
    const mongoStatus = mongoose.connection.readyState === 1 ? 'up' : 'down';
    results.checks.push({ name: 'mongodb', status: mongoStatus });
    if (mongoStatus === 'down') results.status = 'degraded';

    // 2. Redis Check
    try {
      const redisClient = getRedisClient();
      const ping = await redisClient.ping();
      results.checks.push({ name: 'redis', status: ping === 'PONG' ? 'up' : 'down' });
    } catch (err) {
      results.checks.push({ name: 'redis', status: 'down', error: (err as any).message });
      results.status = 'degraded';
    }

    // 3. Pinecone Check
    try {
      // Simple check to see if Pinecone can be reached
      const index = (this.pineconeService as any).index;
      results.checks.push({ name: 'pinecone', status: index ? 'up' : 'down' });
    } catch (err) {
      results.checks.push({ name: 'pinecone', status: 'down', error: (err as any).message });
      results.status = 'degraded';
    }

    // 4. NeuroCore (ML Service) Check
    try {
      const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://ml-service:5000';
      const mlResp = await axios.get(`${mlServiceUrl}/health`, { timeout: 2000 });
      results.checks.push({
        name: 'neurocore',
        status: mlResp.status === 200 ? 'up' : 'down',
        version: mlResp.data?.version || 'unknown',
      });
    } catch (err) {
      results.checks.push({ name: 'neurocore', status: 'down', error: (err as any).message });
      results.status = 'degraded';
    }

    // 5. Malware Engines Check
    try {
      const scanner = container.get<MalwareScannerService>(TYPES.MalwareScannerService);
      results.checks.push({
        name: 'malware-scanner',
        status: 'up',
        engines: {
          clamav: (scanner as any).isClamAVAvailable ? 'active' : 'inactive',
          yara: (scanner as any).isYARAAvailable ? 'active' : 'inactive',
        },
      });
    } catch (err) {
      results.checks.push({ name: 'malware-scanner', status: 'down' });
    }

    // 6. Memory Usage
    const memory = process.memoryUsage();
    results.metrics = {
      rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
    };

    return results;
  }
}
