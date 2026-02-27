const improvements = [
  {
    title: 'Google Tensor G2',
    desc: 'El potente chip que impulsa funciones de avanzada IA en el Pixel 7a.',
  },
  {
    title: 'Pantalla Fluida de 90Hz',
    desc: 'Una mejora significativa sobre el modelo anterior para una navegación suave.',
  },
  {
    title: 'Carga Inalámbrica',
    desc: "La primera vez que la serie 'a' incluye carga sin cables Qi.",
  },
  {
    title: 'Cámara Principal de 64 MP',
    desc: 'Sensor de alta resolución que captura un 72% más de luz que el Pixel 6a.',
  },
  {
    title: '8 GB de RAM LPDDR5',
    desc: 'Más memoria para una multitarea fluida y carga rápida de apps.',
  },
  {
    title: 'Desbloqueo Facial',
    desc: 'Seguridad biometríca rápida y conveniente añadida a la serie 7a.',
  },
  {
    title: 'Zoom de Alta Resolución (8x)',
    desc: 'Algoritmos avanzados que mantienen la nitidez incluso sin lente teleobjetivo.',
  },
  {
    title: 'Cámara Ultra Gran Angular de 13 MP',
    desc: 'Campo de visión de 120 grados para capturar más en cada toma.',
  },
  { title: 'Cámara Frontal de 13 MP', desc: 'Mejora en selfies y soporte para video 4K.' },
  { title: 'Resistencia IP67', desc: 'Certificación contra agua y polvo para mayor tranquilidad.' },
  {
    title: 'Arquitectura de Seguridad Titan M2',
    desc: 'El mismo chip de seguridad utilizado en los modelos Pro.',
  },
  {
    title: 'Batería Inteligente Todo el Día',
    desc: 'Aprende tus patrones de uso para durar más de 24 horas.',
  },
  {
    title: 'Ahorro de Batería Extremo',
    desc: 'Extiende la vida útil hasta 72 horas en situaciones críticas.',
  },
  {
    title: 'Materiales Reciclados Premium',
    desc: 'Aluminio 100% reciclado en la estructura interna.',
  },
  {
    title: 'Fotografía Astronómica',
    desc: 'Captura las estrellas con el modo Visión Nocturna especializado.',
  },
  {
    title: 'Enfoque de Foto (Photo Unblur)',
    desc: 'Recupera fotos borrosas, incluso las tomadas con teléfonos antiguos.',
  },
  { title: 'Borrador Mágico', desc: 'Elimina distracciones de tus fotos con un solo toque.' },
  {
    title: 'Tono Real (Real Tone)',
    desc: 'Representación fiel de la diversidad de tonos de piel.',
  },
  {
    title: 'Llamadas de Claridad',
    desc: 'Reduce el ruido ambiental del interlocutor para oírlo mejor.',
  },
  {
    title: 'Traducción Instantánea',
    desc: 'Traduce mensajes, menús y audio en tiempo real sin conexión.',
  },
  {
    title: 'Escribe por Voz con Google Assistant',
    desc: 'Dictado ultra rápido que entiende emojis y puntuación.',
  },
  {
    title: 'Atajos de Google Assistant',
    desc: 'Accede a funciones de tus apps favoritas solo con la voz.',
  },
  {
    title: 'VPN de Google One',
    desc: 'Capa adicional de seguridad para tu conexión Wi-Fi (sujeto a región).',
  },
  {
    title: 'Indicadores de Privacidad',
    desc: 'Alertas visuales cuando se usa la cámara o el micrófono.',
  },
  {
    title: 'Tablero de Seguridad y Privacidad',
    desc: 'Control centralizado de todos tus permisos y datos.',
  },
  {
    title: 'Detección de Accidentes',
    desc: 'Llamada automática a emergencias si el teléfono detecta un impacto.',
  },
  {
    title: 'Check-in de Seguridad',
    desc: 'Avisa a tus contactos si no llegas a tu destino a tiempo.',
  },
  {
    title: 'Localización Mejorada',
    desc: 'GPS de doble banda para mayor precisión en ciudades densas.',
  },
  { title: 'Wi-Fi 6E', desc: 'Soporte para las redes inalámbricas más rápidas y estables.' },
  {
    title: 'Bluetooth 5.3 con LE Audio',
    desc: 'Mejor calidad de sonido inalámbrico y menor latencia.',
  },
  {
    title: 'Estéreo Real',
    desc: 'Altavoces frontales y laterales para una experiencia inmersiva.',
  },
  {
    title: 'Grabación 4K a 60 FPS',
    desc: 'Calidad de video profesional en la cámara trasera principal.',
  },
  {
    title: 'Cámara Lenta a 240 FPS',
    desc: 'Efectos dramáticos capturando cada detalle del movimiento.',
  },
  {
    title: 'Time-lapse de Astrofotografía',
    desc: 'Crea videos impresionantes del cielo nocturno.',
  },
  {
    title: 'Modo Cine (Cinematic Blur)',
    desc: 'Efecto de profundidad de campo cinematográfico en tus videos.',
  },
  {
    title: 'Captura Nocturna en Video',
    desc: 'Mejoras de ruido y brillo en condiciones de poca luz.',
  },
  {
    title: 'Encuadre Guiado para Selfies',
    desc: 'Accesibilidad mejorada para personas con baja visión.',
  },
  { title: 'Soporte para Dual SIM', desc: 'Utiliza dos números a la vez con Nano SIM y eSIM.' },
  { title: 'Carga Rápida de 18W', desc: 'Recupera energía rápidamente cuando más lo necesitas.' },
  { title: 'Huella Dactilar en Pantalla', desc: 'Acceso seguro y rápido bajo el cristal frontal.' },
  {
    title: 'NFC para Pagos',
    desc: 'Usa Google Wallet de forma segura en cualquier terminal contactless.',
  },
  {
    title: 'Actualizaciones de Seguridad Mensuales',
    desc: 'Protección constante contra las últimas amenazas.',
  },
  { title: 'Feature Drops', desc: 'Nuevas funciones añadidas periódicamente de forma gratuita.' },
  {
    title: 'Sincronización con Pixel Buds',
    desc: 'Cambio automático de audio entre dispositivos.',
  },
  {
    title: 'Control del Hogar Inteligente',
    desc: 'Acceso rápido a dispositivos Google Home desde el bloqueo.',
  },
  {
    title: 'Transcripción de Mensajes de Voz',
    desc: 'Lee lo que te dicen sin necesidad de escuchar el audio.',
  },
  {
    title: 'Filtro de Llamadas',
    desc: 'El asistente contesta por ti para evitar el spam telefónico.',
  },
  { title: 'Direct My Call', desc: 'Menús visuales para servicios de atención al cliente.' },
  {
    title: 'Wait Times',
    desc: 'Información sobre cuánto tiempo tardarán en atenderte por teléfono.',
  },
  {
    title: 'Diseño Sovereign Nexus',
    desc: 'Integración estética con el ecosistema AIGestion God Mode.',
  },
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

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    observer.observe(card);
  });
});
