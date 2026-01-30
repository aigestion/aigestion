import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { pineconeService } from '../src/services/pinecone.service';
import { logger } from '../src/utils/logger';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configuration
const DOCS_DIR = path.resolve(__dirname, '../../docs');
const CHUNK_SIZE = 500; // words
const OVERLAP = 50; // words
const NAMESPACE = process.env.PINECONE_NAMESPACE || 'documentation';

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
  if (!fs.existsSync(dir)) return files;

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
  logger.info(`🚀 Starting Pinecone Documentation Indexing (Namespace: ${NAMESPACE})...`);

  try {
    const files = await getAllFiles(DOCS_DIR);
    logger.info(`Found ${files.length} markdown files in ${DOCS_DIR}.`);

    for (const file of files) {
      const fileName = path.basename(file);
      logger.info(`📄 Processing: ${fileName}`);
      const content = fs.readFileSync(file, 'utf-8');
      if (!content.trim()) continue;

      const chunks = chunkText(content);
      const docsToUpsert = chunks.map((chunk, i) => ({
        id: `${fileName}-${i}-${Math.random().toString(36).substring(2, 10)}`,
        text: chunk,
        metadata: {
          filename: fileName,
          source: path.relative(path.resolve(__dirname, '../../..'), file),
          type: 'documentation',
          category: path.basename(path.dirname(file)),
        },
      }));

      if (docsToUpsert.length > 0) {
        await pineconeService.upsertDocBatch(docsToUpsert, NAMESPACE);
        logger.info(`✅ Indexed ${docsToUpsert.length} chunks from ${fileName}`);
      }
    }

    logger.info('✨ Documentation indexing complete!');
  } catch (error) {
    logger.error('❌ Error indexing documentation:', error);
  }
}

indexDocs();
