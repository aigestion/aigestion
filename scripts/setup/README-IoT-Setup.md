# 🏠 IoT & Sovereign Bridge Setup Guide for AIGestion

## 📋 Overview

Guía completa para la configuración de IoT y dispositivos inteligentes en AIGestion. Esta guía te permitirá integrar Home Assistant y tu Pixel 8 para crear un ecosistema de automatización inteligente nivel Dios.

## 🎯 Servicios Soportados

### 1. **Home Assistant** 🏠
- **Tipo**: Smart Home Hub & Automation Platform
- **Uso**: Control centralizado de dispositivos inteligentes
- **Integración**: REST API, WebSocket, MQTT

### 2. **Pixel 8 Tasker** 📱
- **Tipo**: Mobile Device Automation
- **Uso**: Automatización avanzada en dispositivo móvil
- **Integración**: Webhook API, AutoTools, Tasker Plugins

## 🚀 Configuración Rápida

### Opción 1: Automática (Recomendada)

```powershell
# Ejecutar script automatizado
.\scripts\setup\get-iot-credentials.ps1 -Mode interactive

# Modo Dios (configuración completa)
.\scripts\setup\get-iot-credentials.ps1 -Mode god

# Modo batch para todos los servicios
.\scripts\setup\get-iot-credentials.ps1 -Mode batch -Service all
```

### Opción 2: Manual

1. **Copia las credenciales** del template `iot-credentials-template.txt`
2. **Pégalas en tu archivo `.env`**
3. **Reemplaza los valores de ejemplo** con tus credenciales reales
4. **Ejecuta el test de validación**:
   ```powershell
   .\scripts\setup\get-iot-credentials.ps1 -Mode test
   ```

## 🔥 MODO DIOS - Configuración Extrema

El Modo Dios de AIGestion para IoT incluye:

### 🎮 Características Extremas
- **Control total del hogar** desde AIGestion
- **Integración perfecta** con Pixel 8 Pro
- **IA para automatización** predictiva
- **Sincronización bidireccional** en tiempo real
- **Escenas cinematográficas** con efectos especiales
- **Control por voz y gestos**
- **Dashboard unificado** de IoT
- **Seguridad enterprise** para dispositivos

### ⚡ Activación

```powershell
# Activar Modo Dios
.\scripts\setup\get-iot-credentials.ps1 -Mode god

# Verificar configuración
.\scripts\setup\get-iot-credentials.ps1 -Mode test
```

## 📋 Guías Detalladas por Servicio

### 🏠 Home Assistant Setup

#### 1. Instalación de Home Assistant
```bash
# Opción A: Home Assistant OS (Recomendado)
# Descarga la imagen para tu dispositivo (Raspberry Pi, NUC, etc.)
# Flash en SD card y arranca

# Opción B: Home Assistant Container (Docker)
docker run -d --name homeassistant --restart=unless-stopped \
  -p 8123:8123 \
  -v /path/to/config:/config \
  homeassistant/home-assistant:stable

# Opción C: Home Assistant Core (Python)
pip3 install homeassistant
hass --config /path/to/config --open-ui
```

#### 2. Configuración Básica
1. **Accede a Home Assistant**: http://homeassistant.local:8123
2. **Crea tu cuenta** de usuario
3. **Configura nombre y ubicación** de tu hogar
4. **Detecta dispositivos** automáticamente

#### 3. Generar Long-Lived Access Token
1. Ve a **Perfil de usuario** (esquina inferior izquierda)
2. **Scroll hasta abajo** hasta "Long-Lived Access Tokens"
3. **Click "Create Token"**
4. **Nombra el token**: "AIGestion Integration"
5. **Copia el token** (no podrás verlo de nuevo)

#### 4. Configurar Variables
```bash
HA_URL=http://homeassistant.local:8123
HA_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI4YjQ4NjY5ZjQzNzA0NzE5YjJmNzAwNzE4ZThkOWI2ZSIsInN1YiI6Imhvc3RfZmU3ZjUzZjAtNjQ4Zi00MjA4LWI5YzktNzA3NjMzZmY4ZjU2IiwiaWF0IjoxNjM5NTQ2MDAwLCJleHAiOjE5NTQ5MDYwMDAsImp0aSI6IjEyMzQ1Njc4OTAifQ.abc123def456...
```

