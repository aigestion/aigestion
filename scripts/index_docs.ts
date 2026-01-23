import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import { vertexAIService } from '../backend/src/services/google/vertex-ai.service';
import { logger } from '../backend/src/utils/logger';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Configuration
const PINECONE_INDEX = 'aigestion-docs';
const DOCS_DIR = path.resolve(__dirname, '../docs');
const CHUNK_SIZE = 500; // words
const OVERLAP = 50; // words

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

function chunkText(text: string, size: number = CHUNK_SIZE, overlap: number = OVERLAP): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += size - overlap) {
    const chunk = words.slice(i, i + size).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk);
    }
    if (i + size >= words.length) break;
  }

  return chunks;
}

async function getAllFiles(dir: string, extension: string = '.md'): Promise<string[]> {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllFiles(fullPath, extension)));
    } else if (entry.isFile() && entry.name.endsWith(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function indexDocs() {
  console.log('🚀 Starting Pinecone Documentation Indexing...');
  const index = pc.index(PINECONE_INDEX);

  try {
    const files = await getAllFiles(DOCS_DIR);
    console.log(`Found ${files.length} markdown files.`);

    for (const file of files) {
      console.log(`📄 Processing: ${path.basename(file)}`);
      const content = fs.readFileSync(file, 'utf-8');
      if (!content.trim()) continue;

      const chunks = chunkText(content);
      const records = [];

      for (const [i, chunk] of chunks.entries()) {
        const id = `${path.basename(file)}-${i}-${uuidv4().substring(0, 8)}`;

        // Generate embedding
        const embedding = await vertexAIService.generateEmbeddings(chunk);

        if (embedding.length === 0) {
          console.warn(`⚠️ Failed to generate embedding for chunk ${i} of ${file}`);
          continue;
        }

        records.push({
          id,
          values: embedding,
          metadata: {
            filename: path.basename(file),
            source: path.relative(path.resolve(__dirname, '..'), file),
            text: chunk,
            type: 'documentation',
            timestamp: new Date().toISOString(),
          },
        });
      }

      if (records.length > 0) {
        // Upsert in batches of 100
        const batchSize = 100;
        for (let j = 0; j < records.length; j += batchSize) {
          const batch = records.slice(j, j + batchSize);
          await index.upsert(batch);
        }
        console.log(`✅ Indexed ${records.length} chunks from ${path.basename(file)}`);
      }
    }

    console.log('✨ Documentation indexing complete!');
  } catch (error) {
    console.error('❌ Error indexing documentation:', error);
  }
}

indexDocs();
