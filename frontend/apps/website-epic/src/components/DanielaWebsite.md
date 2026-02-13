# DanielaWebsite Component

## Overview

The `DanielaWebsite` component is a versatile AI assistant interface that provides three different variants for various use cases across the AIGestion website. It integrates with the backend API to provide real-time conversational capabilities with contextual responses.

## Variants

### 1. Widget Variant (`variant="widget"`)

- **Use Case**: Floating chat widget for website corners
- **Features**:
  - Collapsible interface
  - Minimalist design
  - Expandable conversation view
  - Quick suggestions
- **Position**: Fixed positioning, typically bottom-right corner
- **Size**: Compact (320px width, responsive)

### 2. Assistant Variant (`variant="assistant"`)

- **Use Case**: Full-featured chat assistant
- **Features**:
  - Complete conversation panel
  - Real-time system status
  - Message history
  - Advanced suggestions grid
  - Typing indicators
- **Layout**: Sidebar or modal style
- **Size**: Medium (384px width, 600px height)

### 3. Advisor Variant (`variant="advisor"`)

- **Use Case**: Integrated advisor for specific sections
- **Features**:
  - Context-aware responses
  - Feature showcase
  - Advanced capabilities display
  - Professional interface
- **Layout**: Embedded component
- **Size**: Flexible, adapts to container

## Contexts

The component adapts its behavior based on the context:

### Homepage (`context="homepage"`)

- **Title**: "💡 Asistente Inteligente"
- **Subtitle**: "Optimiza tu negocio con IA"
- **Focus**: Services overview, technology explanation, ROI calculations
- **Suggestions**: "¿Qué servicios ofrecen?", "¿Cómo funciona la IA?", "¿Cuál es el ROI?"

### Contact (`context="contact"`)

- **Title**: "🤝 Consultora de Contacto"
- **Subtitle**: "Conecta con expertos"
- **Focus**: Lead generation, meeting scheduling, portfolio showcase
- **Suggestions**: "Agendar llamada", "Ver portfolio", "Solicitar demostración"

### Pricing (`context="pricing"`)

- **Title**: "💰 Asesor Financiero"
- **Subtitle**: "Maximiza tu inversión"
- **Focus**: Plan comparison, ROI calculation, custom quotes
- **Suggestions**: "Ver planes disponibles", "Calcular ROI", "Obtener cotización"

### About (`context="about"`)

- **Title**: "🏢 Guía de Empresa"
- **Subtitle**: "Descubre nuestra historia"
- **Focus**: Company story, team information, technology details
- **Suggestions**: "Nuestra misión", "Tecnología usada", "Casos de éxito"

## Props

```typescript
interface DanielaWebsiteProps {
  className?: string; // Additional CSS classes
  variant?: 'widget' | 'assistant' | 'advisor'; // Component variant
  context?: 'homepage' | 'contact' | 'pricing' | 'about'; // Behavioral context
}
```

## API Integration

The component integrates with the `danielaApi` service:

### Methods Used

- `checkConnectivity()`: Verifies backend connection
- `getSystemStatus()`: Retrieves system health information
- `chat(message, userId, sessionId)`: Sends messages and receives responses

### Fallback Behavior

When the backend is unavailable, the component:

- Shows "Modo demostración" status
- Provides contextual fallback responses
- Maintains full UI functionality
- Continues to suggest relevant actions

## Styling

The component uses dedicated CSS classes defined in `daniela-website.css`:

### Key Classes

- `.daniela-widget`: Widget variant styling
- `.daniela-assistant`: Assistant variant styling
- `.daniela-advisor`: Advisor variant styling
- `.daniela-messages`: Message container
- `.typing-indicator`: Animation for "thinking" state
- `.suggestion-btn`: Interactive suggestion buttons

### Design System

- **Colors**: Nexus theme (cyan, violet, gold)
- **Typography**: Orbitron font for headers, system font for content
- **Animations**: Smooth transitions, pulse effects, typing indicators
- **Responsive**: Mobile-first design with breakpoints

## Usage Examples

### Basic Widget

```tsx
<DanielaWebsite variant="widget" context="homepage" />
```

### Full Assistant

```tsx
<DanielaWebsite variant="assistant" context="contact" className="custom-chat-panel" />
```

### Integrated Advisor

```tsx
<DanielaWebsite variant="advisor" context="pricing" />
```

## Features

### Conversation Management

- Message history with timestamps
- User/Daniela message differentiation
- Auto-scroll to latest messages
- Typing indicators during API calls

### Smart Suggestions

- Context-aware suggestion generation
- Click-to-fill functionality
- Dynamic suggestion updates based on conversation

### System Status

- Real-time connectivity monitoring
- Backend health checks
- Graceful fallback handling
- Visual status indicators

### Responsive Design

- Mobile-optimized layouts
- Touch-friendly interactions
- Adaptive sizing
- Accessibility considerations

## Testing

The component includes comprehensive tests in `DanielaWebsite.test.tsx`:

- Variant rendering tests
- Context behavior tests
- API integration tests
- User interaction tests
- Responsive behavior tests

## Performance

- **Bundle Size**: ~14KB (gzipped)
- **Render Performance**: Optimized with React.memo where appropriate
- **API Calls**: Debounced and cached
- **Animations**: Hardware-accelerated CSS transforms

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Android Chrome)

## Future Enhancements

- Voice input/output integration
- Multi-language support
- Custom themes
- Advanced analytics
- File sharing capabilities
- Video chat integration
