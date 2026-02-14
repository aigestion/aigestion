import { Pinecone } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

async function createIndex() {
  console.log('🚀 Creating Pinecone index: aigestion-docs');
  try {
    await pc.createIndex({
      name: 'aigestion-docs',
      dimension: 768,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
      },
      deletionProtection: 'disabled',
    });
    console.log('✅ Index creation initiated successfully!');
  } catch (error) {
    console.error('❌ Error creating index:', error);
  }
}

createIndex();
