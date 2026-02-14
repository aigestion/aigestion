import { injectable } from 'inversify';

@injectable()
export class DiscoveryService {
  async discoverTrendingTech(query: string) {
    return { topRepos: [], recommendation: 'nexus-module-placeholder' };
  }
}