#### 5. Configurar Dispositivos
```yaml
# configuration.yaml
light:
  - platform: philips_hue
    host: 192.168.1.100

climate:
  - platform: nest
    client_id: your_client_id
    client_secret: your_client_secret

sensor:
  - platform: mqtt
    state_topic: "home/sensor/temperature"
    name: "Temperatura"
    unit_of_measurement: "°C"

automation:
  - alias: "Bienvenida"
    trigger:
      - platform: state
        entity_id: person.juan
        to: "home"
    action:
      - service: light.turn_on
        entity_id: light.entrada
      - service: media_player.play_media
        entity_id: media_player.speaker
        data:
          media_content_id: "bienvenida"
          media_content_type: "music"
```

#### 6. Webhook Configuration
```yaml
# configuration.yaml
rest_command:
  aigestion_webhook:
    url: "https://aigestion.net/api/webhooks/ha"
    method: POST
    headers:
      Authorization: "Bearer {{ ha_token }}"
    payload: '{"command": "{{ command }}", "device": "{{ device }}"}'

webhook_id: aigestion_integration
```

### 📱 Pixel 8 Tasker Setup

#### 1. Instalar Tasker y Plugins
1. **Tasker** - Desde Play Store
2. **AutoTools** - Plugin para webhooks y JSON
3. **AutoVoice** - Para comandos de voz (opcional)
4. **AutoRemote** - Para comunicación entre dispositivos

#### 2. Configurar Webhook en Tasker
1. **Abre Tasker** > **Perfiles** > **+**
2. **Selecciona "Event"** > **Plugin** > **AutoTools** > **WebHook**
3. **Configura el webhook**:
   - **Path**: `/nexus-command`
   - **Method**: `POST`
   - **Port**: `1880`
   - **Security**: Opcional pero recomendado
4. **Guarda la configuración**

#### 3. Crear Tareas de Automatización
```xml
<!-- Ejemplo: Toggle WiFi -->
<Task>
  <Action>
    <code>0</code>
    <Int>0</Int>
    <Str>net.tethering.WIFI</Str>
    <Str>toggle</Str>
  </Action>
</Task>

<!-- Ejemplo: Enviar ubicación -->
<Task>
  <Action>
    <code>540</code>
    <Int>1</Int>
    <Str>location</Str>
    <Str>gps</Str>
  </Action>
</Task>
```

#### 4. Configurar Respuestas
```javascript
// En AutoTools JSON
{
  "response": {
    "status": "success",
    "command": "wifi_toggle",
    "result": "wifi_enabled",
    "timestamp": "2024-02-24T18:08:00Z"
  }
}
```

#### 5. Configurar Variables
```bash
PIXEL_TASKER_WEBHOOK_URL=http://192.168.1.130:1880/nexus-command
PIXEL_TASKER_SECRET=aigestion_pixel_secret_2026
```

## 🔧 Integración con AIGestion

### 1. Instalación de Dependencias

```bash
npm install home-assistant-js-websocket node-red-contrib-auto-tools
```

### 2. Configuración del Servicio

```typescript
// src/services/iot-manager.ts
import { HomeAssistant } from 'home-assistant-js-websocket';
import axios from 'axios';

export class IoTManager {
  private haClient: HomeAssistant;
  private pixelWebhook: string;

  constructor() {
    this.haClient = new HomeAssistant({
      baseUrl: process.env.HA_URL,
      accessToken: process.env.HA_TOKEN
    });
    this.pixelWebhook = process.env.PIXEL_TASKER_WEBHOOK_URL;
  }

  // Controlar dispositivos Home Assistant
  async callService(domain: string, service: string, data: any) {
    return await this.haClient.callService(domain, service, data);
  }

  // Enviar comando a Pixel 8
  async sendPixelCommand(command: any) {
    try {
      const response = await axios.post(this.pixelWebhook, command);
      return response.data;
    } catch (error) {
      console.error('Error sending command to Pixel:', error);
      throw error;
    }
  }

  // Obtener estado de dispositivos
  async getDeviceStatus() {
    const states = await this.haClient.getStates();
    return {
      lights: states.filter(s => s.entity_id.startsWith('light.')),
      climate: states.filter(s => s.entity_id.startsWith('climate.')),
      security: states.filter(s => s.entity_id.startsWith('binary_sensor.')),
      sensors: states.filter(s => s.entity_id.startsWith('sensor.'))
    };
  }
}

export default new IoTManager();
```

