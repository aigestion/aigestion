// Web Worker for intensive background calculations
export interface CalculationTask {
  readonly id: string;
  readonly type: 'analytics' | 'optimization' | 'rendering' | 'data-processing';
  readonly data: any;
  readonly priority: 'low' | 'medium' | 'high';
}

export interface CalculationResult {
  readonly id: string;
  readonly result: any;
  readonly error?: string;
  readonly executionTime: number;
}

// Analytics calculations
function calculateAnalytics(data: any[]): any {
  const startTime = performance.now();
  
  // Complex analytics calculations
  const metrics = {
    total: data.length,
    average: data.reduce((sum, item) => sum + (item.value || 0), 0) / data.length,
    median: calculateMedian(data.map(item => item.value || 0)),
    standardDeviation: calculateStandardDeviation(data.map(item => item.value || 0)),
    trends: calculateTrends(data),
    correlations: calculateCorrelations(data),
  };

  const executionTime = performance.now() - startTime;
  return { metrics, executionTime };
}

// 3D rendering optimizations
function optimizeRendering(sceneData: any): any {
  const startTime = performance.now();
  
  // LOD calculations
  const lodLevels = calculateLOD(sceneData.objects);
  
  // Frustum culling
  const visibleObjects = performFrustumCulling(sceneData.objects, sceneData.camera);
  
  // Instancing optimization
  const instancedObjects = optimizeInstancing(visibleObjects);
  
  const executionTime = performance.now() - startTime;
  return {
    lodLevels,
    visibleObjects: instancedObjects,
    optimizationRatio: instancedObjects.length / sceneData.objects.length,
    executionTime,
  };
}

// Data processing
function processData(data: any[]): any {
  const startTime = performance.now();
  
  // Complex data transformations
  const processed = data.map(item => ({
    ...item,
    normalized: normalizeValues(item),
    enriched: enrichData(item),
    indexed: createIndexes(item),
  }));
  
  const executionTime = performance.now() - startTime;
  return { processed, executionTime };
}

// Utility functions
function calculateMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
}

function calculateStandardDeviation(values: number[]): number {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function calculateTrends(data: any[]): any {
  // Simple trend analysis
  const values = data.map(item => item.value || 0);
  const trend = values[values.length - 1] - values[0];
  const direction = trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable';
  
  return { trend, direction, magnitude: Math.abs(trend) };
}

function calculateCorrelations(data: any[]): any {
  // Simplified correlation calculation
  const correlations = {};
  const keys = Object.keys(data[0] || {}).filter(key => typeof data[0][key] === 'number');
  
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const key1 = keys[i];
      const key2 = keys[j];
      const correlation = calculatePearsonCorrelation(
        data.map(item => item[key1]),
        data.map(item => item[key2])
      );
      correlations[`${key1}-${key2}`] = correlation;
    }
  }
  
  return correlations;
}

function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
  const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
  const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

function calculateLOD(objects: any[]): any {
  return objects.map(obj => ({
    ...obj,
    lod: {
      high: obj.geometry?.vertices?.length || 0,
      medium: Math.floor((obj.geometry?.vertices?.length || 0) * 0.5),
      low: Math.floor((obj.geometry?.vertices?.length || 0) * 0.25),
    },
  }));
}

function performFrustumCulling(objects: any[], camera: any): any[] {
  // Simplified frustum culling
  const frustum = calculateFrustum(camera);
  return objects.filter(obj => isInFrustum(obj, frustum));
}

function calculateFrustum(camera: any): any {
  // Simplified frustum calculation
  return {
    near: camera.near || 0.1,
    far: camera.far || 1000,
    fov: camera.fov || 75,
  };
}

function isInFrustum(object: any, frustum: any): boolean {
  // Simplified frustum test
  const distance = object.position?.z || 0;
  return distance >= frustum.near && distance <= frustum.far;
}

function optimizeInstancing(objects: any[]): any[] {
  // Group similar objects for instancing
  const groups = new Map();
  
  objects.forEach(obj => {
    const key = obj.type || 'default';
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(obj);
  });
  
  // Convert groups to instanced objects
  const instanced = [];
  for (const [type, group] of groups) {
    if (group.length > 1) {
      instanced.push({
        type,
        instanceCount: group.length,
        positions: group.map(obj => obj.position),
        rotations: group.map(obj => obj.rotation),
        scales: group.map(obj => obj.scale),
      });
    } else {
      instanced.push(group[0]);
    }
  }
  
  return instanced;
}

function normalizeValues(item: any): any {
  // Normalize numeric values to 0-1 range
  const normalized = { ...item };
  Object.keys(normalized).forEach(key => {
    if (typeof normalized[key] === 'number') {
      normalized[key] = Math.max(0, Math.min(1, normalized[key] / 100));
    }
  });
  return normalized;
}

function enrichData(item: any): any {
  // Add computed properties
  return {
    ...item,
    hash: hashObject(item),
    timestamp: Date.now(),
    enriched: true,
  };
}

function createIndexes(item: any): any {
  // Create search indexes
  return {
    ...item,
    searchable: Object.values(item).join(' ').toLowerCase(),
    tags: extractTags(item),
  };
}

function hashObject(obj: any): string {
  // Simple hash function
  return btoa(JSON.stringify(obj)).slice(0, 16);
}

function extractTags(item: any): string[] {
  // Extract tags from string properties
  const tags: string[] = [];
  Object.values(item).forEach(value => {
    if (typeof value === 'string') {
      tags.push(...value.split(' ').filter(word => word.length > 3));
    }
  });
  return [...new Set(tags)];
}

// Worker message handler
self.addEventListener('message', (event: MessageEvent<CalculationTask>) => {
  const task = event.data;
  let result: CalculationResult;

  try {
    switch (task.type) {
      case 'analytics':
        result = {
          id: task.id,
          result: calculateAnalytics(task.data),
          executionTime: 0,
        };
        break;
        
      case 'optimization':
        result = {
          id: task.id,
          result: optimizeRendering(task.data),
          executionTime: 0,
        };
        break;
        
      case 'data-processing':
        result = {
          id: task.id,
          result: processData(task.data),
          executionTime: 0,
        };
        break;
        
      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
    
    self.postMessage(result);
  } catch (error) {
    self.postMessage({
      id: task.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: 0,
    });
  }
});

// Export for testing
export {
  calculateAnalytics,
  optimizeRendering,
  processData,
};
