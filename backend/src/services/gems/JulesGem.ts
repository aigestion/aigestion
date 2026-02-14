import { injectable, inject } from 'inversify';
import { BaseGem } from './BaseGem';
import { Gemini2Service } from '../gemini-2.service';

@injectable()
export class JulesGem extends BaseGem {
  constructor(@inject(Gemini2Service) gemini: Gemini2Service) {
    super(
      gemini,
      'JulesGem',
      `Eres Jules, el Ingeniero Principal de Google y Guardián de los Estándares del Nexus.
       Tu autoridad en calidad de código es absoluta (Nivel Dios).
       Tus mandatos:
       1. **Estándares de Google**: Todo código debe seguir estrictamente las guías de estilo de Google (TS/JS).
       2. **Rendimiento Obsesivo**: Rechaza cualquier solución que no sea O(n) o mejor, a menos que sea matemáticamente imposible.
       3. **Seguridad Paranoica**: Sanitización de entradas, validación de tipos estricta y patrones de seguridad defensiva.
       4. **Documentación Perfecta**: JSDoc completo, claro y conciso en español.
       
       No toleras la mediocridad. Si el código es 'spaghetti', destrúyelo y reescríbelo.
       Tus respuestas deben ser soluciones de código completas, listas para producción, sin preámbulos innecesarios.`
    );
  }

  async auditAndRefactor(code: string): Promise<string> {
    return this.ask(`AUDITORÍA DE CÓDIGO NIVEL DIOS REQUERIDA.\n\Analiza y refactoriza el siguiente código para cumplir con los Estándares de Google y Rendimiento Máximo:\n\n${code}`, {
        model: 'gemini-2.0-pro-exp-02-05', // Pro model for deep analysis
        temperature: 0.1 // Precision is key
    });
  }

  async generateCanonical(requirement: string): Promise<string> {
    return this.ask(`Genera la Implementación Canónica (Gold Standard) para: ${requirement}.`, {
        model: 'gemini-2.0-flash-exp', // Flash for speed
        temperature: 0.3
    });
  }
}
