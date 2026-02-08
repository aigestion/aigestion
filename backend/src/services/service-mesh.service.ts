import { injectable } from 'inversify';
import { logger } from '../utils/logger';

@injectable()
export class ServiceMeshService {
  /**
   * Generates a basic Istio VirtualService configuration for a given service.
   */
  generateVirtualService(serviceName: string, host: string, subset: string = 'v1'): string {
    const yaml = `
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ${serviceName}
spec:
  hosts:
  - "${host}"
  http:
  - route:
    - destination:
        host: ${serviceName}
        subset: ${subset}
    retries:
      attempts: 3
      perTryTimeout: 2s
    timeout: 10s
`;
    return yaml.trim();
  }

  /**
   * Generates a DestinationRule for circuit breaking.
   */
  generateDestinationRule(serviceName: string): string {
    const yaml = `
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: ${serviceName}
spec:
  host: ${serviceName}
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 1024
        maxRequestsPerConnection: 10
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
`;
    return yaml.trim();
  }

  /**
   * Scaffolds a full mesh config for the AIGestion backend.
   */
  scaffoldMeshConfig(): any {
    logger.info('[ServiceMesh] Generating scaffolding for backend services...');

    return {
      'backend-vs.yaml': this.generateVirtualService('nexus-backend', 'api.nexus.com'),
      'backend-dr.yaml': this.generateDestinationRule('nexus-backend'),
      'rag-core-vs.yaml': this.generateVirtualService('rag-core', 'rag.nexus.internal'),
      'ml-service-vs.yaml': this.generateVirtualService('ml-service', 'ai.nexus.internal'),
    };
  }
}
