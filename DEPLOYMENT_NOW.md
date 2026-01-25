# 🚀 DESPLIEGUE INMEDIATO - ACCIONES REQUERIDAS

## ⚡ PASO 1: CONFIGURAR SECRETS GITHUB (5 MINUTOS)

**URL**: https://github.com/aigestion/aigestion/settings/secrets/actions

### 🔑 Copia y pega estos secrets exactamente:

```
GCP_SA_KEY = {"type": "service_account", "project_id": "aigestion-prod", "private_key_id": "TU_KEY_ID", "private_key": "-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY\n-----END PRIVATE KEY-----\n", "client_email": "TU_EMAIL", "client_id": "TU_CLIENT_ID", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token"}

GCP_WORKLOAD_IDENTITY_PROVIDER = projects/123456789/locations/global/workloadIdentityPools/aigestion/providers/github

GCP_SERVICE_ACCOUNT = aigestion-prod@aigestion-prod.iam.gserviceaccount.com

VITE_SUPABASE_URL = https://jhvtjyfmgncrrbzqpbkt.supabase.co

VITE_SUPABASE_ANON_KEY = sb_publishable_e5B829Qzt8ip671dsZdw6g_x2pO275j

VERTEX_AI_API_KEY = TU_VERTEX_AI_API_KEY

SLACK_WEBHOOK = https://hooks.slack.com/services/TU_WEBHOOK

EMAIL_USERNAME = admin@aigestion.net

EMAIL_PASSWORD = TU_GMAIL_APP_PASSWORD

ADMIN_EMAIL = admin@aigestion.net
```

## ⚡ PASO 2: CONFIGURAR GOOGLE CLOUD (10 MINUTOS)

### 2.1 Crear Proyecto
- Ve a: https://console.cloud.google.com/
- Crea proyecto: `aigestion-prod`

### 2.2 Habilitar APIs
```bash
gcloud services enable run.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 2.3 Crear Service Account
```bash
gcloud iam service-accounts create aigestion-prod --display-name="AIGestion Professional"

gcloud projects add-iam-policy-binding aigestion-prod \
  --member="serviceAccount:aigestion-prod@aigestion-prod.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding aigestion-prod \
  --member="serviceAccount:aigestion-prod@aigestion-prod.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

gcloud iam service-accounts keys create key.json \
  --iam-account=aigestion-prod@aigestion-prod.iam.gserviceaccount.com
```

## ⚡ PASO 3: ACTIVAR GITHUB PAGES (1 MINUTO)

**URL**: https://github.com/aigestion/aigestion/settings/pages
- Source: "GitHub Actions"
- Custom domain: `aigestion.net` (después del primer despliegue)

## ⚡ PASO 4: DISPARAR DESPLIEGUE (1 MINUTO)

```bash
git commit --allow-empty -m "🚀 TRIGGER PROFESSIONAL DEPLOYMENT"
git push
```

## 🎯 RESULTADOS ESPERADOS

### ✅ Después de 5 minutos:
- GitHub Pages: https://aigestion.github.io/aigestion/
- Website funcional con todos los dashboards accesibles

### ✅ Después de 10 minutos:
- Dominio personalizado: https://aigestion.net
- Todos los workflows ejecutándose exitosamente

### ✅ Después de 15 minutos:
- Monitoreo interno activo
- Alerts configuradas
- Backup automático programado

## 🚨 VERIFICACIÓN

### URLs a probar:
1. **Website**: https://aigestion.github.io/aigestion/
2. **Dashboards**: Botones "🎛️ Admin", "👤 Client", "🚀 Demo"
3. **Health Check**: /health/index.html
4. **GitHub Actions**: https://github.com/aigestion/aigestion/actions

## 📞 SOPORTE

Si algo falla:
1. Revisa los secrets en GitHub
2. Verifica la configuración de Google Cloud
3. Revisa los logs en GitHub Actions
4. Contacta: admin@aigestion.net

---
**⚡ EJECUTA ESTOS PASOS AHORA PARA DESPLIEGUE COMPLETO!**
