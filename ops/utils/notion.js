const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Robust environment variable retrieval for AIGestion Notion tools.
 */
function getEnv(key) {
  // Check process.env first (for CI/CD or runtime-defined vars)
  if (process.env[key]) return process.env[key];

  // Fallback to .env file in project root
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
    if (match) return match[1].trim();
  }

  return null;
}

const apiKey = getEnv('NOTION_API_KEY');
const NOTION_VERSION = '2022-06-28';

/**
 * Optimized Notion API Requester
 */
function notionRequest(endpoint, method, body = null) {
  if (!apiKey) {
    throw new Error('NOTION_API_KEY is missing. Please check your .env file.');
  }

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.notion.com',
      path: '/v1' + endpoint,
      method,
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
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch {
          parsedData = data;
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(parsedData);
        } else {
          const errorMsg = parsedData.message || data || 'Unknown Notion API Error';
          reject(new Error(`Notion API [${res.statusCode}]: ${errorMsg}`));
        }
      });
    });

    req.on('error', err => {
      reject(new Error(`Notion Request Failed: ${err.message}`));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

module.exports = { notionRequest, getEnv };
