// generate-images.js
// Node script to generate premium branding assets using Vertex AI Imagen‑4 (or Gemini‑3‑Pro‑Image).
// Run with: node scripts/generate-images.js

/* eslint-env node */
/* global process, Buffer */
const { PredictionServiceClient } = require('@google-cloud/aiplatform');
const fs = require('fs');
const path = require('path');

// ------------------------------------------------------------
// Configuration – Load from backend/.env if available
// ------------------------------------------------------------
const envPath = path.resolve(__dirname, '..', 'backend', '.env');
const envLocalPath = path.resolve(__dirname, '..', '.env.local');

// Load root .env.local first, then backend .env (backend takes priority for credentials)
if (fs.existsSync(envLocalPath)) {
  require('dotenv').config({ path: envLocalPath });
}
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

const PROJECT_ID =
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.GCP_PROJECT ||
  process.env.GOOGLE_CLOUD_PROJECT_ID;
const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const LOCATION = process.env.VERTEX_AI_LOCATION || 'us-central1'; // Vertex AI region

// ------------------------------------------------------------
// Validation
// ------------------------------------------------------------
if (!PROJECT_ID) {
  console.error(
    '❌ GCP project ID not set. Ensure GOOGLE_CLOUD_PROJECT is set in backend/.env or as an environment variable.'
  );
  process.exit(1);
}

// if (!GOOGLE_APPLICATION_CREDENTIALS) {
//   console.error(
//     '❌ GOOGLE_APPLICATION_CREDENTIALS not set. Ensure it points to your service account JSON key in backend/.env.'
//   );
//   process.exit(1);
// }

// Force ADC (Application Default Credentials) to use user's gcloud auth instead of potentially limited Service Account
delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
console.log('⚠️ Forced ADC: Deleted GOOGLE_APPLICATION_CREDENTIALS to use gcloud auth.');

console.log(`ℹ️ Target Project: ${PROJECT_ID}`);
console.log(`ℹ️ Target Location: ${LOCATION}`);
console.log(`ℹ️ Credentials: ${GOOGLE_APPLICATION_CREDENTIALS}`);

const MODEL = 'imagen-3.0-generate-001'; // Fallback from imagen-4
const OUTPUT_DIR = path.resolve(__dirname, '..', 'frontend', 'apps', 'website', 'public', 'images');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ------------------------------------------------------------
// Prompts for the three premium assets (feel free to edit)
// ------------------------------------------------------------
const assets = [
  {
    name: 'aigestion_office.png',
    prompt:
      'A premium ultra‑realistic futuristic office for an AI finance platform, glass walls, dark‑blue and cyan neon lighting, holographic dashboards, sleek modern furniture, cinematic depth‑of‑field, God‑mode quality, 4k resolution.',
  },
  {
    name: 'android_hero.png',
    prompt:
      'A premium Android‑style hero illustration, vibrant cyan accents, futuristic UI elements, sleek glass surfaces, hyper‑realistic lighting, high‑detail, God‑mode aesthetic, 4k.',
  },
  {
    name: 'daniela.png',
    prompt:
      'A high‑resolution portrait of a professional woman named Daniela, soft cyber‑punk lighting, cyan highlights, subtle neon background, ultra‑realistic, God‑mode quality, 4k.',
  },
];

// ------------------------------------------------------------
// Helper to call Vertex AI and write the image file
// ------------------------------------------------------------
async function generateAsset({ name, prompt }) {
  const client = new PredictionServiceClient({
    // The client will automatically use GOOGLE_APPLICATION_CREDENTIALS env var.
  });

  const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}`;

  const request = {
    endpoint,
    instances: [{ prompt }],
  };

  console.log(`🔹 Generating ${name} …`);
  const [response] = await client.predict(request);
  const base64 = response.predictions[0].bytesBase64Encoded;
  const buffer = Buffer.from(base64, 'base64');
  const outPath = path.join(OUTPUT_DIR, name);
  fs.writeFileSync(outPath, buffer);
  console.log(`✅ ${name} saved to ${outPath}`);
}

(async () => {
  try {
    for (const asset of assets) {
      await generateAsset(asset);
    }
    console.log('🎉 All premium branding assets generated successfully.');
  } catch (err) {
    console.error('❌ Error during image generation:', err);
    process.exit(1);
  }
})();
