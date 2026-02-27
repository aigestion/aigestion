// 🚀 Twilio Webhook Configuration for Daniela IA
// Configuración de Webhooks para llamadas con IA

const express = require('express');
const { VoiceResponse } = require('twilio').twiml;
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de puertos
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'https://aigestion.net';

// 🤖 Webhook principal para llamadas entrantes
app.post('/api/twilio/voice', (req, res) => {
    console.log('📞 Llamada entrante detectada');
    console.log('From:', req.body.From);
    console.log('To:', req.body.To);
    
    const response = new VoiceResponse();
    
    // Mensaje de bienvenida de Daniela IA
    const gather = response.gather({
        input: 'speech',
        timeout: 3,
        language: 'es-ES',
        hints: 'venta,soporte,información,demo,precios',
        action: `${BASE_URL}/api/twilio/process-speech`,
        method: 'POST'
    });
    
    gather.say({ 
        language: 'es-ES', 
        voice: 'Polly.Lucia-Neural' 
    }, `
        ¡Hola! Soy Daniela IA, tu asistente inteligente de AIGestion. 
        Estoy aquí para ayudarte con lo que necesites. 
        Puedes decirme si quieres información sobre ventas, soporte técnico, 
        solicitar una demostración o conocer nuestros precios.
        ¿En qué puedo asistirte hoy?
    `);
    
    // Si no hay respuesta después de 10 segundos
    response.say({ 
        language: 'es-ES', 
        voice: 'Polly.Lucia-Neural' 
    }, `
        No he detectado tu respuesta. 
        En un momento te conectaré con un especialista. 
        Gracias por llamar a AIGestion.
    `);
    
    response.redirect(`${BASE_URL}/api/twilio/fallback`);
    
    res.type('text/xml');
    res.send(response.toString());
});

// 🧠 Procesar respuesta del usuario con IA
app.post('/api/twilio/process-speech', async (req, res) => {
    const userSpeech = req.body.SpeechResult;
    console.log('🗣️ Usuario dijo:', userSpeech);
    
    const response = new VoiceResponse();
    
    try {
        // Analizar intención con OpenAI o Gemini
        const intent = await analyzeIntent(userSpeech);
        console.log('🎯 Intención detectada:', intent);
        
        switch (intent) {
            case 'ventas':
            case 'precios':
                response.say({ 
                    language: 'es-ES', 
                    voice: 'Polly.Lucia-Neural' 
                }, `
                    Te transferiré con un especialista en ventas. 
                    Nuestros planes empiezan desde 99€ al mes 
                    y podemos agendar una demostración personalizada.
                `);
                response.dial('+34618779308', {
                    timeout: 30,
                    action: `${BASE_URL}/api/twilio/call-status`,
                    method: 'POST'
                });
                break;
                
            case 'soporte':
                response.say({ 
                    language: 'es-ES', 
                    voice: 'Polly.Lucia-Neural' 
                }, `
                    Conectando con soporte técnico. 
                    Por favor, ten a mano tu número de cliente si lo tienes.
                `);
                response.dial('+34618779308', {
                    timeout: 30,
                    action: `${BASE_URL}/api/twilio/call-status`,
                    method: 'POST'
                });
                break;
                
            case 'demo':
                response.say({ 
                    language: 'es-ES', 
                    voice: 'Polly.Lucia-Neural' 
                }, `
                    ¡Excelente elección! Puedo agendarte una demostración 
                    inmediata o programarla para más tarde. 
                    ¿Prefieres hablar ahora con un especialista o te llamo más tarde?
                `);
                
                const gather = response.gather({
                    input: 'speech',
                    timeout: 5,
                    language: 'es-ES',
                    action: `${BASE_URL}/api/twilio/schedule-demo`,
                    method: 'POST'
                });
                
                gather.say({ 
                    language: 'es-ES', 
                    voice: 'Polly.Lucia-Neural' 
                }, 'Di "ahora" para hablar inmediatamente o "después" para agendar.');
                break;
                
            default:
                response.say({ 
                    language: 'es-ES', 
                    voice: 'Polly.Lucia-Neural' 
                }, `
                    No he entendido perfectamente tu solicitud. 
                    Te conectaré con un especialista que podrá ayudarte mejor.
                `);
                response.dial('+34618779308', {
                    timeout: 30,
                    action: `${BASE_URL}/api/twilio/call-status`,
                    method: 'POST'
                });
        }
    } catch (error) {
        console.error('❌ Error procesando intención:', error);
        response.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural' 
        }, 'Ha ocurrido un error. Te conecto con un especialista.');
        response.dial('+34618779308');
    }
    
    res.type('text/xml');
    res.send(response.toString());
});