### 3. Dashboard Unificado

```typescript
// src/components/IoTDashboard.tsx
import { useEffect, useState } from 'react';
import iotManager from '@/services/iot-manager';

export default function IoTDashboard() {
  const [devices, setDevices] = useState({
    lights: [],
    climate: [],
    security: [],
    sensors: []
  });
  const [scenes, setScenes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const deviceStatus = await iotManager.getDeviceStatus();
      setDevices(deviceStatus);
    }
    fetchData();
    
    // WebSocket para actualizaciones en tiempo real
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleLight = async (entityId: string) => {
    await iotManager.callService('light', 'toggle', { entity_id: entityId });
  };

  const activateScene = async (sceneName: string) => {
    await iotManager.callService('scene', 'turn_on', { entity_id: `scene.${sceneName}` });
  };

  return (
    <div className="iot-dashboard">
      <div className="device-grid">
        {/* Render dashboard con control de dispositivos */}
        {devices.lights.map(light => (
          <div key={light.entity_id} className="device-card">
            <h3>{light.attributes.friendly_name}</h3>
            <button onClick={() => toggleLight(light.entity_id)}>
              {light.state === 'on' ? 'Apagar' : 'Encender'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="scene-controls">
        <h2>Escenas</h2>
        <button onClick={() => activateScene('cine_noche')}>Cine Noche</button>
        <button onClick={() => activateScene('bienvenida')}>Bienvenida</button>
        <button onClick={() => activateScene('trabajo')}>Trabajo</button>
      </div>
    </div>
  );
}
```

## 📊 Escenas Inteligentes

### 🎬 Escena "Cine Noche"
```yaml
# scene.yaml
- name: "Cine Noche"
  entities:
    light.sala_principal:
      state: off
      brightness: 0
    light.led_strip:
      state: on
      brightness: 30
      rgb_color: [0, 0, 255]
    media_player.tv:
      state: on
      source: "Netflix"
    climate.termostato:
      temperature: 21
      hvac_mode: cool
    cover.cortinas:
      state: closed
```

### 🏠 Escena "Bienvenida"
```yaml
- name: "Bienvenida"
  entities:
    light.entrada:
      state: on
      brightness: 100
    light.sala:
      state: on
      brightness: 75
    media_player.speaker:
      state: on
      volume: 0.3
      source: "Playlist Bienvenida"
    climate.termostato:
      temperature: 22
```

### 💼 Escena "Trabajo"
```yaml
- name: "Trabajo"
  entities:
    light.escritorio:
      state: on
      brightness: 100
      color_temp: 4000
    light.sala:
      state: off
    climate.termostato:
      temperature: 20
    computer.pc:
      state: on
```

## 🔄 Automatización Avanzada

### 1. Presencia y Geofencing
```yaml
# automation.yaml
- alias: "Llegada a Casa"
  trigger:
    - platform: zone
      entity_id: device_tracker.pixel_8
      zone: zone.home
      event: enter
  action:
    - service: scene.turn_on
      entity_id: scene.bienvenida
    - service: notify.mobile_app_pixel_8
      data:
        message: "¡Bienvenido a casa! He activado la escena de bienvenida."

- alias: "Salida de Casa"
  trigger:
    - platform: zone
      entity_id: device_tracker.pixel_8
      zone: zone.home
      event: leave
  action:
    - service: scene.turn_on
      entity_id: scene.ausente
    - service: lock.lock
      entity_id: lock.puerta_principal
```

### 2. Automatización por Condiciones
```yaml
- alias: "Control Climático Inteligente"
  trigger:
    - platform: numeric_state
      entity_id: sensor.temperatura_exterior
      above: 25
  action:
    - service: climate.set_temperature
      entity_id: climate.termostato
      data:
        temperature: 22
        hvac_mode: cool

- alias: "Luces Automáticas"
  trigger:
    - platform: sun
      event: sunset
      offset: "-00:30:00"
  action:
    - service: light.turn_on
      entity_id: group.luces_externas
      data:
        brightness: 70
```

