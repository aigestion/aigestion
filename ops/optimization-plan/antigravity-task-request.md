# 🚀 TAREA PARA ANTIGRAVITY - ANÁLISIS DE MIGRACIÓN

## 📋 **CONTEXTO DEL PROYECTO**

Estamos migrando la estructura de carpetas de Alejandro a una organización optimizada:

- **Origen:** `c:\Users\Alejandro\` (desorganizado)
- **Destino:** `c:\Users\Alejandro\WORKSPACE\`, `DEVELOPMENT\`, etc. (optimizado)
- **Estado actual:** Copias seguras completadas de Data, scripts, Tools, Dev

## 🎯 **OBJETIVO PRINCIPAL**

Analizar `Projects` y `AIGestion` para definir qué copiar y qué excluir, evitando duplicar basura.

## 📊 **DATOS CRÍTICOS CONOCIDOS**

- **Projects:** 14.838 GB, 678k archivos
- **AIGestion:** 10.17 GB, 464k archivos
- **Basura detectada:** miles de `node_modules`, `dist`, `build`, `.next`, etc.

## 🔍 **TAREAS ESPECÍFICAS PARA ANTIGRAVITY**

### 1️⃣ **ANÁLISIS DE PROJECTS**

```
Analizar C:\Users\Alejandro\Projects:
- Identificar subcarpetas con repos .git (proyectos activos)
- Detectar backups vs proyectos en desarrollo
- Calcular tamaño real excluyendo node_modules, dist, build, .next
- Priorizar por actividad reciente (fechas de modificación)
- Sugerir qué subcarpetas copiar a WORKSPACE\Projects
```

### 2️⃣ **ANÁLISIS DE AIGESTION**

```
Analizar C:\Users\Alejandro\AIGestion:
- Identificar componentes principales (backend, frontend, packages, etc.)
- Detectar qué es código fuente vs build/cachés
- Calcular tamaño real excluyendo node_modules, dist, build, .cache
- Identificar archivos críticos (configuraciones, scripts, docs)
- Sugerir estructura óptima para WORKSPACE\AIGestion
```

### 3️⃣ **GENERAR LISTA DE EXCLUSIONES**

```
Crear lista definitiva de carpetas a NO copiar:
- node_modules (regenerable con npm install)
- dist/ (regenerable con build)
- build/ (regenerable con build)
- .next/ (regenerable con next build)
- .cache/ (temporal)
- coverage/ (regenerable)
- .venv/ (regenerable)
- out/ (build output)
```

### 4️⃣ **PLAN DE MIGRACIÓN**

```
Generar plan de acción:
- Orden recomendado de copias (de menor a mayor tamaño)
- Tiempos estimados para cada copia
- Estrategia de validación post-copia
- Comandos robocopy específicos con exclusiones
```

## 📋 **ENTREGABLES ESPERADOS**

1. **Reporte de Projects:** proyectos activos, tamaños reales, recomendaciones
2. **Reporte de AIGestion:** componentes críticos, exclusiones, estructura sugerida
3. **Lista de exclusiones:** archivo .txt con carpetas a ignorar
4. **Plan de migración:** pasos ordenados con comandos específicos

## 🎯 **CRITERIOS DE ÉXITO**

- Minimizar tamaño de copias (solo código fuente esencial)
- Maximizar velocidad de copia (excluir basura regenerable)
- Preservar todo código importante y configuraciones
- Generar comandos listos para ejecutar

## 📞 **COORDINACIÓN**

- **Cascade:** Ejecutará las copias seguras basadas en tu análisis
- **Antigravity:** Proporciona el análisis y plan optimizado
- **Alejandro:** Aprueba y valida el plan final

---

**Prioridad:** Alta
**Tiempo estimado:** 30-45 minutos de análisis
**Impacto:** Reducción drástica de tiempo de copia y espacio utilizado
