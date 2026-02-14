import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../types';
import { Gemini2Service } from '../services/gemini-2.service';
import { SovereignGem } from '../services/gems/SovereignGem';
import { CodeGem } from '../services/gems/CodeGem';
import { ArchitectGem } from '../services/gems/ArchitectGem';
import { JulesGem } from '../services/gems/JulesGem';
import { NotebookInsightService } from '../services/google/notebook-insight.service';
import { DanielaAIService } from '../services/daniela-ai.service';
// logger import removed

// Mock DanielaAIService if needed
class MockDanielaAIService {
  async generateContent(prompt: string) {
    return `[MOCK] Response to: ${prompt}`;
  }
}

class MockGemini2Service {
  async initialize() {
    console.log('[MOCK] Gemini2Service initialized');
  }
  async generateText(prompt: string) {
    return `[MOCK GEMINI] Generated content for: ${prompt}`;
  }
}

// Self-executing async function to handle top-level await if module system doesn't support it directly
// or just standard async IIFE pattern
(async () => {
  const container = new Container();
  container.bind(DanielaAIService).toConstantValue(new MockDanielaAIService() as any);
  const mockGemini = new MockGemini2Service();
  container.bind(Gemini2Service).toConstantValue(mockGemini as any);
  container.bind(TYPES.Gemini2Service).toConstantValue(mockGemini as any);
  container.bind(SovereignGem).toSelf();
  container.bind(CodeGem).toSelf();
  container.bind(ArchitectGem).toSelf();

  const gemini = container.get(Gemini2Service);
  await gemini.initialize();

  const sovereign = container.get(SovereignGem);
  const code = container.get(CodeGem);
  const architect = container.get(ArchitectGem);

  console.log('💎 Testing Sovereign Gems with Gemini 2.0 Flash...');

  try {
    const sovereignResponse = await sovereign.orchestrate('Actualizar el sistema a Nivel Dios');
    console.log('\n👑 Respuesta de Gema Soberana:\n', sovereignResponse);

    const codeResponse = await code.refactor(
      'function add(a,b){return a+b}',
      'Añadir seguridad de tipos y manejo de errores',
    );
    console.log('\n💻 Respuesta de Code Gem:\n', codeResponse);

    const architectResponse = await architect.designSystem(
      'Un chat escalable en tiempo real para 1M de usuarios',
    );
    console.log('\n🏗️ Respuesta de Architect Gem:\n', architectResponse);

    // Verify newly created JulesGem (if available in container context for this script)
    // Note: In a real scenario, we'd need to bind it in the container above.
    // Assuming container is just a localized test container in this script:
    container.bind(JulesGem).toSelf();
    const jules = container.get(JulesGem);
    const julesResponse = await jules.generateCanonical('Singleton Pattern in TypeScript');
    console.log('\n👻 Respuesta de Jules Gem (Nivel Dios):\n', julesResponse);

    // Verify NotebookInsightService (God Mode)
    // Note: We need to bind it if not already valid in this partial container context
    container.bind(TYPES.BigQueryService).toConstantValue({ trackEvent: async () => {} } as any);
    container.bind(NotebookInsightService).toSelf();

    const notebookService = container.get(NotebookInsightService);
    // Mock data for notebook generation
    const mockData = {
      users: [100, 150, 300, 500, 1000],
      revenue: [1000, 1500, 3200, 5500, 12000],
    };
    const notebookResponse = await notebookService.generateInsightNotebook(
      'Crecimiento de Usuarios 2026',
      mockData,
    );
    console.log('\n📓 Respuesta de NotebookLM (Nivel Dios):\n', notebookResponse.message);
    if (notebookResponse.code) {
      console.log(
        '--- Snippet de Código Generado ---\n',
        notebookResponse.code.substring(0, 200) + '...\n----------------------------------',
      );
    }

    console.log('\n✅ Verificación Completa: Todas las Gemas Operativas');
  } catch (error) {
    console.error('❌ Verificación Fallida:', error);
  }
})();