### 3. Integración con Pixel 8
```typescript
// Ejemplo: Control desde AIGestion hacia Pixel
async function controlPixelFromAIGestion() {
  // Activar modo silencio
  await iotManager.sendPixelCommand({
    command: 'silent_mode',
    parameters: { enable: true }
  });

  // Enviar ubicación actual
  await iotManager.sendPixelCommand({
    command: 'get_location',
    callback: 'https://aigestion.net/api/location/update'
  });

  // Toggle WiFi basado en ubicación
  const location = await getCurrentLocation();
  if (location.isHome) {
    await iotManager.sendPixelCommand({
      command: 'wifi_toggle',
      parameters: { enable: true }
    });
  }
}
```

## 🎮 Gamificación del IoT

### Sistema de Puntos
- **Ahorro energético**: 10 puntos por kWh ahorrado
- **Automatización creada**: 5 puntos por nueva automatización
- **Dispositivos conectados**: 2 puntos por dispositivo
- **Escenas usadas**: 3 puntos por escena activada

### Logros y Badges
- **🏠 Maestro del Hogar**: 100 puntos - Control total del hogar
- **🌱 Eco Warrior**: 200 puntos - Ahorro energético excepcional
- **🤖 Automation Guru**: 150 puntos - 10+ automatizaciones creadas
- **🎬 Director de Escenas**: 75 puntos - 5+ escenas personalizadas

### Leaderboards
- **Semanal**: Mayor ahorro energético
- **Mensual**: Más dispositivos conectados
- **Creatividad**: Automatizaciones más innovadoras
- **Eficiencia**: Mejor optimización de recursos

## 🛡️ Seguridad y Red

### Configuración de Red
```yaml
# network.yaml
# VLAN separada para IoT
iot_vlan:
  vlan_id: 100
  subnet: 192.168.100.0/24
  gateway: 192.168.100.1
  dns: 8.8.8.8, 8.8.4.4

# Reglas de firewall
firewall_rules:
  - from: iot_vlan
    to: lan
    ports: [80, 443, 8123]
    action: allow
  - from: iot_vlan
    to: internet
    action: deny
```

### Seguridad de Dispositivos
```yaml
# device_security.yaml
# Actualizaciones automáticas
auto_update:
  include:
    - esphome
    - tasmota
    - zigbee2mqtt
  exclude:
    - critical_devices

# Monitoreo de seguridad
security_monitoring:
  unknown_devices: alert
  failed_logins: alert
  unusual_activity: warning
```

## 📱 Notificaciones Inteligentes

### Tipos de Notificaciones
- **Seguridad**: Movimiento detectado, puertas abiertas
- **Mantenimiento**: Baterías bajas, dispositivos offline
- **Energía**: Consumo elevado, picos de uso
- **Confort**: Temperatura fuera de rango, humedad
- **Recordatorios**: Riego programado, limpieza

### Configuración
```yaml
# notify.yaml
- platform: mobile_app
  name: pixel_8
  device_id: !secret pixel_device_id

- platform: email
  name: gmail
  sender: !secret email_sender
  recipient: !secret email_recipient

# automation de notificaciones
- alias: "Alerta de Seguridad"
  trigger:
    - platform: state
      entity_id: binary_sensor.puerta_principal
      to: 'on'
  action:
    - service: notify.pixel_8
      data:
        title: "🚨 Alerta de Seguridad"
        message: "Puerta principal abierta"
        data:
          priority: high
          ttl: 0
```

## 🚀 God Mode Features

### IA Predictiva
- **Predicción de ocupación**: Basado en patrones históricos
- **Optimización energética**: Ajuste automático de climatización
- **Detección de anomalías**: Comportamiento inusual de dispositivos
- **Recomendaciones**: Sugerencias de nuevas automatizaciones

### Control Avanzado
- **Control por voz**: "AIGestion, activa escena cine"
- **Control por gestos**: Wave hand para controlar luces
- **Control contextual**: Basado en hora, ubicación, estado
- **Control predictivo**: Anticipa necesidades del usuario

### Dashboard Cósmico
- **Real-time 3D**: Visualización 3D del hogar
- **AR Integration**: Ver dispositivos en realidad aumentada
- **Voice Interface**: Control completamente por voz
- **Holographic Display**: Proyección futurista (concepto)

## 📚 Recursos Adicionales

