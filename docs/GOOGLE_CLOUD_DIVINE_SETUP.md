# 🚀 AIGestion Google Cloud - Divine Setup Guide

## 📋 Overview

Esta guía configura **AIGestion a NIVEL DIVINO** en Google Cloud Platform con todos los servicios necesarios para operar con máxima capacidad y rendimiento.

## 🏗️ Arquitectura Divina

```
🌍 Región: europe-west1 (Sevilla)
📂 Proyecto: aigestion-net
🔐 Cuentas: 3 Service Accounts especializadas
🗄️ Storage: 3 Buckets optimizados
📊 Analytics: BigQuery + Vertex AI Search
⚡ Serverless: Cloud Functions + API Gateway
🔒 Seguridad: KMS + Secret Manager + Security Center
```

## 🚀 Ejecución Rápida

### 1. Configuración Básica (Nivel Dios)
```bash
cd "c:\Users\Alejandro\AIGestion\aigestion"
node scripts/gcp-divine-setup.js
```

### 2. Configuración Avanzada (Nivel Divino)
```bash
cd "c:\Users\Alejandro\AIGestion\aigestion"
node scripts/gcp-advanced-setup.js
```

### 3. Aplicar Variables de Entorno
```bash
# Copiar configuración divina
cp .env.gcp-divine .env

# Editar valores específicos
notepad .env
```

## 📦 Servicios Google Cloud Habilitados

### 🤖 AI & Machine Learning (7 servicios)
- ✅ **Vertex AI** - Modelos Gemini Pro
- ✅ **Document AI** - Procesamiento de facturas/contratos
- ✅ **Vision AI** - Análisis de imágenes
- ✅ **Natural Language** - Procesamiento de texto
- ✅ **Speech-to-Text** - Transcripción de voz
- ✅ **Text-to-Speech** - Síntesis de voz
- ✅ **Translation** - Traducción automática

### 📊 Data & Analytics (6 servicios)
- ✅ **BigQuery** - Data warehouse
- ✅ **Dataflow** - Procesamiento de datos
- ✅ **Pub/Sub** - Mensajería en tiempo real
- ✅ **Cloud Monitoring** - Métricas y alertas
- ✅ **Cloud Logging** - Logs centralizados
- ✅ **Vertex AI Search** - Búsqueda inteligente

### 🗄️ Storage & Database (4 servicios)
- ✅ **Cloud Storage** - 3 buckets optimizados
- ✅ **Firestore** - Base de datos NoSQL
- ✅ **Cloud SQL** - Base de datos relacional
- ✅ **Redis** - Caching en memoria

### 🔒 Security & Identity (5 servicios)
- ✅ **Secret Manager** - Gestión de secrets
- ✅ **IAM** - Gestión de identidades
- ✅ **Security Center** - Seguridad avanzada
- ✅ **KMS** - Gestión de claves
- ✅ **reCAPTCHA Enterprise** - Protección anti-bot

### ⚡ Infrastructure (8 servicios)
- ✅ **Cloud Run** - Contenedores serverless
- ✅ **Cloud Functions** - Functions serverless
- ✅ **Cloud Build** - CI/CD automatizado
- ✅ **Artifact Registry** - Registro de contenedores
- ✅ **Compute Engine** - Máquinas virtuales
- ✅ **GKE** - Kubernetes gestionado
- ✅ **Cloud DNS** - Gestión DNS
- ✅ **API Gateway** - Gestión de APIs

### 🌐 Productivity & Integration (6 servicios)
- ✅ **YouTube API** - Gestión de canales
- ✅ **Google Drive API** - Gestión de archivos
- ✅ **Google Sheets API** - Hojas de cálculo
- ✅ **Gmail API** - Email automatizado
- ✅ **Google Calendar API** - Gestión de calendarios
- ✅ **Google Tasks API** - Gestión de tareas

## 🔐 Cuentas de Servicio Creadas

### 1. **aigestion-ai-sa** - Servicios AI
```json
{
  "roles": [
    "roles/aiplatform.user",
    "roles/documentai.viewer",
    "roles/visionai.viewer"
  ]
}
```

### 2. **aigestion-backend-sa** - Backend Services
```json
{
  "roles": [
    "roles/cloudsql.client",
    "roles/datastore.user",
    "roles/pubsub.publisher"
  ]
}
```

### 3. **aigestion-automation-sa** - Automatización
```json
{
  "roles": [
    "roles/cloudfunctions.developer",
    "roles/artifactregistry.writer",
    "roles/cloudbuild.builds.builder"
  ]
}
```

