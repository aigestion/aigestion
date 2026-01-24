import React from 'react';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <header style={{
        backgroundColor: '#2a2a2a',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '10px',
          background: 'linear-gradient(45deg, #00d4ff, #7b2ff7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Daniela AI
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
          Tu asistente de IA emocional con inteligencia avanzada
        </p>
      </header>

      <main>
        <section style={{
          backgroundColor: '#2a2a2a',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#00d4ff' }}>
            🧠 Características Principales
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '10px' }}>
              <h3 style={{ marginBottom: '10px', color: '#7b2ff7' }}>Inteligencia Emocional</h3>
              <p style={{ opacity: 0.8 }}>Comprensión avanzada de emociones humanas con empatía y precisión</p>
            </div>
            <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '10px' }}>
              <h3 style={{ marginBottom: '10px', color: '#00d4ff' }}>Conversación Natural</h3>
              <p style={{ opacity: 0.8 }}>Interactúa por voz o texto con fluidez y naturalidad</p>
            </div>
            <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '10px' }}>
              <h3 style={{ marginBottom: '10px', color: '#7b2ff7' }}>Análisis en Tiempo Real</h3>
              <p style={{ opacity: 0.8 }}>Procesa y analiza información contextualmente</p>
            </div>
          </div>
        </section>

        <section style={{
          backgroundColor: '#2a2a2a',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#7b2ff7' }}>
            📊 Servicios
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <h3 style={{ marginBottom: '10px', color: '#00d4ff' }}>Consultoría IA</h3>
              <p style={{ opacity: 0.8, marginBottom: '15px' }}>Implementación estratégica de soluciones de IA personalizadas</p>
              <ul style={{ opacity: 0.7, paddingLeft: '20px' }}>
                <li>Análisis de necesidades</li>
                <li>Diseño de soluciones</li>
                <li>Implementación personalizada</li>
                <li>Soporte continuo</li>
              </ul>
            </div>
            <div>
              <h3 style={{ marginBottom: '10px', color: '#7b2ff7' }}>Desarrollo a Medida</h3>
              <p style={{ opacity: 0.8, marginBottom: '15px' }}>Creación de aplicaciones de IA adaptadas a tus requerimientos</p>
              <ul style={{ opacity: 0.7, paddingLeft: '20px' }}>
                <li>Desarrollo personalizado</li>
                <li>Integración con sistemas existentes</li>
                <li>Optimización y escalabilidad</li>
                <li>Mantenimiento y actualizaciones</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={{
          backgroundColor: '#2a2a2a',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#00d4ff' }}>
            📧 Contacto
          </h2>
          <p style={{ marginBottom: '20px', opacity: 0.8 }}>
            Comienza tu transformación con Daniela AI hoy mismo
          </p>
          <form style={{ display: 'grid', gap: '15px', maxWidth: '500px' }}>
            <input
              type="text"
              placeholder="Tu nombre"
              style={{
                padding: '12px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
            />
            <input
              type="email"
              placeholder="tu@email.com"
              style={{
                padding: '12px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
            />
            <textarea
              placeholder="Cuéntanos sobre tu proyecto"
              rows={4}
              style={{
                padding: '12px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(45deg, #00d4ff, #7b2ff7)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'scale(1)';
              }}
            >
              Enviar Mensaje
            </button>
          </form>
        </section>
      </main>

      <footer style={{
        backgroundColor: '#2a2a2a',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        marginTop: '30px'
      }}>
        <p style={{ opacity: 0.7 }}>
          © 2026 AIGestion - Daniela AI. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

export default App;