// 📅 Agendar demostración
app.post('/api/twilio/schedule-demo', (req, res) => {
    const response = req.body.SpeechResult;
    const voiceResponse = new VoiceResponse();
    
    if (response && response.toLowerCase().includes('ahora')) {
        voiceResponse.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural' 
        }, 'Conectando inmediatamente con un especialista para tu demostración.');
        voiceResponse.dial('+34618779308');
    } else {
        voiceResponse.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural' 
        }, `
            He agendado tu demostración. Te llamaremos en las próximas 24 horas. 
            ¿Hay algo más en lo que pueda ayudarte?
        `);
        voiceResponse.hangup();
    }
    
    res.type('text/xml');
    res.send(voiceResponse.toString());
});

// 📊 Webhook para estado de llamadas
app.post('/api/twilio/call-status', (req, res) => {
    const callStatus = req.body.CallStatus;
    const callSid = req.body.CallSid;
    
    console.log(`📊 Estado de llamada ${callSid}: ${callStatus}`);
    
    // Guardar en base de datos o enviar notificación
    logCallStatus(callSid, callStatus, req.body);
    
    const response = new VoiceResponse();
    response.say({ 
        language: 'es-ES', 
        voice: 'Polly.Lucia-Neural' 
    }, 'Gracias por tu llamada. ¡Que tengas un excelente día!');
    
    res.type('text/xml');
    res.send(response.toString());
});

// 🔄 Fallback handler
app.post('/api/twilio/fallback', (req, res) => {
    console.log('🔄 Fallback activado - error en webhook principal');
    
    const response = new VoiceResponse();
    response.say({ 
        language: 'es-ES', 
        voice: 'Polly.Lucia-Neural' 
    }, `
        Lo siento, estoy experimentando dificultades técnicas. 
        Te conectaré inmediatamente con un especialista.
    `);
    response.dial('+34618779308');
    
    res.type('text/xml');
    res.send(response.toString());
});

// 🤖 Función para analizar intención con IA
async function analyzeIntent(speech) {
    // Simulación - integrar con OpenAI o Gemini
    const speechLower = speech.toLowerCase();
    
    if (speechLower.includes('venta') || speechLower.includes('precio') || speechLower.includes('coste')) {
        return 'ventas';
    } else if (speechLower.includes('soporte') || speechLower.includes('problema') || speechLower.includes('ayuda')) {
        return 'soporte';
    } else if (speechLower.includes('demo') || speechLower.includes('demostración') || speechLower.includes('ver')) {
        return 'demo';
    } else if (speechLower.includes('información') || speechLower.includes('saber') || speechLower.includes('conocer')) {
        return 'información';
    }
    
    return 'desconocido';
}

// 📊 Función para logging
function logCallStatus(callSid, status, data) {
    console.log({
        timestamp: new Date().toISOString(),
        callSid,
        status,
        from: data.From,
        to: data.To,
        duration: data.CallDuration || 0
    });
    
    // Aquí podrías guardar en MongoDB, enviar a Slack, etc.
}

// 🚀 Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Twilio webhook corriendo en puerto ${PORT}`);
    console.log(`📞 Webhook URL: ${BASE_URL}/api/twilio/voice`);
    console.log(`📊 Status URL: ${BASE_URL}/api/twilio/call-status`);
});

module.exports = app;
