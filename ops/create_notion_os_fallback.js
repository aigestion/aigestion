const https = require('https');
const fs = require('fs');
const path = require('path');

// Helper to read .env
function getEnvValue(key) {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) return null;
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1].trim() : null;
  } catch (e) {
    return null;
  }
}

const apiKey =
  getEnvValue('NOTION_API_KEY') || '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';
const databaseId = '5fc2315e-57c5-4ad8-8fd7-fbb30975c898'; // Planificador

const NOTION_VERSION = '2022-06-28';

function notionRequest(endpoint, method, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.notion.com',
      path: '/v1' + endpoint,
      method: method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', e => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function createOS() {
  console.log("🏗️ Creating 'AIGestion OS' (Fallback Mode)...");

  try {
    const newPage = {
      parent: { database_id: databaseId },
      properties: {
        Proyecto: {
          title: [{ text: { content: 'AIGestion OS' } }],
        },
      },
      icon: { emoji: '🧬' },
      cover: {
        external: {
          url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000',
        },
      },
    };

    const created = await notionRequest('/pages', 'POST', newPage);
    console.log(`✅ Created 'AIGestion OS' Page!`);
    console.log(`   ID: ${created.id}`);
    console.log(`   URL: ${created.url}`);
    console.log(`__NEW_OS_ID__:${created.id}`);
  } catch (error) {
    console.error('❌ Error creating page:', error.message);
  }
}

createOS();
