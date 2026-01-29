import 'reflect-metadata';
import fs from 'fs';
import path from 'path';

/**
 * 📊 AIGestion.net Financial Intelligence Script
 * This script aggregates cloud costs and applies fiscal logic (IVA 21% Spain)
 */

const IVA_RATE = 0.21;
const EUR_USD_RATE = 1.09; // Fixed rate for calculation

async function aggregateCosts() {
  console.log('🚀 Iniciando agregación mensual de costos (God-Mode)...');

  // Simulated data from GitHub (Actions + Codespaces)
  const githubActionsBase = 0.00; // Free tier included in org plan
  const githubActionsUsage = 8.75; // Excess minutes & storage
  const githubActionsSubtotalUSD = githubActionsBase + githubActionsUsage;

  // Simulated data from Google Cloud (Vertex AI + storage)
  const gcpVertexAI = 45.30;
  const gcpStorage = 5.20;
  const gcpSubtotalUSD = gcpVertexAI + gcpStorage;

  const othersUSD = 12.00; // Domain, etc.

  const subtotalUSD = githubActionsSubtotalUSD + gcpSubtotalUSD + othersUSD;

  // Calculate IVA (Applied to the final base in Spain if billing address is ES)
  // Assuming these services bill in USD and we pay in EUR or converted USD
  const totalUSD = subtotalUSD * (1 + IVA_RATE);

  const billingData = {
    updatedAt: new Date().toISOString(),
    currency: 'EUR',
    exchangeRate: EUR_USD_RATE,
    providers: {
      github: {
        base: githubActionsBase,
        usage: githubActionsUsage,
        totalUSD: githubActionsSubtotalUSD,
        totalEUR: githubActionsSubtotalUSD / EUR_USD_RATE
      },
      googleCloud: {
        vertexAI: gcpVertexAI,
        storage: gcpStorage,
        totalUSD: gcpSubtotalUSD,
        totalEUR: gcpSubtotalUSD / EUR_USD_RATE
      }
    },
    metricsUSD: {
      subtotal: subtotalUSD,
      iva: subtotalUSD * IVA_RATE,
      total: totalUSD
    },
    metricsEUR: {
      subtotal: subtotalUSD / EUR_USD_RATE,
      iva: (subtotalUSD * IVA_RATE) / EUR_USD_RATE,
      total: totalUSD / EUR_USD_RATE
    }
  };

  const dataDir = path.resolve(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const snapshotPath = path.join(dataDir, 'billing_snapshot.json');
  fs.writeFileSync(snapshotPath, JSON.stringify(billingData, null, 2));

  console.log(`✅ Snapshot financiero guardado en: ${snapshotPath}`);
  console.log(`📊 Total estimado (IVA incluido): €${billingData.metricsEUR.total.toFixed(2)}`);
}

aggregateCosts().catch(console.error);
