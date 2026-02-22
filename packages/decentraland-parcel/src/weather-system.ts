// Weather and Day/Night Cycle System for AIGestion Virtual Office
import { engine, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs';
import { Color4, Vector3 } from '@dcl/sdk/math';

interface WeatherState {
  type: 'clear' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';
  intensity: number; // 0-1
  temperature: number; // Celsius
  humidity: number; // 0-100
  windSpeed: number; // m/s
  windDirection: Vector3;
}

interface TimeOfDay {
  hour: number; // 0-23
  minute: number; // 0-59
  dayProgress: number; // 0-1
}

interface CelestialBody {
  entity: any;
  type: 'sun' | 'moon';
  basePosition: Vector3;
  orbitRadius: number;
  orbitSpeed: number;
  currentAngle: number;
}

export class WeatherSystem {
  private currentState: WeatherState;
  private currentTime: TimeOfDay;
  private celestialBodies: Map<string, CelestialBody> = new Map();
  private weatherEffects: any[] = [];
  private skyDome: any;
  private isInitialized: boolean = false;
  private timeScale: number = 60; // 1 real second = 1 game minute

  constructor() {
    this.currentState = {
      type: 'clear',
      intensity: 0.3,
      temperature: 22,
      humidity: 45,
      windSpeed: 5,
      windDirection: Vector3.create(1, 0, 0),
    };

    this.currentTime = {
      hour: 12,
      minute: 0,
      dayProgress: 0.5,
    };
  }

  // Initialize weather system
  initialize() {
    console.log('Weather System Initializing...');

    this.createSkyDome();
    this.createCelestialBodies();
    this.createWeatherEffects();
    this.startWeatherSimulation();
    this.startDayNightCycle();

    this.isInitialized = true;
    console.log('Weather System Ready!');
  }

  // Create sky dome
  private createSkyDome() {
    this.skyDome = engine.addEntity();
    Transform.create(this.skyDome, {
      position: Vector3.create(8, 50, 8),
      scale: Vector3.create(100, 100, 100),
    });
    MeshRenderer.setSphere(this.skyDome);
    this.updateSkyColor();
  }

  // Create sun and moon
  private createCelestialBodies() {
    // Sun
    const sun = engine.addEntity();
    Transform.create(sun, {
      position: Vector3.create(8, 30, 8),
      scale: Vector3.create(3, 3, 3),
    });
    MeshRenderer.setSphere(sun);
    Material.setPbrMaterial(sun, {
      albedoColor: Color4.create(1, 0.95, 0.8, 1),
      emissiveColor: Color4.create(1, 0.9, 0.6, 1),
      emissiveIntensity: 5,
    });

    this.celestialBodies.set('sun', {
      entity: sun,
      type: 'sun',
      basePosition: Vector3.create(8, 30, 8),
      orbitRadius: 40,
      orbitSpeed: 0.1,
      currentAngle: 0,
    });

    // Moon
    const moon = engine.addEntity();
    Transform.create(moon, {
      position: Vector3.create(8, 30, 8),
      scale: Vector3.create(2, 2, 2),
    });
    MeshRenderer.setSphere(moon);
    Material.setPbrMaterial(moon, {
      albedoColor: Color4.create(0.9, 0.9, 1, 1),
      emissiveColor: Color4.create(0.6, 0.6, 0.8, 0.8),
      emissiveIntensity: 2,
    });

    this.celestialBodies.set('moon', {
      entity: moon,
      type: 'moon',
      basePosition: Vector3.create(8, 30, 8),
      orbitRadius: 40,
      orbitSpeed: 0.1,
      currentAngle: 180,
    });
  }

  // Create weather effects
  private createWeatherEffects() {
    // Create rain particles
    this.createRainEffect();

    // Create cloud system
    this.createCloudSystem();

    // Create fog effect
    this.createFogEffect();

    // Create snow effect
    this.createSnowEffect();
  }

  // Create rain effect
  private createRainEffect() {
    for (let i = 0; i < 100; i++) {
      const rainDrop = engine.addEntity();
      Transform.create(rainDrop, {
        position: Vector3.create(Math.random() * 16, Math.random() * 20 + 10, Math.random() * 16),
        scale: Vector3.create(0.02, 0.2, 0.02),
      });
      MeshRenderer.setBox(rainDrop);
      Material.setPbrMaterial(rainDrop, {
        albedoColor: Color4.create(0.6, 0.7, 0.9, 0.7),
        emissiveColor: Color4.create(0.4, 0.5, 0.8, 0.5),
        emissiveIntensity: 1,
      });

      this.weatherEffects.push({
        entity: rainDrop,
        type: 'rain',
        velocity: Vector3.create(0, -8, 0),
      });
    }
  }

  // Create cloud system
  private createCloudSystem() {
    for (let i = 0; i < 20; i++) {
      const cloud = engine.addEntity();
      Transform.create(cloud, {
        position: Vector3.create(Math.random() * 16, Math.random() * 10 + 15, Math.random() * 16),
        scale: Vector3.create(
          Math.random() * 3 + 2,
          Math.random() * 1 + 0.5,
          Math.random() * 3 + 2
        ),
      });
      MeshRenderer.setBox(cloud);
      Material.setPbrMaterial(cloud, {
        albedoColor: Color4.create(0.9, 0.9, 0.9, 0.8),
        roughness: 0.8,
        metallic: 0.1,
      });

      this.weatherEffects.push({
        entity: cloud,
        type: 'cloud',
        velocity: Vector3.create((Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5),
      });
    }
  }

  // Create fog effect
  private createFogEffect() {
    const fogVolume = engine.addEntity();
    Transform.create(fogVolume, {
      position: Vector3.create(8, 2, 8),
      scale: Vector3.create(20, 4, 20),
    });
    MeshRenderer.setBox(fogVolume);
    Material.setPbrMaterial(fogVolume, {
      albedoColor: Color4.create(0.8, 0.8, 0.85, 0.3),
      emissiveColor: Color4.create(0.7, 0.7, 0.75, 0.2),
      emissiveIntensity: 0.5,
    });

    this.weatherEffects.push({
      entity: fogVolume,
      type: 'fog',
      velocity: Vector3.create(0, 0, 0),
    });
  }

  // Create snow effect
  private createSnowEffect() {
    for (let i = 0; i < 50; i++) {
      const snowFlake = engine.addEntity();
      Transform.create(snowFlake, {
        position: Vector3.create(Math.random() * 16, Math.random() * 20 + 10, Math.random() * 16),
        scale: Vector3.create(0.1, 0.1, 0.1),
      });
      MeshRenderer.setSphere(snowFlake);
      Material.setPbrMaterial(snowFlake, {
        albedoColor: Color4.create(1, 1, 1, 0.9),
        emissiveColor: Color4.create(0.8, 0.8, 1, 0.6),
        emissiveIntensity: 1,
      });

      this.weatherEffects.push({
        entity: snowFlake,
        type: 'snow',
        velocity: Vector3.create((Math.random() - 0.5) * 0.5, -1, (Math.random() - 0.5) * 0.5),
      });
    }
  }

  // Start weather simulation
  private startWeatherSimulation() {
    engine.addSystem(() => {
      if (!this.isInitialized) return;

      this.updateWeatherEffects();
      this.simulateWeatherChanges();
    });
  }

  // Start day/night cycle
  private startDayNightCycle() {
    engine.addSystem(() => {
      if (!this.isInitialized) return;

      this.updateTimeOfDay();
      this.updateCelestialBodies();
      this.updateSkyColor();
    });
  }

  // Update time of day
  private updateTimeOfDay() {
    // Advance time based on time scale
    this.currentTime.minute += 1 / 60; // 1 frame = 1 second at 60fps

    if (this.currentTime.minute >= 60) {
      this.currentTime.minute = 0;
      this.currentTime.hour++;

      if (this.currentTime.hour >= 24) {
        this.currentTime.hour = 0;
      }
    }

    // Calculate day progress (0-1)
    this.currentTime.dayProgress = (this.currentTime.hour * 60 + this.currentTime.minute) / 1440;
  }

  // Update celestial bodies positions
  private updateCelestialBodies() {
    this.celestialBodies.forEach(body => {
      // Calculate position based on time of day
      const angle = ((this.currentTime.dayProgress * 360 - 90) * Math.PI) / 180;

      const x = body.basePosition.x + Math.cos(angle) * body.orbitRadius;
      const y = body.basePosition.y + Math.sin(angle) * body.orbitRadius;
      const z = body.basePosition.z;

      const transform = Transform.getMutable(body.entity);
      transform.position = Vector3.create(x, y, z);

      // Update visibility based on position
      const isVisible = y > body.basePosition.y;
      transform.scale = isVisible
        ? Vector3.create(
            body.type === 'sun' ? 3 : 2,
            body.type === 'sun' ? 3 : 2,
            body.type === 'sun' ? 3 : 2
          )
        : Vector3.create(0, 0, 0);
    });
  }

  // Update sky color based on time and weather
  private updateSkyColor() {
    let skyColor: Color4;
    const hour = this.currentTime.hour;

    // Calculate base sky color based on time
    if (hour >= 6 && hour < 12) {
      // Morning
      const progress = (hour - 6) / 6;
      skyColor = Color4.lerp(
        Color4.create(0.8, 0.6, 0.4, 1), // Dawn
        Color4.create(0.5, 0.7, 1, 1), // Day
        progress
      );
    } else if (hour >= 12 && hour < 18) {
      // Afternoon
      skyColor = Color4.create(0.5, 0.7, 1, 1); // Day
    } else if (hour >= 18 && hour < 21) {
      // Evening
      const progress = (hour - 18) / 3;
      skyColor = Color4.lerp(
        Color4.create(0.5, 0.7, 1, 1), // Day
        Color4.create(0.2, 0.3, 0.6, 1), // Dusk
        progress
      );
    } else {
      // Night
      skyColor = Color4.create(0.05, 0.05, 0.2, 1); // Night
    }

    // Apply weather modifications
    skyColor = this.applyWeatherToSkyColor(skyColor);

    if (this.skyDome) {
      Material.setPbrMaterial(this.skyDome, {
        albedoColor: skyColor,
        emissiveColor: Color4.create(skyColor.r * 0.3, skyColor.g * 0.3, skyColor.b * 0.3, 1),
        emissiveIntensity: 1,
      });
    }
  }

  // Apply weather effects to sky color
  private applyWeatherToSkyColor(baseColor: Color4): Color4 {
    switch (this.currentState.type) {
      case 'cloudy':
        return Color4.lerp(
          baseColor,
          Color4.create(0.6, 0.6, 0.6, 1),
          this.currentState.intensity * 0.7
        );
      case 'rainy':
      case 'stormy':
        return Color4.lerp(
          baseColor,
          Color4.create(0.3, 0.3, 0.4, 1),
          this.currentState.intensity * 0.8
        );
      case 'foggy':
        return Color4.lerp(
          baseColor,
          Color4.create(0.7, 0.7, 0.75, 1),
          this.currentState.intensity * 0.6
        );
      default:
        return baseColor;
    }
  }

  // Update weather effects
  private updateWeatherEffects() {
    this.weatherEffects.forEach(effect => {
      const transform = Transform.getMutable(effect.entity);

      // Update position based on velocity
      transform.position = Vector3.add(transform.position, Vector3.scale(effect.velocity, 0.016));

      // Reset position if out of bounds
      if (effect.type === 'rain' || effect.type === 'snow') {
        if (transform.position.y < 0) {
          transform.position.y = 30;
          transform.position.x = Math.random() * 16;
          transform.position.z = Math.random() * 16;
        }
      } else if (effect.type === 'cloud') {
        // Wrap clouds around
        if (transform.position.x > 20) transform.position.x = -4;
        if (transform.position.x < -4) transform.position.x = 20;
        if (transform.position.z > 20) transform.position.z = -4;
        if (transform.position.z < -4) transform.position.z = 20;
      }

      // Update visibility based on weather state
      const shouldBeVisible = this.isEffectVisible(effect.type);
      transform.scale = shouldBeVisible ? Vector3.create(1, 1, 1) : Vector3.create(0, 0, 0);
    });
  }

  // Check if effect should be visible
  private isEffectVisible(effectType: string): boolean {
    switch (effectType) {
      case 'rain':
        return this.currentState.type === 'rainy' || this.currentState.type === 'stormy';
      case 'cloud':
        return (
          this.currentState.type === 'cloudy' ||
          this.currentState.type === 'rainy' ||
          this.currentState.type === 'stormy'
        );
      case 'fog':
        return this.currentState.type === 'foggy';
      case 'snow':
        return this.currentState.type === 'snowy';
      default:
        return false;
    }
  }

  // Simulate weather changes
  private simulateWeatherChanges() {
    // Random weather changes every 30 seconds
    if (Math.random() > 0.9995) {
      this.changeWeather();
    }
  }

  // Change weather
  public changeWeather(newWeather?: Partial<WeatherState>) {
    if (newWeather) {
      this.currentState = { ...this.currentState, ...newWeather };
    } else {
      // Random weather change
      const weatherTypes: WeatherState['type'][] = ['clear', 'cloudy', 'rainy', 'stormy', 'foggy'];
      this.currentState.type = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      this.currentState.intensity = Math.random() * 0.8 + 0.2;
      this.currentState.temperature = 15 + Math.random() * 20;
      this.currentState.humidity = 30 + Math.random() * 60;
      this.currentState.windSpeed = Math.random() * 15;
    }

    console.log(
      `Weather changed to: ${this.currentState.type} (intensity: ${this.currentState.intensity.toFixed(2)})`
    );
  }

  // Get current weather state
  public getCurrentWeather(): WeatherState {
    return { ...this.currentState };
  }

  // Get current time
  public getCurrentTime(): TimeOfDay {
    return { ...this.currentTime };
  }

  // Set time of day
  public setTimeOfDay(hour: number, minute: number = 0) {
    this.currentTime.hour = Math.max(0, Math.min(23, hour));
    this.currentTime.minute = Math.max(0, Math.min(59, minute));
    this.currentTime.dayProgress = (this.currentTime.hour * 60 + this.currentTime.minute) / 1440;
  }

  // Set time scale
  public setTimeScale(scale: number) {
    this.timeScale = Math.max(0.1, Math.min(1000, scale));
  }

  // Get weather forecast
  public getForecast(): WeatherState[] {
    const forecast: WeatherState[] = [];
    const baseWeather = { ...this.currentState };

    for (let i = 1; i <= 24; i++) {
      const hour = (this.currentTime.hour + i) % 24;
      let weatherType: WeatherState['type'];

      // Simple forecast logic
      if (hour >= 6 && hour < 12) {
        weatherType = Math.random() > 0.7 ? 'cloudy' : 'clear';
      } else if (hour >= 12 && hour < 18) {
        weatherType = Math.random() > 0.8 ? 'rainy' : 'clear';
      } else {
        weatherType = Math.random() > 0.6 ? 'clear' : 'cloudy';
      }

      forecast.push({
        ...baseWeather,
        type: weatherType,
        intensity: Math.random() * 0.8 + 0.2,
        temperature: baseWeather.temperature + (Math.random() - 0.5) * 10,
      });
    }

    return forecast;
  }

  // Cleanup system
  public cleanup() {
    this.celestialBodies.forEach(body => {
      engine.removeEntity(body.entity);
    });
    this.celestialBodies.clear();

    this.weatherEffects.forEach(effect => {
      engine.removeEntity(effect.entity);
    });
    this.weatherEffects = [];

    if (this.skyDome) {
      engine.removeEntity(this.skyDome);
    }

    this.isInitialized = false;
  }
}

// Export singleton instance
export const weatherSystem = new WeatherSystem();
