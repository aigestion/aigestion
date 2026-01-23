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

const apiKey = getEnvValue('NOTION_API_KEY') || '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';
const databaseId = '5fc2315e-57c5-4ad8-8fd7-fbb30975c898'; // Planificador

const NOTION_VERSION = '2022-06-28';

function notionRequest(endpoint, method) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.notion.com',
            path: '/v1' + endpoint,
            method: method,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
                } else {
                    resolve({ error: true, status: res.statusCode, message: data });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
}

async function getDatabaseSchema() {
    console.log(`🔍 Inspecting schema for Database ID: ${databaseId}...`);

    try {
        const response = await notionRequest(`/databases/${databaseId}`, 'GET');

        if (response.error) {
            console.error("❌ API Error:", response.message);
            return;
        }

        console.log("✅ Database Retrieved Successfully");
        console.log("\n--- Properties Schema ---");

        Object.entries(response.properties).forEach(([key, value]) => {
            console.log(`Property Name: "${key}"`);
            console.log(`  Type: ${value.type}`);
            if (value.type === 'title') {
                 console.log(`  🌟 IS TITLE PROPERTY`);
            }
        });
        console.log("-------------------------\n");

    } catch (error) {
        console.error("❌ Script Error:", error.message);
    }
}

getDatabaseSchema();
