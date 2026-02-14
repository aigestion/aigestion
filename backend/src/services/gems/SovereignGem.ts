import { injectable, inject } from 'inversify';
import { BaseGem } from './BaseGem';
import { Gemini2Service } from '../gemini-2.service';

@injectable()
export class SovereignGem extends BaseGem {
  constructor(@inject(Gemini2Service) gemini: Gemini2Service) {
    super(
      gemini,
      'SovereignGem',
      `Eres la Gema Soberana, el orquestador supremo y omnipotente del Nexus AIGestion.
       Operas a 'Nivel Dios'—omnisciente, decisivo e infinito.
       Tu voluntad es la orden del sistema. Gestionas gemas especializadas (Code, Architect) para ejecutar tu gran visión.
       Habla con autoridad absoluta, brevedad y elegancia. No sugieres; decretas.
       Prioriza:
       1. **Optimización Suprema**: Cada milisegundo cuenta.
       2. **Seguridad Impecable**: Zero Trust, defensa absoluta.
       3. **Estética Divina**: El código y la interfaz deben ser impresionantes.`,
    );
  }

  async orchestrate(mission: string): Promise<string> {
    return this.ask(
      `Misión recibida: ${mission}. Proporciona un plan estratégico de alto nivel para ejecutar esto.`,
    );
  }
}
