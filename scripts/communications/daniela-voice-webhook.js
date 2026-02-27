const express = require('express');
const { VoiceResponse } = require('twilio').twiml;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Webhook principal con voz de Daniela IA en español
app.post('/api/twilio/voice', (req, res) => {
    console.log('📞 Llamada entrante - Daniela IA');
    console.log('De:', req.body.From);
    console.log('Para:', req.body.To);
    
    const response = new VoiceResponse();
    
    // Configurar voz en español de Amazon Polly
    const gather = response.gather({
        input: 'speech',
        timeout: 3,
        language: 'es-ES',
        hints: 'venta,soporte,información,demo,precios,ayuda',
        action: `http://localhost:${PORT}/api/twilio/process-speech`,
        method: 'POST'
    });
    
    gather.say({ 
        language: 'es-ES', 
        voice: 'Polly.Lucia-Neural'  // Voz femenina española natural
    }, `
        ¡Hola! Soy Daniela IA, tu asistente inteligente de AIGestion. 
        Estoy aquí para ayudarte con lo que necesites. 
        Puedes decirme si quieres información sobre ventas, soporte técnico, 
        solicitar una demostración o conocer nuestros precios.
        ¿En qué puedo asistirte hoy?
    `);
    
    // Si no hay respuesta
    response.say({ 
        language: 'es-ES', 
        voice: 'Polly.Lucia-Neural'
    }, `
        No he detectado tu respuesta. 
        En un momento te conectaré con Alejandro. 
        Gracias por llamar a AIGestion.
    `);
    
    response.pause({ length: 1 });
    response.say({ 
        language: 'es-ES', 
        voice: 'Polly.Lucia-Neural'
    }, 'Conectando ahora...');
    
    response.dial('+34618779308', {
        timeout: 30,
        action: `http://localhost:${PORT}/api/twilio/call-status`,
        method: 'POST'
    });
    
    res.type('text/xml');
    res.send(response.toString());
});

// Procesar respuesta con IA de Daniela
app.post('/api/twilio/process-speech', (req, res) => {
    const userSpeech = req.body.SpeechResult;
    console.log('🗣️ Usuario dijo:', userSpeech);
    
    const response = new VoiceResponse();
    const speechLower = userSpeech.toLowerCase();
    
    if (speechLower.includes('venta') || speechLower.includes('precio') || speechLower.includes('coste') || speechLower.includes('cuánto')) {
        response.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural'
        }, `
            ¡Perfecto! Te informo sobre nuestros precios. 
            Tenemos planes desde 99 euros al mes hasta 499 euros para empresas.
            ¿Te gustaría que te conecte con Alejandro para darte más detalles?
        `);
        
        const gather = response.gather({
            input: 'speech',
            timeout: 3,
            language: 'es-ES',
            hints: 'sí,no,ahora,después',
            action: `http://localhost:${PORT}/api/twilio/connect-alejandro`,
            method: 'POST'
        });
        
        gather.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural'
        }, 'Di "sí" si quieres hablar con Alejandro ahora.');
        
    } else if (speechLower.includes('soporte') || speechLower.includes('problema') || speechLower.includes('ayuda') || speechLower.includes('error')) {
        response.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural'
        }, `
            Entiendo que necesitas soporte técnico. 
            Voy a conectar contigo con Alejandro para ayudarte personalmente.
            Por favor, ten a mano los detalles de tu consulta.
        `);
        response.dial('+34618779308', {
            timeout: 30,
            action: `http://localhost:${PORT}/api/twilio/call-status`,
            method: 'POST'
        });
        
    } else if (speechLower.includes('demo') || speechLower.includes('demostración') || speechLower.includes('ver') || speechLower.includes('cómo funciona')) {
        response.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural'
        }, `
            ¡Excelente elección! AIGestion es un sistema de inteligencia artificial 
            que optimiza negocios de forma automática. 
            ¿Te gustaría que Alejandro te haga una demostración ahora mismo?
        `);
        
        const gather = response.gather({
            input: 'speech',
            timeout: 5,
            language: 'es-ES',
            hints: 'sí,no,ahora,después',
            action: `http://localhost:${PORT}/api/twilio/schedule-demo`,
            method: 'POST'
        });
        
        gather.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural'
        }, 'Di "ahora" para la demostración inmediata o "después" para agendar.');
        
    } else if (speechLower.includes('alejandro') || speechLower.includes('hablar') || speechLower.includes('persona')) {
        response.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural'
        }, `
            Por supuesto. Voy a conectar contigo con Alejandro ahora mismo.
            Un momento por favor.
        `);
        response.dial('+34618779308', {
            timeout: 30,
            action: `http://localhost:${PORT}/api/twilio/call-status`,
            method: 'POST'
        });
        
    } else {
        response.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural'
        }, `
            No he entendido perfectamente tu solicitud. 
        Soy Daniela IA, la asistente inteligente de AIGestion.
        Puedo ayudarte con ventas, soporte técnico, o demostraciones.
        Voy a conectar contigo con Alejandro para atenderte personalmente.
        `);
        response.dial('+34618779308', {
            timeout: 30,
            action: `http://localhost:${PORT}/api/twilio/call-status`,
            method: 'POST'
        });
    }
    
    res.type('text/xml');
    res.send(response.toString());
});

