import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

const KNOWLEDGE_ROOT = 'C:\\Users\\Alejandro\\.gemini\\antigravity\\knowledge';
const OUTPUT_DIR = 'C:\\Users\\Alejandro\\AIGestion\\docs\\notebooklm_sources';

async function generateSources() {
    logger.info('🚀 Starting Sovereign Knowledge Aggregation for NotebookLM...');

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 1. Generate Sovereign Brain (Architecture & Patterns)
    const brainContent = await aggregateArchitecture();
    fs.writeFileSync(path.join(OUTPUT_DIR, '01_Sovereign_Brain.md'), brainContent);

    // 2. Generate Daniela Persona (AI & Voice)
    const danielaContent = await aggregateDaniela();
    fs.writeFileSync(path.join(OUTPUT_DIR, '02_Daniela_Persona.md'), danielaContent);

    // 3. Generate Mission Operations (Runbooks & Status)
    const opsContent = await aggregateOperations();
    fs.writeFileSync(path.join(OUTPUT_DIR, '03_Mission_Operations.md'), opsContent);

    logger.info(`✅ Generation complete. Sources available in: ${OUTPUT_DIR}`);
}

async function aggregateArchitecture(): Promise<string> {
    let content = '# 🧠 AIGestion Sovereign Brain: Technical Master\n\n';
    content += '> This document contains the core architectural patterns and technical standards of AIGestion.net (Feb 2026).\n\n';

    const nexusPath = path.join(KNOWLEDGE_ROOT, 'aigestion_nexus_ecosystem', 'artifacts', 'overview.md');
    if (fs.existsSync(nexusPath)) {
        content += '## Ecosystem Overview\n\n' + fs.readFileSync(nexusPath, 'utf8') + '\n\n';
    }

    const archPath = path.join(KNOWLEDGE_ROOT, 'aigestion_nexus_ecosystem', 'artifacts', 'platform', 'technical_architecture_handbook.md');
    if (fs.existsSync(archPath)) {
        content += '## Technical Architecture\n\n' + fs.readFileSync(archPath, 'utf8') + '\n\n';
    }

    return content;
}

async function aggregateDaniela(): Promise<string> {
    let content = '# 🎙️ Daniela Persona: Voice Agent Memory Core\n\n';
    content += '> This document defines the identity, voice parameters, and operational logic of the Daniela Voice Agent.\n\n';

    // Searching for Daniela related KIs or docs
    content += '## Identity & Voice\n- **Service:** ElevenLabs + Twilio/Vapi\n- **Integration:** Hybrid Pixel 8 + Tasker\n- **Role:** Sovereign Assistant & Call Agent\n\n';
    
    return content;
}

async function aggregateOperations(): Promise<string> {
    let content = '# 🛰️ Mission Operations: God Mode Runbook\n\n';
    content += '> Operational status, deployment pipelines, and maintenance protocols for AIGestion.\n\n';

    const opsPath = path.join(KNOWLEDGE_ROOT, 'aigestion_nexus_ecosystem', 'artifacts', 'ops', 'operations_guide.md');
    if (fs.existsSync(opsPath)) {
        content += '## Operations Guide\n\n' + fs.readFileSync(opsPath, 'utf8') + '\n\n';
    }

    const buildPath = path.join(KNOWLEDGE_ROOT, 'aigestion_nexus_ecosystem', 'artifacts', 'ops', 'frontend_build_recovery_patterns.md');
    if (fs.existsSync(buildPath)) {
        content += '## Build Recovery\n\n' + fs.readFileSync(buildPath, 'utf8') + '\n\n';
    }

    return content;
}

generateSources().catch(err => {
    logger.error(`Fatal error in NotebookLM source generation: ${err.message}`);
    process.exit(1);
});