## 🪣 Buckets de Almacenamiento

### 1. **aigestion-documents-storage**
- **Location**: europe-west1
- **Class**: STANDARD → COLDLINE (30 días)
- **Retention**: 365 días
- **Uso**: Documentos procesados

### 2. **aigestion-backups-storage**
- **Location**: europe-west1
- **Class**: COLDLINE
- **Retention**: 7 años
- **Uso**: Backups automáticos

### 3. **aigestion-media-storage**
- **Location**: europe-west1
- **Class**: STANDARD
- **Retention**: Permanente
- **Uso**: Media files

## 📈 Monitorización Divina

### Dashboard Personalizado
- **AI Model Performance** - Métricas Vertex AI
- **Document Processing Rate** - Procesamiento Document AI
- **API Response Time** - Latencia de APIs
- **Error Rate** - Tasa de errores
- **Resource Usage** - Uso de recursos

### Alertas Configuradas
- **High Error Rate** > 5%
- **High Response Time** > 2s
- **AI Model Latency** > 5s
- **Storage Usage** > 80%
- **Budget Alert** > €1000/mes

## 🔑 Variables de Entorno Clave

### Configuración Project
```bash
GOOGLE_CLOUD_PROJECT_ID=aigestion-net
GOOGLE_CLOUD_LOCATION=europe-west1
```

### Servicios AI
```bash
VERTEX_AI_MODEL=gemini-1.5-pro
DOCUMENT_AI_LOCATION=europe-west1
INVOICE_PROCESSOR_ID=projects/aigestion-net/locations/europe-west1/processors/invoice-processor
```

### Storage
```bash
DOCUMENTS_BUCKET=gs://aigestion-documents-storage
BACKUPS_BUCKET=gs://aigestion-backups-storage
MEDIA_BUCKET=gs://aigestion-media-storage
```

### Seguridad
```bash
KMS_KEY_RING=aigestion-keyring
KMS_ENCRYPTION_KEY=aigestion-encryption-key
SECRET_DATABASE_URL=aigestion-database-url
```

## 🚀 Despliegue Post-Configuración

### 1. Verificar Servicios
```bash
gcloud services list --enabled --project=aigestion-net
```

### 2. Verificar Buckets
```bash
gsutil ls
```

### 3. Verificar Service Accounts
```bash
gcloud iam service-accounts list --project=aigestion-net
```

### 4. Test Vertex AI
```bash
gcloud ai endpoints list --region=europe-west1
```

### 5. Test Document AI
```bash
gcloud documentai processors list --region=europe-west1
```

## 📊 Costos Estimados Mensuales

### Servicios AI (~€200-500/mes)
- Vertex AI: €100-300
- Document AI: €50-150
- Vision AI: €20-30
- Speech APIs: €30-20

### Data & Analytics (~€100-200/mes)
- BigQuery: €50-100
- Dataflow: €30-50
- Pub/Sub: €20-50

### Storage (~€50-150/mes)
- Cloud Storage: €30-80
- Firestore: €15-40
- Cloud SQL: €5-30

### Infrastructure (~€100-300/mes)
- Cloud Functions: €20-80
- Cloud Run: €30-100
- API Gateway: €50-120

**Total Estimado: €450-1150/mes**

## 🎯 Próximos Pasos

### 1. **Configurar Aplicación**
```bash
# Aplicar variables de entorno
cp .env.gcp-divine .env.local

# Instalar dependencias
npm install

# Iniciar aplicación
npm run dev
```

### 2. **Deploy Producción**
```bash
# Deploy frontend
npm run build

# Deploy backend
npm run deploy

# Verificar deployment
npm run health-check
```

### 3. **Monitorización**
```bash
# Ver dashboard
gcloud monitoring dashboards list

# Ver logs
gcloud logging read "resource.type=cloud_function"

# Ver métricas
gcloud monitoring metrics list
```

## 🌟 Estado Final

✅ **Proyecto**: aigestion-net configurado
✅ **Región**: europe-west1 (Sevilla) activa
✅ **Servicios**: 36 APIs habilitadas
✅ **Storage**: 3 buckets optimizados
✅ **Seguridad**: KMS + Secret Manager activos
✅ **Monitorización**: Dashboard + alertas configuradas
✅ **Automatización**: Cloud Functions + API Gateway listos

**🚀 AIGestion está operando a NIVEL DIVINO en Google Cloud Platform**

---

*Para soporte técnico, revisa los logs en Cloud Logging o contacta al equipo de infraestructura.*