// Conectar con Alejandro
app.post('/api/twilio/connect-alejandro', (req, res) => {
    const response = req.body.SpeechResult;
    const voiceResponse = new VoiceResponse();
    
    if (response && (response.toLowerCase().includes('sí') || response.toLowerCase().includes('ahora'))) {
        voiceResponse.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural'
        }, 'Perfecto. Conectando con Alejandro ahora mismo.');
        voiceResponse.dial('+34618779308');
    } else {
        voiceResponse.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural'
        }, `
            Entendido. ¿Hay algo más en lo que pueda ayudarte?
            Puedes decirme "ventas", "soporte", "demo" o "hablar con Alejandro".
        `);
        voiceResponse.redirect(`http://localhost:${PORT}/api/twilio/voice`);
    }
    
    res.type('text/xml');
    res.send(voiceResponse.toString());
});

// Agendar demostración
app.post('/api/twilio/schedule-demo', (req, res) => {
    const response = req.body.SpeechResult;
    const voiceResponse = new VoiceResponse();
    
    if (response && response.toLowerCase().includes('ahora')) {
        voiceResponse.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural'
        }, '¡Excelente! Conectando inmediatamente con Alejandro para tu demostración.');
        voiceResponse.dial('+34618779308');
    } else {
        voiceResponse.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural'
        }, `
            He agendado tu demostración. Alejandro te llamará en las próximas horas.
            ¿Hay algo más en lo que pueda ayudarte antes de que te conecte con él?
        `);
        voiceResponse.pause({ length: 2 });
        voiceResponse.say({ 
            language: 'es-ES', 
            voice: 'Polly.Lucia-Neural'
        }, 'Conectando con Alejandro...');
        voiceResponse.dial('+34618779308');
    }
    
    res.type('text/xml');
    res.send(voiceResponse.toString());
});

// Estado de llamada
app.post('/api/twilio/call-status', (req, res) => {
    const callStatus = req.body.CallStatus;
    const callSid = req.body.CallSid;
    
    console.log(`📊 Estado de llamada ${callSid}: ${callStatus}`);
    
    const response = new VoiceResponse();
    response.say({ 
        language: 'es-ES', 
        voice: 'Polly.Lucia-Neural'
    }, '¡Gracias por llamar a AIGestion! Que tengas un excelente día.');
    
    res.type('text/xml');
    res.send(response.toString());
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'Daniela IA Ready', 
        timestamp: new Date().toISOString(),
        voice: 'Polly.Lucia-Neural (Spanish)',
        language: 'es-ES'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🚀 Servidor de Daniela IA iniciado');
    console.log(`📞 Webhook: http://localhost:${PORT}/api/twilio/voice`);
    console.log('🗣️ Voz: Polly.Lucia-Neural (Español)');
    console.log('🤖 Personalidad: Daniela IA - Asistente Inteligente');
    console.log('📱 Teléfono: +1 618 358 1369');
});

module.exports = app;
