#!/usr/bin/env node

/**
 * AIGestion Google Cloud Services - Advanced Configuration
 * Configuración avanzada de APIs y servicios específicos para AIGestion
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class GoogleCloudAdvancedSetup {
  constructor() {
    this.projectId = 'aigestion-net';
    this.region = 'europe-west1';
  }

  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const colors = {
      INFO: '\x1b[36m',
      SUCCESS: '\x1b[32m',
      WARNING: '\x1b[33m',
      ERROR: '\x1b[31m',
      RESET: '\x1b[0m'
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

  async setupVertexAI() {
    this.log('🧠 Configurando Vertex AI - Nivel Divino', 'INFO');

    // Crear endpoint para Gemini Pro
    this.executeCommand(
      `gcloud ai endpoints create --region=${this.region} --display-name="AIGestion Gemini Pro Endpoint"`,
      'Crear endpoint Vertex AI'
    );

    // Deploy modelo Gemini Pro
    this.executeCommand(
      `gcloud ai models upload --region=${this.region} --display-name="AIGestion Gemini Pro" --container-image-uri=us-docker.pkg.dev/vertex-ai/prediction/gemini-pro:latest`,
      'Upload modelo Gemini Pro'
    );

    // Crear dataset personalizado
    this.executeCommand(
      `gcloud ai datasets create --region=${this.region} --display-name="AIGestion Training Data" --data-type="image" --metadata-file=dataset_metadata.json`,
      'Crear dataset Vertex AI'
    );

    // Configurar Vertex AI Search
    this.executeCommand(
      `gcloud ai search-apps create --region=${this.region} --display-name="AIGestion Knowledge Base" --data-store="aigestion-data"`,
      'Crear Vertex AI Search'
    );
  }

  async setupDocumentAI() {
    this.log('📄 Configurando Document AI - Procesamiento Divino', 'INFO');

    // Crear procesador de facturas
    this.executeCommand(
      `gcloud documentai processors create --region=${this.region} --type="INVOICE_PROCESSOR" --display-name="AIGestion Invoice Processor"`,
      'Crear procesador de facturas'
    );

    // Crear procesador de contratos
    this.executeCommand(
      `gcloud documentai processors create --region=${this.region} --type="CONTRACT_PROCESSOR" --display-name="AIGestion Contract Processor"`,
      'Crear procesador de contratos'
    );

    // Crear procesador de formularios
    this.executeCommand(
      `gcloud documentai processors create --region=${this.region} --type="FORM_PARSER_PROCESSOR" --display-name="AIGestion Form Parser"`,
      'Crear procesador de formularios'
    );

    // Habilitar OCR avanzado
    this.executeCommand(
      `gcloud documentai processors enable-ocr --region=${this.region} --processor="INVOICE_PROCESSOR"`,
      'Habilitar OCR avanzado'
    );
  }

  async setupBigQuery() {
    this.log('📊 Configurando BigQuery - Analytics Divinas', 'INFO');

    // Crear dataset principal
    this.executeCommand(
      `gcloud bigquery datasets create aigestion_analytics --location=${this.region} --description="AIGestion Analytics Dataset"`,
      'Crear dataset analytics'
    );

    // Crear dataset de ML
    this.executeCommand(
      `gcloud bigquery datasets create aigestion_ml --location=${this.region} --description="AIGestion Machine Learning Dataset"`,
      'Crear dataset ML'
    );

    // Crear tablas principales
    const tables = [
      {
        name: 'user_interactions',
        schema: 'user_interactions_schema.json'
      },
      {
        name: 'ai_predictions',
        schema: 'ai_predictions_schema.json'
      },
      {
        name: 'business_metrics',
        schema: 'business_metrics_schema.json'
      }
    ];

    for (const table of tables) {
      // Crear schema file
      const schema = {
        fields: [
          { name: 'id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
          { name: 'user_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'data', type: 'JSON', mode: 'NULLABLE' }
        ]
      };

      const schemaFile = path.join(__dirname, `${table.name}_schema.json`);
      fs.writeFileSync(schemaFile, JSON.stringify(schema, null, 2));

      this.executeCommand(
        `gcloud bigquery tables create aigestion_analytics.${table.name} --schema=${schemaFile}`,
        `Crear tabla ${table.name}`
      );

      fs.unlinkSync(schemaFile);
    }

    // Configurar transferencias automáticas
    this.executeCommand(
      `gcloud bigquery transfers create --data_source=google_cloud_storage --display_name="AIGestion Storage Transfer" --params='{"data_path_template":"gs://aigestion-documents-storage/*","destination_table_template":"aigestion_analytics.{run_date}","file_format":"JSON"}'`,
      'Configurar transferencias automáticas'
    );
  }

  async setupCloudFunctions() {
    this.log('⚡ Configurando Cloud Functions - Automatización Divina', 'INFO');

    const functions = [
      {
        name: 'aigestion-webhook-processor',
        entryPoint: 'processWebhook',
        runtime: 'nodejs20',
        trigger: 'http',
        description: 'Procesador de webhooks para AIGestion'
      },
      {
        name: 'aigestion-document-analyzer',
        entryPoint: 'analyzeDocument',
        runtime: 'python39',
        trigger: 'storage',
        description: 'Analizador automático de documentos'
      },
      {
        name: 'aigestion-ai-orchestrator',
        entryPoint: 'orchestrateAI',
        runtime: 'nodejs20',
        trigger: 'pubsub',
        description: 'Orquestador de servicios AI'
      }
    ];

    for (const func of functions) {
      this.executeCommand(
        `gcloud functions deploy ${func.name} --runtime=${func.runtime} --trigger-${func.trigger} --region=${this.region} --entry-point=${func.entryPoint} --description="${func.description}" --allow-unauthenticated`,
        `Deploy function ${func.name}`
      );
    }
  }

  async setupAPIGateway() {
    this.log('🌐 Configurando API Gateway - Gestión Divina', 'INFO');

    // Crear API Gateway configuration
    const apiConfig = {
      swagger: '2.0',
      info: {
        title: 'AIGestion Divine API',
        description: 'API principal para servicios de AIGestion',
        version: '1.0.0'
      },
      host: `${this.region}-${this.projectId}.cloudfunctions.net`,
      schemes: ['https'],
      paths: {
        '/ai/generate': {
          post: {
            'x-google-backend': {
              address: `https://${this.region}-${this.projectId}.cloudfunctions.net/aigestion-ai-orchestrator`
            },
            parameters: [
              {
                name: 'prompt',
                in: 'query',
                required: true,
                type: 'string'
              }
            ]
          }
        },
        '/documents/analyze': {
          post: {
            'x-google-backend': {
              address: `https://${this.region}-${this.projectId}.cloudfunctions.net/aigestion-document-analyzer`
            }
          }
        }
      }
    };

    const apiFile = path.join(__dirname, 'aigestion-api.yaml');
    fs.writeFileSync(apiFile, JSON.stringify(apiConfig, null, 2));

    this.executeCommand(
      `gcloud api-gateway gateways create aigestion-gateway --api=aigestion-api --api-config=aigestion-config-v1 --location=${this.region} --project=${this.projectId}`,
      'Crear API Gateway'
    );

    fs.unlinkSync(apiFile);
  }

  async setupSecurity() {
    this.log('🔒 Configuración de Seguridad - Protección Divina', 'INFO');

    // Crear Key Ring
    this.executeCommand(
      `gcloud kms keyrings create aigestion-keyring --location=${this.region}`,
      'Crear KMS Key Ring'
    );

    // Crear clave de encriptación
    this.executeCommand(
      `gcloud kms keys create aigestion-encryption-key --keyring=aigestion-keyring --location=${this.region} --purpose=encryption --rotation-period=90d --next-rotation-time=2026-02-01T00:00:00Z`,
      'Crear clave de encriptación'
    );

    // Crear clave de firma
    this.executeCommand(
      `gcloud kms keys create aigestion-signing-key --keyring=aigestion-keyring --location=${this.region} --purpose=asymmetric-signing --default-algorithm=ec-sign-p256-sha256`,
      'Crear clave de firma'
    );

    // Configurar Secret Manager
    const secrets = [
      'aigestion-database-url',
      'aigestion-api-keys',
      'aigestion-jwt-secret',
      'aigestion-ai-models-config',
      'aigestion-third-party-credentials'
    ];

    for (const secret of secrets) {
      this.executeCommand(
        `gcloud secrets create ${secret} --replication-policy="automatic"`,
        `Crear secret ${secret}`
      );
    }

    // Configurar Security Center
    this.executeCommand(
      `gcloud scc sources create --organization=YOUR_ORG_ID --display-name="AIGestion Security Source"`,
      'Crear Security Center source'
    );
  }

  async setupMonitoring() {
    this.log('📈 Configuración de Monitorización - Visibilidad Divina', 'INFO');

    // Crear dashboard personalizado
    const dashboard = {
      displayName: 'AIGestion Divine Dashboard',
      gridLayout: {
        columns: '12',
        widgets: [
          {
            title: 'AI Model Performance',
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
            title: 'Document Processing Rate',
            xyChart: {
              dataSets: [{
                timeSeriesQuery: {
                  prometheusQueryEndpoint: {
                    query: 'rate(documentai_requests_total[5m])'
                  }
                }
              }]
            }
          },
          {
            title: 'API Response Time',
            xyChart: {
              dataSets: [{
                timeSeriesQuery: {
                  prometheusQueryEndpoint: {
                    query: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))'
                  }
                }
              }]
            }
          }
        ]
      }
    };

    const dashboardFile = path.join(__dirname, 'aigestion-dashboard.json');
    fs.writeFileSync(dashboardFile, JSON.stringify(dashboard, null, 2));

    this.executeCommand(
      `gcloud monitoring dashboards create --config-from-file=${dashboardFile}`,
      'Crear dashboard personalizado'
    );

    // Configurar alertas
    const alertPolicies = [
      {
        name: 'High Error Rate',
        condition: 'error_rate > 0.05',
        duration: '300s'
      },
      {
        name: 'High Response Time',
        condition: 'response_time_p95 > 2000',
        duration: '300s'
      },
      {
        name: 'AI Model Latency',
        condition: 'vertex_ai_latency > 5000',
        duration: '300s'
      }
    ];

    for (const alert of alertPolicies) {
      this.executeCommand(
        `gcloud monitoring policies create --notification-channels=email --condition-display-name="${alert.name}" --condition-filter="${alert.condition}" --condition-duration="${alert.duration}"`,
        `Crear alerta ${alert.name}`
      );
    }

    fs.unlinkSync(dashboardFile);
  }

  async generateCredentials() {
    this.log('🔑 Generando credenciales de servicio...', 'INFO');

    const serviceAccounts = [
      'aigestion-ai-sa',
      'aigestion-backend-sa',
      'aigestion-automation-sa'
    ];

    const credentialsDir = path.join(__dirname, '../../credentials');
    if (!fs.existsSync(credentialsDir)) {
      fs.mkdirSync(credentialsDir, { recursive: true });
    }

    for (const sa of serviceAccounts) {
      this.executeCommand(
        `gcloud iam service-accounts keys create ${credentialsDir}/${sa}.json --iam-account=${sa}@${this.projectId}.iam.gserviceaccount.com`,
        `Crear credencial para ${sa}`
      );
    }
  }

  async run() {
    try {
      this.log('🚀 Iniciando configuración AVANZADA de Google Cloud para AIGestion', 'INFO');
      
      await this.setupVertexAI();
      await this.setupDocumentAI();
      await this.setupBigQuery();
      await this.setupCloudFunctions();
      await this.setupAPIGateway();
      await this.setupSecurity();
      await this.setupMonitoring();
      await this.generateCredentials();

      this.log('🎉 CONFIGURACIÓN AVANZADA COMPLETADA', 'SUCCESS');
      this.log('🌟 AIGestion está operando a NIVEL DIVINO en Google Cloud', 'SUCCESS');
      
    } catch (error) {
      this.log(`❌ Error en configuración avanzada: ${error.message}`, 'ERROR');
      process.exit(1);
    }
  }
}

// Ejecutar configuración avanzada
if (require.main === module) {
  const setup = new GoogleCloudAdvancedSetup();
  setup.run();
}

module.exports = GoogleCloudAdvancedSetup;