### Documentación
- [Home Assistant Docs](https://home-assistant.io/docs/)
- [Tasker User Guide](https://tasker.joaoapps.com/userguide/)
- [AIGestion IoT API](https://aigestion.net/docs/iot-api)
- [Integration Best Practices](https://aigestion.net/docs/iot-best-practices)

### Tutoriales
- [Video: Home Assistant Setup](https://aigestion.net/tutorials/ha-setup)
- [Video: Tasker Automation](https://aigestion.net/tutorials/tasker)
- [Video: God Mode IoT](https://aigestion.net/tutorials/iot-god-mode)
- [Video: Advanced Scenes](https://aigestion.net/tutorials/scenes)

### Comunidad
- [Home Assistant Community](https://community.home-assistant.io/)
- [Tasker Community](https://tasker.joaoapps.com/forums/)
- [AIGestion Discord](https://discord.gg/aigestion)
- [Reddit r/homeautomation](https://reddit.com/r/homeautomation)

## 🧪 Testing y Validación

### Test de Conexión
```bash
# Ejecutar test completo
npm run test:iot-connections

# Test individual
npm run test:home-assistant
npm run test:pixel-tasker
npm run test:webhook
npm run test:scenes
```

### Test de Funcionalidad
```bash
# Test automatizaciones
npm run test:automations

# Test escenas
npm run test:scenes

# Test notificaciones
npm run test:notifications

# Test God Mode
npm run test:iot-god-mode
```

## 🆘 Soporte y Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión Home Assistant
```bash
# Verificar configuración
.\scripts\setup\get-iot-credentials.ps1 -Mode test

# Revisar logs de HA
docker logs home-assistant

# Verificar firewall
telnet homeassistant.local 8123
```

#### 2. Webhook de Tasker no responde
```bash
# Verificar IP y puerto
ping 192.168.1.130
telnet 192.168.1.130 1880

# Revisar configuración de Tasker
# Asegurar que AutoTools está instalado
# Verificar permisos de internet
```

#### 3. Dispositivos no detectados
```bash
# Escanear red
nmap -sP 192.168.1.0/24

# Reiniciar dispositivos
# Verificar compatibilidad
# Actualizar firmware
```

#### 4. Automatizaciones no ejecutan
```bash
# Revisar traces de automatización
# Verificar condiciones y triggers
# Revisar sintaxis YAML
# Revisar permisos de servicios
```

### Contacto Soporte
- **Email**: soporte@aigestion.net
- **Chat**: https://aigestion.net/support
- **Priority Support**: Disponible en God Mode
- **Emergency**: 24/7 para sistemas críticos

## 📈 Roadmap Futuro

### Q1 2024
- [ ] Integración con Matter/Thread
- [ ] Soporte para Zigbee 3.0
- [ ] IA avanzada para patrones
- [ ] Dashboard AR/VR

### Q2 2024
- [ ] Control neuronal directo
- [ ] Predictive maintenance
- [ ] Energy harvesting integration
- [ ] Quantum IoT sensors

### Q3 2024
- [ ] Inter-galactic device sync (joke!)
- [ ] Time travel automation (future concept)
- [ ] Teleportation commands (sci-fi)
- [ ] Neural interface integration

## ✅ Checklist Final

- [ ] **Configurar Home Assistant** con dispositivos
- [ ] **Instalar Tasker** en Pixel 8
- [ ] **Configurar webhook** de Tasker
- [ ] **Ejecutar test de validación**
- [ ] **Crear escenas básicas**
- [ ] **Configurar automatizaciones**
- [ ] **Personalizar dashboard**
- [ ] **Activar notificaciones**
- [ ] **Configurar seguridad**
- [ ] **Documentar procesos**

---

## 🎉 ¡Listo para Usar!

Una vez completada la configuración, tendrás acceso a:

- **Control total** de tu hogar desde AIGestion
- **Integración perfecta** con tu Pixel 8
- **Automatizaciones inteligentes** con IA
- **Escenas cinematográficas** personalizadas
- **Dashboard unificado** en tiempo real
- **Control por voz y gestos**
- **Seguridad enterprise** para dispositivos
- **Gamificación** para optimización

**¡AIGestion IoT & Sovereign Bridge está listo para transformar tu hogar! 🏠**

---

*Última actualización: 24 de febrero de 2026*
*Versión: 2.0.0 - God Mode Edition*
