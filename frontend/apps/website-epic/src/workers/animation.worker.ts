// Web Worker para cálculos complejos de animaciones
// Offload heavy computations from main thread

interface AnimationMessage {
  type: 'calculate_particles' | 'calculate_physics' | 'calculate_interpolation';
  data: any;
  id: string;
}

interface WorkerResponse {
  type: string;
  data: any;
  id: string;
}

// Particle system calculations
function calculateParticles(config: {
  count: number;
  bounds: { width: number; height: number };
  time: number;
  settings: {
    speed: number;
    spread: number;
    gravity: number;
    wind: number;
  };
}) {
  const { count, bounds, time, settings } = config;
  const particles = [];

  for (let i = 0; i < count; i++) {
    const baseAngle = (i / count) * Math.PI * 2;
    const speedVariation = 0.5 + Math.random() * 0.5;
    
    // Calculate position based on time and physics
    const x = Math.cos(baseAngle + time * settings.speed * speedVariation) * settings.spread;
    const y = Math.sin(baseAngle + time * settings.speed * speedVariation) * settings.spread;
    
    // Apply gravity and wind
    const gravityEffect = settings.gravity * time * time * 0.5;
    const windEffect = settings.wind * time;
    
    particles.push({
      id: i,
      x: x + windEffect,
      y: y + gravityEffect,
      vx: Math.cos(baseAngle) * settings.speed * speedVariation,
      vy: Math.sin(baseAngle) * settings.speed * speedVariation + settings.gravity * time,
      size: 2 + Math.random() * 4,
      opacity: 1 - (time / 10), // Fade out over 10 seconds
      color: `hsl(${180 + i * 2}, 70%, 50%)`, // Cyan to green gradient
    });
  }

  return particles;
}

// Physics calculations
function calculatePhysics(config: {
  objects: Array<{
    id: string;
    position: { x: number; y: number; z: number };
    velocity: { x: number; y: number; z: number };
    mass: number;
  }>;
  deltaTime: number;
  forces: Array<{
    type: 'gravity' | 'wind' | 'magnetic';
    strength: number;
    direction: { x: number; y: number; z: number };
  }>;
}) {
  const { objects, deltaTime, forces } = config;
  const updatedObjects = [];

  for (const obj of objects) {
    let totalForce = { x: 0, y: 0, z: 0 };
    
    // Calculate total force
    for (const force of forces) {
      let forceVector = { ...force.direction };
      
      switch (force.type) {
        case 'gravity':
          forceVector.y *= obj.mass * 9.81; // F = m * g
          break;
        case 'wind':
          // Wind force proportional to surface area (simplified)
          const windForce = force.strength * (1 + Math.random() * 0.2);
          forceVector.x *= windForce;
          forceVector.y *= windForce * 0.3;
          break;
        case 'magnetic':
          // Magnetic force based on distance (simplified)
          const distance = Math.sqrt(
            forceVector.x ** 2 + forceVector.y ** 2 + forceVector.z ** 2
          );
          const magneticForce = force.strength / (distance + 1);
          forceVector.x *= magneticForce;
          forceVector.y *= magneticForce;
          forceVector.z *= magneticForce;
          break;
      }
      
      totalForce.x += forceVector.x;
      totalForce.y += forceVector.y;
      totalForce.z += forceVector.z;
    }
    
    // Calculate acceleration (F = m * a, so a = F / m)
    const acceleration = {
      x: totalForce.x / obj.mass,
      y: totalForce.y / obj.mass,
      z: totalForce.z / obj.mass,
    };
    
    // Update velocity
    const newVelocity = {
      x: obj.velocity.x + acceleration.x * deltaTime,
      y: obj.velocity.y + acceleration.y * deltaTime,
      z: obj.velocity.z + acceleration.z * deltaTime,
    };
    
    // Update position
    const newPosition = {
      x: obj.position.x + newVelocity.x * deltaTime,
      y: obj.position.y + newVelocity.y * deltaTime,
      z: obj.position.z + newVelocity.z * deltaTime,
    };
    
    updatedObjects.push({
      ...obj,
      position: newPosition,
      velocity: newVelocity,
    });
  }

  return updatedObjects;
}

// Bezier curve interpolation
function calculateInterpolation(config: {
  points: Array<{ x: number; y: number; z: number }>;
  tension: number;
  segments: number;
}) {
  const { points, tension, segments } = config;
  const interpolatedPoints = [];

  if (points.length < 2) return points;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[Math.min(points.length - 1, i + 1)];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    for (let t = 0; t < segments; t++) {
      const normalizedT = t / segments;
      
      // Catmull-Rom spline interpolation
      const t2 = normalizedT * normalizedT;
      const t3 = t2 * normalizedT;
      
      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * normalizedT +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      );
      
      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * normalizedT +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      );
      
      const z = 0.5 * (
        (2 * p1.z) +
        (-p0.z + p2.z) * normalizedT +
        (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
        (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3
      );
      
      interpolatedPoints.push({
        x: x * tension + p1.x * (1 - tension),
        y: y * tension + p1.y * (1 - tension),
        z: z * tension + p1.z * (1 - tension),
      });
    }
  }

  // Add the last point
  interpolatedPoints.push(points[points.length - 1]);

  return interpolatedPoints;
}

