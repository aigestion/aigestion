const improvements = [
    { title: "Procesador Google Tensor G3", desc: "El mismo chip potente de los Pixel 8 y 8 Pro para un rendimiento AI superior." },
    { title: "Pantalla Actua de 120Hz", desc: "Pantalla OLED de 6.1 pulgadas con una frecuencia de actualización de hasta 120Hz para un scroll ultra fluido." },
    { title: "Brillo Máximo de 2000 Nits", desc: "Visibilidad perfecta incluso bajo la luz solar directa gracias al aumento drástico del brillo." },
    { title: "Cámara Principal de 64 MP", desc: "Sensor de alta resolución para capturar detalles increíbles en cualquier condición de luz." },
    { title: "7 Años de Actualizaciones", desc: "Soporte garantizado de seguridad y SO hasta 2031, la mejor longevidad en su clase." },
    { title: "Batería de Mayor Duración", desc: "Optimización de eficiencia energética que supera las 24 horas de uso real." },
    { title: "Carga Inalámbrica Qi", desc: "Carga sin cables para una comodidad total en el día a día." },
    { title: "Resistencia IP67", desc: "Protección contra polvo y agua para mayor durabilidad." },
    { title: "Best Take (Mejor Toma)", desc: "IA que combina varias fotos para que todos salgan con su mejor expresión." },
    { title: "Magic Editor", desc: "Edición generativa avanzada para mover objetos y cambiar el cielo con un toque." },
    { title: "Audio Magic Eraser", desc: "Elimina ruidos molestos de tus videos mediante inteligencia artificial." },
    { title: "Circle to Search", desc: "Busca cualquier cosa en tu pantalla simplemente rodeándola con el dedo." },
    { title: "Live Translate", desc: "Traducción en tiempo real de conversaciones y carteles en 49 idiomas." },
    { title: "Llamadas de Claridad Cristalina", desc: "Reducción de ruido de fondo para conversaciones más nítidas." },
    { title: "Chip de Seguridad Titan M2", desc: "Protección de hardware multinivel para tus datos más sensibles." },
    { title: "VPN de Google One Incluida", desc: "Navegación segura y privada sin coste adicional." },
    { title: "Borrador Mágico", desc: "Elimina personas y objetos no deseados de tus fotos en segundos." },
    { title: "Enfoque de Foto (Unblur)", desc: "Recupera fotos antiguas o borrosas usando modelos de IA avanzados." },
    { title: "Visión Nocturna (Night Sight)", desc: "Fotografía astronómica y tomas impecables en oscuridad casi total." },
    { title: "Tono Real", desc: "Representación precisa y hermosa de todos los tonos de piel en las fotos." },
    { title: "Encuadre Guiado", desc: "Ayuda a personas con discapacidad visual a tomar las mejores selfies." },
    { title: "Detección de Accidentes de Coche", desc: "Llamada automática a servicios de emergencia si detecta una colisión grave." },
    { title: "Resumen de Grabadora", desc: "La IA resume tus grabaciones de voz automáticamente en puntos clave." },
    { title: "Redacción Inteligente", desc: "Sugerencias de texto rápidas para correos y mensajes." },
    { title: "Android 14 Nativo", desc: "Experiencia pura de Android con las últimas funciones de personalización." },
    { title: "Diseño con Bordes Redondeados", desc: "Ergonomía mejorada para un agarre más cómodo y moderno." },
    { title: "Nuevos Colores Vibrantes", desc: "Opciones como 'Celeste' y 'Aloe' que destacan con estilo propio." },
    { title: "Cubierta Trasera Mate", desc: "Acabado premium que evita las huellas dactilares y mejora el tacto." },
    { title: "Materiales Reciclados", desc: "Construido con aluminio, vidrio y plástico 100% reciclados." },
    { title: "Dual SIM (Nano + eSIM)", desc: "Flexibilidad total para viajes y líneas personales/profesionales." },
    { title: "Wi-Fi 6E", desc: "Conectividad ultra rápida en redes compatibles de última generación." },
    { title: "Bluetooth 5.3", desc: "Conexión más estable y eficiente con tus accesorios." },
    { title: "Grabación de Video 4K", desc: "Resolución cinematográfica en ambas cámaras, frontal y trasera." },
    { title: "Cámara Ultra Gran Angular", desc: "Campo de visión de 120 grados para paisajes y fotos de grupo." },
    { title: "Zoom de Alta Resolución (8x)", desc: "Zoom digital mejorado por IA que mantiene la nitidez." },
    { title: "Modo Retrato Mejorado", desc: "Desenfoque de fondo más natural y artístico." },
    { title: "Escaneo de Documentos", desc: "Digitalización rápida de papeles directamente desde la cámara." },
    { title: "Garantía de Privacidad", desc: "Indicadores visuales de uso de micrófono y cámara." },
    { title: "Antiviral por Diseño", desc: "Protección integrada contra malware y phishing." },
    { title: "Sincronización Nexus", desc: "Integración total con el ecosistema AIGestion para control remoto." },
    { title: "Face Unlock Clase 3", desc: "Reconocimiento facial seguro para pagos bancarios." },
    { title: "Huella Dactilar en Pantalla", desc: "Sensor óptico rápido y fiable bajo el cristal." },
    { title: "Ahorro de Batería Extremo", desc: "Hasta 72 horas de uso limitando funciones no esenciales." },
    { title: "Asistente de Google con Bard", desc: "Capacidades de IA generativa integradas en el asistente voz." },
    { title: "Detección de Ronquidos y Tos", desc: "Monitoreo de salud durante el sueño sin wearables." },
    { title: "Medición de Pulso por Cámara", desc: "Chequeo rápido de frecuencia cardíaca usando el sensor de cámara." },
    { title: "Termómetro (Vía App)", desc: "Integración con sensores externos para seguimiento térmico." },
    { title: "Google Cast Integrado", desc: "Comparte contenido a cualquier pantalla de forma instantánea." },
    { title: "Quick Share", desc: "Envío de archivos ultra rápido entre dispositivos Android y PC." },
    { title: "Modo Juego Optimizado", desc: "Prioriza el rendimiento y bloquea notificaciones para una mejor experiencia." }
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('improvements-container');

    improvements.forEach((imp, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.05}s`;

        card.innerHTML = `
            <div class="card-num">#${(index + 1).toString().padStart(2, '0')}</div>
            <h4>${imp.title}</h4>
            <p>${imp.desc}</p>
        `;

        container.appendChild(card);
    });

    // Observer for reveal animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
});
