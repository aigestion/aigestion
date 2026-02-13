# 📚 AIGestion – Full‑Level Development Tutorial (Nexus V1 Edition)

> **Objetivo:** Proveer una guía exhaustiva, paso‑a‑paso, de la configuración, desarrollo, pruebas, CI/CD, despliegue en Google Cloud Run y buenas prácticas avanzadas para el ecosistema **AIGestion / Nexus V1**.

---

## 📦 Tabla de contenidos

1. [Requisitos previos](#requisitos-previos)
2. [Estructura del repositorio](#estructura-del-repositorio)
3. [Configuración del entorno local](#configuración-del-entorno-local)
4. [Backend – Express + Inversify](#backend---express--inversify)
5. [Frontend – React + Vite](#frontend---react--vite)
6. [Bases de Datos y Caching (Políglota)](#bases-de-datos-y-caching-políglota)
7. [Automatización con Browserless](#automatización-con-browserless)
8. [Variables de entorno y gestión de secretos](#variables-de-entorno-y-gestión-de-secretos)
9. [Ejecutar la pila localmente](#ejecutar-la-pila-localmente)
10. [Estrategia de pruebas](#estrategia-de-pruebas)
11. [CI/CD con GitHub Actions](#cicd-con-github-actions)
12. [Versionado y gestión de releases](#versionado-y-gestión-de-releases)
13. [Despliegue en Google Cloud Run](#despliegue-en-google-cloud-run)
14. [Seguridad y auditoría](#seguridad-y-auditoría)
15. [Monitoreo y observabilidad](#monitoreo-y-observabilidad)
16. [Documentación del proyecto](#documentación-del-proyecto)
17. [Docker‑Compose (Ecosistema completo)](#docker‑compose-ecosistema-completo)
18. [Checklist de mejores prácticas](#checklist-de-mejores-prácticas)
19. [FAQ y solución de problemas](#faq-y-solución-de-problemas)

---

## 1️⃣ Requisitos previos

| Herramienta          | Versión mínima          | Instalación (PowerShell)              |
| -------------------- | ----------------------- | ------------------------------------- |
| **Node.js**          | 18.x (Recomendado 20.x) | `winget install OpenJS.Nodejs`        |
| **pnpm**             | 8.x                     | `npm i -g pnpm`                       |
| **Docker Desktop**   | 4.30+                   | `winget install Docker.DockerDesktop` |
| **Git**              | 2.40+                   | `winget install Git.Git`              |
| **Google Cloud SDK** | 470+                    | `winget install Google.CloudSDK`      |
| **Python**           | 3.9+ (ML Service)       | `winget install Python.Python.3.9`    |

---

## 2️⃣ Estructura del repositorio

```text
AIGestion/
├─ backend/                # Express + Inversify (Inyección de dependencias)
│   ├─ src/                # Lógica de negocio, controladores, servicios
│   ├─ scripts/            # Utilidades de setup y mantenimiento
│   └─ Dockerfile
├─ frontend/               # React + Vite (Dashboard UI)
├─ ml-service/             # FastAPI / Python (IA Engine)
├─ infra/                  # Terraform / Configs de nube
├─ docker-compose.yml      # Definición de todos los contenedores
└─ package.json            # Monorepo con pnpm workspaces
```

---

## 3️⃣ Configuración del entorno local

1. **Clonar e instalar**:
   ```powershell
   git clone https://github.com/your-org/AIGestion.git
   cd AIGestion
   pnpm install
   ```
2. **Preparar variables**:
   ```powershell
   copy .env.example .env
   # Asegúrate de configurar MONGO_URI, DATABASE_URL (Postgres) y REDIS_URL.
   ```

---

## 4️⃣ Backend – Express + Inversify

A diferencia de otros stacks, usamos **Express** con **InversifyJS** para una inyección de dependencias robusta y una arquitectura limpia.

### Scripts clave:

- `pnpm dev`: Inicia con `ts-node-dev`.
- `pnpm build`: Compila con `tsc`.
- `pnpm nexus:doctor`: Ejecuta un diagnóstico de salud del sistema.

---

## 5️⃣ Frontend – React + Vite

NEXUS UI utiliza un diseño premium basado en **Glassmorphism**.

- **Acceso**: `http://localhost:5173` (Dev) o `http://localhost:8080` (Docker).

---

## 6️⃣ Bases de Datos y Caching (Políglota)

El sistema utiliza una arquitectura políglota para máxima eficiencia:

1. **MongoDB**: Almacenamiento de documentos y datos no estructurados (Mongoose).
2. **PostgreSQL**: Datos relacionales y transaccionales (Prisma).
3. **Redis**: Caching de alta velocidad y colas (BullMQ / ioredis).

---

## 7️⃣ Automatización con Browserless

Utilizamos **Browserless (Chrome)** para tareas de scraping, generación de PDFs y automatización web.

- **Acceso local**: `http://localhost:3001`

---

## 10️⃣ Estrategia de pruebas

| Tipo           | Herramienta          | Comando                           |
| -------------- | -------------------- | --------------------------------- |
| **Unitarias**  | Jest / Vitest        | `pnpm test`                       |
| **E2E**        | Playwright / Cypress | `pnpm e2e`                        |
| **Rate Limit** | Script custom        | `node scripts/test-rate-limit.js` |

---

## 17️⃣ Docker‑Compose (Ecosistema completo)

Levanta todos los servicios, bases de datos y herramientas de monitoreo:

```powershell
docker-compose up -d --build
```

Servicios incluidos:

- `backend`: API Nexus.
- `frontend`: Dashboard UI.
- `ml-service`: Engine de IA.
- `db`: PostgreSQL.
- `mongodb`: MongoDB 7.0.
- `redis`: Redis Stack.
- `browserless`: Automatización de Chrome.

---

_Para detalles específicos de despliegue y seguridad, consulta los apartados correspondientes en este documento._
