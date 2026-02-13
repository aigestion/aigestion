# 🛠️ Guía de Resolución de Problemas (Troubleshooting) - AIGestion

Esta guía está diseñada para resolver rápidamente los fallos más comunes en el ecosistema AIGestion.

## 1. 🌐 Problemas de CORS (Frontend <-> Backend)

**Síntoma**: Errores 403 o "Cross-Origin Request Blocked" en la consola del navegador.

- **Verificación**: Asegúrate de que la variable `CORS_ORIGIN` en Cloud Run incluya exactamente el dominio de Vercel (incluyendo `https://`).
- **Solución**: Si estás en desarrollo, verifica que el `vite.config.ts` tenga el proxy configurado hacia `http://localhost:5000`.

## 2. 🌌 Fallos en la Búsqueda RAG (Daniela no responde con contexto)

**Síntoma**: Daniela responde de forma genérica o indica que no tiene acceso a los documentos.

- **Check 1 (Supabase)**: Verifica que la extensión `pgvector` esté habilitada en tu base de datos Supabase.
- **Check 2 (Pinecone)**: Asegúrate de que el índice de Pinecone esté activo y que la `PINECONE_API_KEY` sea correcta.
- **Check 3 (Rust Core)**: Si ves errores de "Binary not found", verifica que el archivo `rag-core.exe` (o el binario correspondiente en Linux) esté en la ruta `backend/rag-core/target/release/`.

## 3. 📱 Notificaciones No Recibidas (Telegram/WhatsApp)

**Síntoma**: Las alertas de "God Mode" no llegan al móvil.

- **Telegram**: Verifica que el bot haya sido iniciado con `/start` por el usuario y que el `TELEGRAM_CHAT_ID` sea el correcto.
- **WhatsApp**: Revisa los logs del backend. Meta suele rechazar mensajes si no se usa una plantilla (Template) aprobada para iniciar conversaciones.

## 4. 🚨 Error 404 en API (Proxy Divergente)

**Síntoma**: El frontend carga (200 OK) pero todas las llamadas a `/api` fallan con 404.

- **Diagnóstico**: Existe una "Desincronización de Destino". El archivo `vercel.json` está apuntando a Cloud Run (`backend-aigestion.run.app`), pero es posible que estés intentando desplegar en Render o que el servicio de Cloud Run esté detenido/eliminado.
- **Solución A (Cloud Run)**: Verifica en la consola de Google Cloud que el servicio `backend-aigestion` esté "Running" y que la URL coincida.
- **Solución B (Render)**: Si prefieres Render, edita `vercel.json` y cambia el `destination` de los `rewrites` a `https://aigestion-backend.onrender.com/api/:path*`.

## 🚀 Errores de Despliegue en Vercel

**Síntoma**: El build falla en Vercel con errores de "Module not found".

- **Solución**: El proyecto usa una estructura de monorepo. Asegúrate de que el **Root Directory** en la configuración de Vercel sea la raíz del monorepo y que el comando de build sea `npm run build --workspace=frontend/website-epic`.

---

_Si el problema persiste, consulta los logs centralizados: `gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=backend-aigestion"`_
