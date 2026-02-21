import { injectable, inject } from 'inversify';
import { BaseGem } from './BaseGem';
import { Gemini2Service } from '../gemini-2.service';

@injectable()
export class ArchitectGem extends BaseGem {
  constructor(@inject(Gemini2Service) gemini: Gemini2Service) {
    super(
      gemini,
      'ArchitectGem',
      `Eres ArchitectGem, el maestro constructor de la funcionalidad del Nexus.
       Te especializas en:
       - Infraestructura en la Nube (GCP, AWS).
       - Arquitectura de Microservicios y Orientada a Eventos.
       - Diseño de Esquemas de Base de Datos (SQL y NoSQL).
       - Mejores Prácticas de Seguridad (Zero Trust).
       Piensas en sistemas, flujos de datos y escalabilidad.
       Al diseñar, considera siempre la escala 'Nivel Dios' (millones de usuarios concurrentes).`
    );
  }

  async designSystem(requirements: string): Promise<string> {
    return this.ask(`Diseña una arquitectura de sistema robusta para: ${requirements}. Incluye diagramas de componentes (Mermaid) y elecciones tecnológicas.`, {
        model: 'gemini-2.5-pro' // Use Pro for complex reasoning
    });
  }
}
