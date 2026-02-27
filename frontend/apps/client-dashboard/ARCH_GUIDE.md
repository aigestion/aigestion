# 📔 Guía de Arquitectura: Frontend Sovereign

Esta guía documenta los patrones y estándares inyectados durante la **Transformación Soberana de AIGestion (Fases 1-5)**.

## 🎨 Principios de Diseño (Sovereign Aesthetics)
Hemos abandonado lo genérico para abrazar lo extraordinario.

### 1. Glassmorphism 2.0
- **Uso de `.glass-card` y `.glass-panel`**: Bordes ultra-finos (`white/10`), desenfoque de fondo profundo (`blur-2xl`) y fondos sutiles (`zinc-950/80`).
- **Aurora Background**: Fondos dinámicos mediante manchas de color animadas (`.aurora-blob`) sobre una base OLED neutra.

### 2. Layout Bento
- Organización de la información en rejillas asimétricas pero equilibradas, utilizando `BentoGrid.tsx`.
- Prioridad visual basada en la importancia de los datos.

## ⚡ Ingeniería de Gravedad Cero (Performance)
El dashboard debe ser instantáneo.

### 1. Persistencia de Caché
- Se utiliza `React Query` con el persistente de `localStorage` configurado en `main.tsx`.
- **Regla**: Los datos cacheados son la fuente de verdad inmediata, sincronizados asincrónicamente con el servidor.

### 2. Virtualización
- El historial de misiones (`MissionTimeline.tsx`) utiliza renderizado virtual para mantener 60 FPS estables sin importar la cantidad de datos.

## 🧠 Interfaz Cognitiva
La App no es solo una herramienta, es un asistente.

- **Spotlight Interface**: Acceso universal mediante `Cmd+K` via `CommandPalette.tsx`.
- **Omni-Chat**: Integración continua vía `SovereignChat.tsx`.

## 🛠️ Estándares DX
- **Logging**: Utilizar el `logger` de `src/lib/logger.ts` para trazabilidad estética.
- **Resiliencia**: Todo componente crítico debe estar envuelto en `SovereignErrorBoundary`.

---
*AIGestion Nexus - Generación Soberana 2026*
