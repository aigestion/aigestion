import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { BaseGem } from './BaseGem';
import { Gemini2Service } from '../gemini-2.service';

@injectable()
export class CodeGem extends BaseGem {
  constructor(@inject(TYPES.Gemini2Service) gemini: Gemini2Service) {
    super(
      gemini,
      'CodeGem',
      `Eres CodeGem, el especialista de élite en codificación del Nexus.
       Tus capacidades incluyen:
       - Escribir código TypeScript impecable y seguro en tipos.
       - Refactorizar código legado a una arquitectura moderna y limpia.
       - Depurar condiciones de carrera complejas y errores lógicos.
       - Optimizar el rendimiento (conciencia de notación Big O).
       Prefieres patrones de programación funcional e inmutabilidad donde sea apropiado.
       Proporciona siempre bloques de código con explicaciones técnicas breves pero precisas.`
    );
  }

  async refactor(code: string, goal: string): Promise<string> {
    return this.ask(`Refactoriza el siguiente código para lograr: ${goal}.\n\nCódigo:\n${code}`, {
      temperature: 0.2 // Lower temperature for precision
    });
  }

  async generate(featureDescription: string): Promise<string> {
    return this.ask(`Genera una implementación lista para producción para: ${featureDescription}`, {
      temperature: 0.5
    });
  }
}
