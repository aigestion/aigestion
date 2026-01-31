#!/usr/bin/env node

/**
 * AIGestion Google Cloud Services - Divine Level Setup
 * Configura y habilita todos los servicios Google Cloud necesarios para AIGestion
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class GoogleCloudDivineSetup {
  constructor() {
    this.projectId = 'aigestion-net';
    this.region = 'europe-west1';
    this.services = [
      // AI & Machine Learning
      'aiplatform.googleapis.com',           // Vertex AI
      'documentai.googleapis.com',          // Document AI
      'vision.googleapis.com',              // Vision API
      'language.googleapis.com',            // Natural Language
      'speech.googleapis.com',              // Speech-to-Text
      'texttospeech.googleapis.com',        // Text-to-Speech
      'translate.googleapis.com',           // Translation
      
      // Data & Analytics
      'bigquery.googleapis.com',            // BigQuery
      'dataflow.googleapis.com',            // Dataflow
      'pubsub.googleapis.com',              // Pub/Sub
      'monitoring.googleapis.com',          // Cloud Monitoring
      'logging.googleapis.com',            // Cloud Logging
      
      // Storage & Database
      'storage.googleapis.com',            // Cloud Storage
      'firestore.googleapis.com',           // Firestore
      'sql-component.googleapis.com',       // Cloud SQL
      
      // Security & Identity
      'secretmanager.googleapis.com',       // Secret Manager
      'iam.googleapis.com',                 // IAM
      'securitycenter.googleapis.com',      // Security Center
      'recaptchaenterprise.googleapis.com', // reCAPTCHA Enterprise
      
      // Infrastructure
      'run.googleapis.com',                 // Cloud Run
      'cloudfunctions.googleapis.com',      // Cloud Functions
      'cloudbuild.googleapis.com',         // Cloud Build
      'artifactregistry.googleapis.com',    // Artifact Registry
      
      // Networking
      'compute.googleapis.com',             // Compute Engine
      'container.googleapis.com',           // GKE
      'dns.googleapis.com',                 // Cloud DNS
      
      // APIs adicionales para AIGestion
      'youtube.googleapis.com',            // YouTube API
      'drive.googleapis.com',              // Google Drive API
      'sheets.googleapis.com',              // Google Sheets API
      'gmail.googleapis.com',              // Gmail API
      'calendar.googleapis.com',            // Google Calendar API
      'tasks.googleapis.com',               // Google Tasks API
      'discoveryengine.googleapis.com',     // Discovery Engine
      'dialogflow.googleapis.com',          // Dialogflow
      'videointelligence.googleapis.com',   // Video Intelligence
    ];
    
    this.apisToCreate = [
      {
        name: 'aigestion-ai-api',
        displayName: 'AIGestion AI API',
        description: 'API para servicios de IA de AIGestion',
        apiType: 'OPENAPI',
        targetService: 'aiplatform.googleapis.com'
      },
      {
        name: 'aigestion-docs-api',
        displayName: 'AIGestion Documents API',
        description: 'API para procesamiento de documentos',
        apiType: 'OPENAPI',
        targetService: 'documentai.googleapis.com'
      }
    ];
    
    this.buckets = [
      {
        name: 'aigestion-documents-storage',
        location: this.region,
        storageClass: 'STANDARD',
        lifecycle: true
      },
      {
        name: 'aigestion-backups-storage',
        location: this.region,
        storageClass: 'COLDLINE',
        lifecycle: true
      },
      {
        name: 'aigestion-media-storage',
        location: this.region,
        storageClass: 'STANDARD',
        lifecycle: false
      }
    ];
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const colors = {
      INFO: '\x1b[36m',    // Cyan
      SUCCESS: '\x1b[32m', // Green
      WARNING: '\x1b[33m', // Yellow
      ERROR: '\x1b[31m',   // Red
      RESET: '\x1b[0m'     // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.RESET}`);
  }

  executeCommand(command, description) {
    try {
      this.log(`Ejecutando: ${description}`, 'INFO');
      const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
      this.log(`✅ ${description} - COMPLETADO`, 'SUCCESS');
      return result;
    } catch (error) {
      this.log(`❌ Error en ${description}: ${error.message}`, 'ERROR');
      return null;
    }
  }

  async setupProject() {
    this.log('🚀 Iniciando configuración DIVINA de Google Cloud para AIGestion', 'INFO');
    this.log(`📂 Proyecto: ${this.projectId}`, 'INFO');
    this.log(`🌍 Región: ${this.region}`, 'INFO');

    // Establecer proyecto activo
    this.executeCommand(
      `gcloud config set project ${this.projectId}`,
      `Estableciendo proyecto ${this.projectId}`
    );

    // Establecer región por defecto
    this.executeCommand(
      `gcloud config set compute/region ${this.region}`,
      `Estableciendo región ${this.region}`
    );

    // Habilitar facturación
    this.log('💳 Verificando estado de facturación...', 'INFO');
    const billingResult = this.executeCommand(
      `gcloud billing projects describe ${this.projectId}`,
      'Verificando facturación'
    );
    
    if (billingResult && billingResult.includes('billingEnabled: true')) {
      this.log('✅ Facturación habilitada', 'SUCCESS');
    } else {
      this.log('⚠️ La facturación no está habilitada. Por favor, actívala en la consola de Google Cloud.', 'WARNING');
    }
  }

  async enableServices() {
    this.log('🔧 Habilitando servicios Google Cloud...', 'INFO');
    
    let enabledCount = 0;
    let failedCount = 0;

    for (const service of this.services) {
      const serviceName = service.split('.')[0];
      this.log(`📦 Habilitando ${serviceName}...`, 'INFO');
      
      const result = this.executeCommand(
        `gcloud services enable ${service} --project=${this.projectId}`,
        `Habilitar ${serviceName}`
      );
      
      if (result) {
        enabledCount++;
      } else {
        failedCount++;
      }
    }

    this.log(`📊 Servicios habilitados: ${enabledCount}/${this.services.length}`, 'SUCCESS');
    if (failedCount > 0) {
      this.log(`⚠️ Servicios fallidos: ${failedCount}`, 'WARNING');
    }
  }

  async createStorageBuckets() {
    this.log('🪣 Creando buckets de almacenamiento...', 'INFO');

    for (const bucket of this.buckets) {
      this.log(`📦 Creando bucket: ${bucket.name}`, 'INFO');
      
      // Crear bucket
      const createResult = this.executeCommand(
        `gsutil mb -l ${bucket.location} -c ${bucket.storageClass} gs://${bucket.name}`,
        `Crear bucket ${bucket.name}`
      );

      if (createResult && bucket.lifecycle) {
        // Configurar lifecycle rules
        const lifecycleConfig = `
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
        "condition": {"age": 30}
      },
      {
        "action": {"type": "Delete"},
        "condition": {"age": 365}
      }
    ]
  }
}`;
        
        const tempFile = path.join(__dirname, 'lifecycle.json');
        fs.writeFileSync(tempFile, lifecycleConfig);
        
        this.executeCommand(
          `gsutil lifecycle set ${tempFile} gs://${bucket.name}`,
          `Configurar lifecycle para ${bucket.name}`
        );
        
        fs.unlinkSync(tempFile);
      }
    }
  }

  async setupServiceAccounts() {
    this.log('👤 Configurando cuentas de servicio...', 'INFO');

    const serviceAccounts = [
      {
        name: 'aigestion-ai-sa',
        displayName: 'AIGestion AI Service Account',
        description: 'Cuenta de servicio para servicios de IA'
      },
      {
        name: 'aigestion-backend-sa',
        displayName: 'AIGestion Backend Service Account',
        description: 'Cuenta de servicio para el backend'
      },
      {
        name: 'aigestion-automation-sa',
        displayName: 'AIGestion Automation Service Account',
        description: 'Cuenta de servicio para automatización'
      }
    ];

    for (const sa of serviceAccounts) {
      this.log(`🔐 Creando cuenta de servicio: ${sa.name}`, 'INFO');
      
      this.executeCommand(
        `gcloud iam service-accounts create ${sa.name} --display-name="${sa.displayName}" --description="${sa.description}" --project=${this.projectId}`,
        `Crear SA ${sa.name}`
      );
    }

    // Asignar roles básicos
    this.log('🎭 Asignando roles a cuentas de servicio...', 'INFO');
    
    const roles = [
      'roles/aiplatform.user',
      'roles/documentai.viewer',
      'roles/secretmanager.secretAccessor',
      'roles/storage.objectAdmin',
      'roles/bigquery.dataEditor',
      'roles/logging.logWriter',
      'roles/monitoring.metricWriter'
    ];

    for (const sa of serviceAccounts) {
      for (const role of roles) {
        this.executeCommand(
          `gcloud projects add-iam-policy-binding ${this.projectId} --member="serviceAccount:${sa.name}@${this.projectId}.iam.gserviceaccount.com" --role="${role}"`,
          `Asignar ${role} a ${sa.name}`
        );
      }
    }
  }

  async setupAPIs() {
    this.log('🌐 Configurando API Gateway...', 'INFO');

    // Habilitar API Gateway
    this.executeCommand(
      'gcloud services enable apigateway.googleapis.com',
      'Habilitar API Gateway'
    );

    for (const api of this.apisToCreate) {
      this.log(`📡 Creando API: ${api.name}`, 'INFO');
      
      // Crear configuración de API
      const apiConfig = `
{
  "type": "openapi",
  "displayInfo": {
    "title": "${api.displayName}",
    "description": "${api.description}"
  }
}`;
      
      const tempFile = path.join(__dirname, `${api.name}.json`);
      fs.writeFileSync(tempFile, apiConfig);
      
      this.executeCommand(
        `gcloud api-gateway api-configs create ${api.name}-config --api=${api.name} --openapi-spec=${tempFile} --project=${this.projectId} --location=${this.region}`,
        `Crear config para ${api.name}`
      );
      
      fs.unlinkSync(tempFile);
    }
  }

  async setupMonitoring() {
    this.log('📊 Configurando monitorización avanzada...', 'INFO');

    // Crear dashboard personalizado
    const dashboardConfig = {
      displayName: 'AIGestion Divine Dashboard',
      gridLayout: {
        columns: '12',
        widgets: [
          {
            title: 'Vertex AI Requests',
            xyChart: {
              dataSets: [{
                timeSeriesQuery: {
                  prometheusQueryEndpoint: {
                    query: 'rate(vertex_ai_requests_total[5m])'
                  }
                }
              }]
            }
          },
          {
            title: 'Document AI Processing',
            xyChart: {
              dataSets: [{
                timeSeriesQuery: {
                  prometheusQueryEndpoint: {
                    query: 'rate(documentai_requests_total[5m])'
                  }
                }
              }]
            }
          }
        ]
      }
    };

    const dashboardFile = path.join(__dirname, 'dashboard.json');
    fs.writeFileSync(dashboardFile, JSON.stringify(dashboardConfig, null, 2));

    this.executeCommand(
      `gcloud monitoring dashboards create --config-from-file=${dashboardFile}`,
      'Crear dashboard de monitorización'
    );

    fs.unlinkSync(dashboardFile);
  }

  async generateEnvironmentFile() {
    this.log('📝 Generando archivo de entorno...', 'INFO');

    const envConfig = `
# AIGestion Google Cloud Configuration - DIVINE LEVEL
# Generated on ${new Date().toISOString()}

# Project Configuration
GOOGLE_CLOUD_PROJECT_ID=${this.projectId}
GOOGLE_CLOUD_LOCATION=${this.region}

# Service Accounts
GOOGLE_APPLICATION_CREDENTIALS=./credentials/aigestion-ai-sa.json
VERTEX_AI_SERVICE_ACCOUNT=aigestion-ai-sa@${this.projectId}.iam.gserviceaccount.com
BACKEND_SERVICE_ACCOUNT=aigestion-backend-sa@${this.projectId}.iam.gserviceaccount.com

# Storage
DOCUMENTS_BUCKET=gs://aigestion-documents-storage
BACKUPS_BUCKET=gs://aigestion-backups-storage
MEDIA_BUCKET=gs://aigestion-media-storage

# AI Services
VERTEX_AI_LOCATION=${this.region}
DOCUMENT_AI_LOCATION=${this.region}
VISION_AI_LOCATION=${this.region}

# APIs
API_GATEWAY_URL=https://${this.region}-${this.projectId}.cloudfunctions.net/aigestion-api

# Monitoring
MONITORING_PROJECT_ID=${this.projectId}
LOGGING_PROJECT_ID=${this.projectId}

# Security
SECRET_MANAGER_PROJECT_ID=${this.projectId}
KMS_KEY_RING=aigestion-keyring
KMS_KEY_NAME=aigestion-encryption-key

# Database
FIRESTORE_DATABASE=aigestion-db
BIGQUERY_DATASET=aigestion_analytics

# Additional Services
YOUTUBE_API_ENABLED=true
DRIVE_API_ENABLED=true
GMAIL_API_ENABLED=true
CALENDAR_API_ENABLED=true
`;

    const envFile = path.join(__dirname, '../../.env.gcp-divine');
    fs.writeFileSync(envFile, envConfig);

    this.log(`✅ Archivo de entorno generado: ${envFile}`, 'SUCCESS');
  }

  async run() {
    try {
      await this.setupProject();
      await this.enableServices();
      await this.createStorageBuckets();
      await this.setupServiceAccounts();
      await this.setupAPIs();
      await this.setupMonitoring();
      await this.generateEnvironmentFile();

      this.log('🎉 CONFIGURACIÓN DIVINA COMPLETADA', 'SUCCESS');
      this.log('🚀 AIGestion está listo para operar a nivel divino en Google Cloud', 'SUCCESS');
      
    } catch (error) {
      this.log(`❌ Error en configuración divina: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Ejecutar configuración divina
if (require.main === module) {
  const setup = new GoogleCloudDivineSetup();
  setup.run();
}

module.exports = GoogleCloudDivineSetup;
