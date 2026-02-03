# 🏁 Lista de Verificación Final de Despliegue - AIGestion

Este documento resume los pasos críticos restantes para llevar el sistema a producción bajo la arquitectura de **Opción A** (Vercel + Cloud Run).

## 1. 🔑 Configuración de Secretos (Backend - Cloud Run)

Debes configurar las siguientes variables en tu consola de Google Cloud Run para que el "God Mode" funcione:

| Variable       | Valor / Origen                         |
| :------------- | :------------------------------------- |
| `SUPABASE_URL` | Tu URL de proyecto de Supabase         |
| `SUPABASE_KEY` | Tu Service Role Key (Sovereign Access) |
| `CORS_ORIGIN`  | `https://tu-sitio.vercel.app`          |
| `DATABASE_URL` | Tu URL de MongoDB Atlas (si aplica)    |

## 2. 🚀 Despliegue del Frontend (Vercel)

He optimizado el `vercel.json` y el `.vercelignore`. Para desplegar:

1. Asegúrate de que el proyecto de Vercel esté vinculado a la raíz del monorepo.
2. Configura `SUPABASE_URL` y `SUPABASE_KEY` (Anon Key) en el Dashboard de Vercel.
3. Ejecuta `vercel --prod` o haz push a `main`.

## 3. 🌌 Verificación de "God Mode"

Una vez desplegado, realiza estas pruebas de humo:

- **Búsqueda Híbrida**: Accede a `/api/v1/rag/query` y verifica que Daniela devuelva contexto de Supabase.
- **Auditoría**: Verifica que las acciones de IA se registren en la tabla `audit_logs` de Supabase.
- **Paridad API**: Asegúrate de que las llamadas desde el frontend no devuelvan errores de CORS (el proxy de Vercel ya está configurado para esto).

## 🛡️ Notas de Seguridad

- El proxy de Vercel añade headers de seguridad (HSTS, CSP) automáticamente.
- El backend tiene CORS configurado para aceptar solo tus dominios autorizados.

---
**¿Deseas que profundicemos en la configuración de algún servicio específico (Redis, RabbitMQ)?**
