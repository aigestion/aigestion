/**
 * 🌌 Script para llamar a Daniela IA - AI Agent Orchestrator
 * Versión sanitizada para uso operacional seguro.
 */

// Usar variables de entorno para evitar hardcoding
const TARGET_PHONE = process.env.DANIELA_TARGET_PHONE;
const COUNTRY_CODE = process.env.DANIELA_COUNTRY_CODE || '+34';

async function llamarDaniela() {
  try {
    console.log('🌌 Iniciando orquestación de voz AIGestion...');
    
    if (!TARGET_PHONE) {
      console.error('❌ DANIELA_TARGET_PHONE no configurada en el entorno.');
      process.exit(1);
    }

    // Nota: El servicio se importa de forma dinámica para mayor flexibilidad en scripts de mantenimiento
    const { twilioService } = await import('../../backend/src/services/twilio.service.js');
    
    console.log(`📞 Iniciando llamada para: ${TARGET_PHONE}`);
    
    const telefonoFormateado = twilioService.formatPhoneNumber(TARGET_PHONE, COUNTRY_CODE);
    
    if (!twilioService.validatePhoneNumber(telefonoFormateado)) {
      throw new Error('Número de teléfono inválido');
    }
    
    const resultado = await twilioService.makeDanielaCall(telefonoFormateado, 'general');
    
    console.log('✅ Llamada iniciada con éxito:', resultado.sid);
    
  } catch (error) {
    console.error('❌ Error operacional:', error.message);
    console.log('💡 Solución: Asegúrate de tener cargadas las variables de entorno de Twilio.');
  }
}

llamarDaniela();
