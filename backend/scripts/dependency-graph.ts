import { container } from '../infrastructure/container';
import { METADATA_KEY } from 'inversify';

function generateGraph() {
  console.log('📊 GENERANDO MAPA DE DEPENDENCIAS NEXUS...');
  
  // @ts-ignore - Accediendo a internals de Inversify para introspección dev
  const bindings = container._bindingDictionary._map;
  
  mappings: for (const [key, value] of bindings.entries()) {
    const serviceName = typeof key === 'symbol' ? key.toString() : key.name || key;
    console.log(`\n🔹 ${serviceName}`);
    
    value.forEach((binding: any) => {
      const type = binding.type === 0 ? 'Instance' : 'Provider/Factory';
      const scope = binding.scope === 0 ? 'Singleton' : 'Transient';
      console.log(`   └─ [${type}] Scope: ${scope}`);
    });
  }

  console.log('\n✅ Mapa generado con éxito.');
}

generateGraph();
