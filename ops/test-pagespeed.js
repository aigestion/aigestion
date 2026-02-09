/**
 * 🚀 PageSpeed Insights Demo Utility
 * part of AIGestion / Nexus God Mode
 */
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
const TARGET_URL = process.env.FRONTEND_URL || 'https://www.aigestion.net';

async function runAudit() {
  if (!API_KEY || API_KEY === 'YOUR_PAGESPEED_API_KEY') {
    console.error('❌ Error: GOOGLE_PAGESPEED_API_KEY no configurada en .env');
    return;
  }

  console.log(`🔍 Iniciando auditoría PageSpeed para: ${TARGET_URL}...`);

  try {
    const response = await axios.get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', {
      params: {
        url: TARGET_URL,
        key: API_KEY,
        category: ['performance', 'seo', 'accessibility', 'best-practices'],
      }
    });

    const { categories } = response.data.lighthouseResult;

    console.log('\n--- 📊 Resultados de la Auditoría ---');
    console.log(`⚡ Performance: ${Math.round(categories.performance.score * 100)}`);
    console.log(`🔍 SEO: ${Math.round(categories.seo.score * 100)}`);
    console.log(`♿ Accesibilidad: ${Math.round(categories.accessibility.score * 100)}`);
    console.log(`🛡️ Best Practices: ${Math.round(categories['best-practices'].score * 100)}`);
    console.log('------------------------------------\n');

  } catch (error) {
    console.error('❌ Error al conectar con PageSpeed API:', error.response?.data?.error?.message || error.message);
  }
}

runAudit();