// Complex mathematical calculations
function calculateComplexMath(config: {
  type: 'fourier' | 'fractal' | 'noise';
  params: any;
}) {
  const { type, params } = config;

  switch (type) {
    case 'fourier':
      return calculateFourierTransform(params);
    case 'fractal':
      return calculateFractal(params);
    case 'noise':
      return calculateNoise(params);
    default:
      return [];
  }
}

function calculateFourierTransform(params: {
  data: number[];
  sampleRate: number;
}) {
  const { data, sampleRate } = params;
  const N = data.length;
  const frequencies = [];

  for (let k = 0; k < N; k++) {
    let real = 0;
    let imag = 0;
    
    for (let n = 0; n < N; n++) {
      const angle = -2 * Math.PI * k * n / N;
      real += data[n] * Math.cos(angle);
      imag += data[n] * Math.sin(angle);
    }
    
    const magnitude = Math.sqrt(real * real + imag * imag);
    const frequency = k * sampleRate / N;
    
    frequencies.push({
      frequency,
      magnitude,
      phase: Math.atan2(imag, real),
    });
  }

  return frequencies;
}

function calculateFractal(params: {
  type: 'mandelbrot' | 'julia';
  width: number;
  height: number;
  maxIterations: number;
  zoom: number;
  centerX: number;
  centerY: number;
}) {
  const { type, width, height, maxIterations, zoom, centerX, centerY } = params;
  const pixels = [];

  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      const x0 = (px - width / 2) / zoom + centerX;
      const y0 = (py - height / 2) / zoom + centerY;
      
      let x = 0;
      let y = 0;
      let iteration = 0;
      
      if (type === 'mandelbrot') {
        while (x * x + y * y <= 4 && iteration < maxIterations) {
          const xtemp = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = xtemp;
          iteration++;
        }
      } else if (type === 'julia') {
        x = x0;
        y = y0;
        const cx = -0.7;
        const cy = 0.27015;
        
        while (x * x + y * y <= 4 && iteration < maxIterations) {
          const xtemp = x * x - y * y + cx;
          y = 2 * x * y + cy;
          x = xtemp;
          iteration++;
        }
      }
      
      pixels.push({
        x: px,
        y: py,
        value: iteration / maxIterations,
        color: iteration === maxIterations ? 0 : (iteration * 255 / maxIterations),
      });
    }
  }

  return pixels;
}

function calculateNoise(params: {
  type: 'perlin' | 'simplex';
  width: number;
  height: number;
  scale: number;
  octaves: number;
  persistence: number;
}) {
  const { type, width, height, scale, octaves, persistence } = params;
  const noise = [];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let amplitude = 1;
      let frequency = 1 / scale;
      let noiseValue = 0;
      let maxValue = 0;

      for (let i = 0; i < octaves; i++) {
        const sampleX = x * frequency;
        const sampleY = y * frequency;
        
        // Simplified noise function
        const value = Math.sin(sampleX * 12.9898 + sampleY * 78.233) * 43758.5453;
        const normalizedValue = value - Math.floor(value);
        
        noiseValue += normalizedValue * amplitude;
        maxValue += amplitude;
        
        amplitude *= persistence;
        frequency *= 2;
      }

      noise.push({
        x,
        y,
        value: noiseValue / maxValue,
      });
    }
  }

  return noise;
}

// Main worker message handler
self.addEventListener('message', (event: MessageEvent<AnimationMessage>) => {
  const { type, data, id } = event.data;

  try {
    let result: any;

    switch (type) {
      case 'calculate_particles':
        result = calculateParticles(data);
        break;
      case 'calculate_physics':
        result = calculatePhysics(data);
        break;
      case 'calculate_interpolation':
        result = calculateInterpolation(data);
        break;
      default:
        if (type.startsWith('math_')) {
          result = calculateComplexMath({
            type: type.replace('math_', '') as any,
            params: data,
          });
        } else {
          throw new Error(`Unknown message type: ${type}`);
        }
    }

    const response: WorkerResponse = {
      type: 'result',
      data: result,
      id,
    };

    self.postMessage(response);
  } catch (error) {
    const errorResponse: WorkerResponse = {
      type: 'error',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      id,
    };

    self.postMessage(errorResponse);
  }
});

// Handle worker termination
self.addEventListener('close', () => {
  console.log('Animation worker terminated');
});

export {};
