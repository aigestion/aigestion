const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

/**
 * 🌌 SOVEREIGN KNOWLEDGE CRAWLER
 * Recursively indexes the tiered workspace into NeuroCore (ChromaDB).
 */

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
const API_KEY = process.env.ML_SERVICE_API_KEY || 'nexus_sovereign_dev_key_2026';
const ROOT_DIR = 'C:/Users/Alejandro';

const TIERS = [
    'AIGestion',
    'PROJECTS',
    'TOOLS',
    'RESEARCH',
    'ARCHIVE',
    'SCRIPTS'
];

const IGNORED_DIRS = new Set([
    'node_modules', 'dist', 'build', '.git', '.turbo',
    'coverage', 'logs', '.trunk', '.vscode', '.idea',
    '.venv', '.next', '.cache'
]);

const ALLOWED_EXTENSIONS = new Set([
    '.md', '.txt', '.ts', '.js', '.py', '.json', '.ps1', '.sh', '.yaml', '.yml'
]);

async function archiveFile(filePath, content) {
    try {
        const relativePath = path.relative(ROOT_DIR, filePath);
        const tags = relativePath.split(path.sep).filter(p => !p.includes('.'));

        console.log(`[CRAWLER] Indexing: ${relativePath}`);

        await axios.post(`${ML_SERVICE_URL}/archive`, {
            content,
            source: relativePath,
            tags: tags
        }, {
            headers: { 'X-API-Key': API_KEY }
        });
    } catch (error) {
        console.error(`[ERROR] Failed to archive ${filePath}: ${error.message}`);
    }
}

async function crawl(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (!IGNORED_DIRS.has(entry.name)) {
                await crawl(fullPath);
            }
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (ALLOWED_EXTENSIONS.has(ext)) {
                try {
                    const stats = fs.statSync(fullPath);
                    if (stats.size > 500000) continue; // Skip files > 500KB

                    const content = fs.readFileSync(fullPath, 'utf-8');
                    await archiveFile(fullPath, content);
                } catch (err) {
                    // Skip binary or unreadable files
                }
            }
        }
    }
}

async function run() {
    console.log('\n🧠 INITIATING NEURAL WORKSPACE CRAWL...');
    console.log('════════════════════════════════════════');

    for (const tier of TIERS) {
        const tierPath = path.join(ROOT_DIR, tier);
        if (fs.existsSync(tierPath)) {
            console.log(`\n[TIER] Scanning ${tier}...`);
            await crawl(tierPath);
        }
    }

    console.log('\n✨ NEURAL ASCENSION COMPLETE. WORKSPACE INDEXED.');
}

if (require.main === module) {
    run();
}
