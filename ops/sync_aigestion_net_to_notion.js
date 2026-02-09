const { notionRequest } = require('../utils/notion');
const fs = require('fs');
const path = require('path');

async function syncToNotion() {
  const NOTION_CONTENT_DB_ID = '2f6f1140-4183-814b-9800-e37625a81e22';
  const brainContentPath =
    'C:\\Users\\Alejandro\\.gemini\\antigravity\\brain\\bb4c06fb-63e1-47bb-a595-6a3538c92e44\\aigestion_content.md';

  if (!fs.existsSync(brainContentPath)) {
    console.error('❌ Content file not found at:', brainContentPath);
    process.exit(1);
  }

  const content = fs.readFileSync(brainContentPath, 'utf8');
  console.log('🚀 Syncing content to Notion...');

  try {
    const payload = {
      parent: { database_id: NOTION_CONTENT_DB_ID },
      properties: {
        Name: {
          title: [{ text: { content: 'AIGestion / NEXUS V1 - Migrated Site Content' } }],
        },
      },
      children: [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: { rich_text: [{ text: { content: 'AIGestion Site Content Migration' } }] },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              { text: { content: 'This content was retrieved from aigestion.net on 2026-01-29.' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'code',
          code: {
            language: 'markdown',
            rich_text: [{ text: { content: content.substring(0, 2000) } }],
          },
        },
      ],
    };

    const response = await notionRequest('/pages', 'POST', payload);
    console.log('✅ Successfully created Notion page:', response.url);
  } catch (error) {
    console.error('❌ Error syncing to Notion:', error.message);
    process.exit(1);
  }
}

syncToNotion();
