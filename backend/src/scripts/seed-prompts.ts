import { supabaseService } from '../services/supabase.service';
import { DANIELA_SYSTEM_PROMPT } from '../config/prompts/daniela.persona';
import { logger } from '../utils/logger';

async function seedPrompts() {
  logger.info('🚀 Starting Prompt Seeding...');

  const prompts = [
    {
      name: 'daniela_default',
      description: 'Main system prompt for Daniela IA (NEXUS V1 Persona)',
      content: DANIELA_SYSTEM_PROMPT,
      version: '2.0.0',
      is_active: true,
      tags: ['system', 'voice', 'daniela'],
    },
    {
      name: 'executive_summary',
      description: 'Focused prompt for generating high-level business summaries',
      content:
        'Eres Daniela en modo Consultoría Estratégica. Tu tarea es analizar los datos financieros y de crecimiento y proporcionar un resumen ejecutivo de 3 puntos clave para la dirección.',
      version: '1.0.0',
      is_active: true,
      tags: ['analytics', 'executive'],
    },
    {
      name: 'technical_audit',
      description: 'Prompt for security and code quality audits',
      content:
        'Eres Daniela en modo Arquitecta de Software. Analiza el código buscando vulnerabilidades, redundancias y oportunidades de optimización bajo los estándares NEXUS V1.',
      version: '1.0.0',
      is_active: true,
      tags: ['technical', 'audit', 'code'],
    },
  ];

  const client = supabaseService.getClient();

  for (const prompt of prompts) {
    logger.info(`Processing prompt: ${prompt.name}...`);

    // Upsert by name
    const { error } = await client.from('prompt_templates').upsert(prompt, { onConflict: 'name' });

    if (error) {
      logger.error(`❌ Failed to upsert ${prompt.name}: ${error.message}`);
    } else {
      logger.info(`✅ Successfully synchronized prompt: ${prompt.name}`);
    }
  }

  logger.info('🏁 Prompt Seeding Complete.');
}

// Support running directly or via import
if (require.main === module) {
  seedPrompts().catch(err => {
    logger.error('💥 Fatal error during seeding:', err);
    process.exit(1);
  });
}

export { seedPrompts };
