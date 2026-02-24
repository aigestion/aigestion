# 📊 GOOGLE ANALYTICS 4 SETUP - AIGESTION

## 🎯 PASOS RÁPIDOS PARA COMPLETAR LA CONFIGURACIÓN

### 1. CREAR PROPIEDAD GOOGLE ANALYTICS 4

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Administrar" (engranaje)
4. En "Cuenta", haz clic en "Crear cuenta"
5. Selecciona "Web" y añade el nombre: "AIGestion Analytics"
6. Configura el flujo de datos y crea la propiedad
7. **Copia el ID de Medición** (formato: G-XXXXXXXXXX)

### 2. ACTUALIZAR VARIABLES DE ENTORNO

Edita el archivo `.env` y reemplaza `G-XXXXXXXXXX` con tu ID real:

```env
GOOGLE_ANALYTICS_ID=G-TU_ID_REAL_AQUI
GOOGLE_ANALYTICS_MEASUREMENT_ID=G-TU_ID_REAL_AQUI
```

### 3. INTEGRAR EN EL APLICATIVO

En tu archivo principal de React (App.tsx):

```tsx
import { AnalyticsProvider } from './components/AnalyticsProvider';

function App() {
  return (
    <AnalyticsProvider>
      {/* Tu aplicación existente */}
    </AnalyticsProvider>
  );
}
```

### 4. VERIFICAR CONFIGURACIÓN

1. Abre el website en modo incógnito
2. Abre Google Analytics en tiempo real
3. Navega por el website
4. Deberías ver eventos en tiempo real

### 5. USAR ANALYTICS EN COMPONENTES

```tsx
import { useAnalytics } from './components/AnalyticsProvider';

function MyComponent() {
  const { trackFeature, trackAIChat, trackError } = useAnalytics();

  const handleButtonClick = () => {
    trackFeature('dashboard_view', 'navigation');
  };

  const handleAIChat = () => {
    trackAIChat('gemini-2.5-flash', 'session-123', true);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>View Dashboard</button>
      <button onClick={handleAIChat}>Start AI Chat</button>
    </div>
  );
}
```

## 📈 EVENTOS CONFIGURADOS

### Eventos Automáticos
- `page_view`: Cada cambio de página
- `session_start`: Inicio de sesión
- `first_visit`: Primera visita

### Eventos Personalales
- `ai_chat_start`: Inicio de chat con IA
- `ai_chat_end`: Fin de chat con IA
- `feature_used`: Uso de características
- `error_occurred`: Errores de aplicación
- `performance_metric`: Métricas de rendimiento

## 🚀 ESTADO ACTUAL

✅ **Configuración base completada:**
- Variables de entorno configuradas
- Servicio de Analytics creado
- Componente Provider creado
- Documentación lista

⚠️ **Pendiente:**
- Obtener ID real de Google Analytics
- Integrar en App.tsx
- Verificar eventos en tiempo real

## 📊 MÉTRICAS CLAVE A MONITOREAR

1. **Usuarios Activos**: Tasa de engagement
2. **Duración de Sesión**: Calidad del contenido
3. **Tasa de Rebote**: Experiencia de usuario
4. **Eventos de IA**: Uso de características principales
5. **Conversiones**: Trial → Suscripción

---

*Última actualización: 24/02/2026*
*Estado: Configuración base completada*
