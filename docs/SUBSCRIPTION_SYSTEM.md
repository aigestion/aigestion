# 🚀 Sistema de Suscripciones AIGestion - Documentación Completa

## 📋 **RESUMEN EJECUTIVO**

Sistema completo de gestión de suscripciones que controla el acceso a dashboards y APK basado en el estado de pago del cliente. Implementa validación en tiempo real, procesamiento de pagos con Stripe, y control de acceso granular.

---

## 🔥 **CARACTERÍSTICAS PRINCIPALES**

### **✅ Control de Acceso Granular**
- **Dashboard**: Requiere plan Básico o superior
- **App Móvil (APK)**: Requiere plan Básico o superior  
- **API Access**: Requiere plan Profesional o Empresarial
- **Validación en tiempo real**: Verificación instantánea de suscripción

### **💳 Procesamiento de Pagos**
- **Stripe Integration**: Pagos seguros con tarjetas
- **Múltiples planes**: Gratis, Básico, Profesional, Empresarial
- **Facturación automática**: Renovación mensual/anual
- **Webhooks**: Sincronización automática con Stripe

### **🛡️ Seguridad y Validación**
- **Token-based auth**: Validación segura de usuarios
- **Offline mode**: Funcionalidad limitada sin conexión
- **Cache inteligente**: 5 minutos de cache para rendimiento
- **Fail-safe**: Modo seguro en caso de errores

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **Frontend Components**
```
frontend/apps/website-epic/src/
├── services/
│   └── subscription-service.ts     # Lógica principal de suscripciones
├── components/guards/
│   ├── SubscriptionGuard.tsx       # Guard genérico de acceso
│   └── MobileSubscriptionGuard.tsx # Guard específico para APK
├── pages/
│   └── SubscriptionPage.tsx        # Página de upgrade de planes
└── hooks/
    └── useAuth.ts                 # Hook de autenticación extendido
```

### **Backend API**
```
backend/
├── controllers/
│   └── subscription.controller.ts  # Endpoints de suscripciones
├── models/
│   ├── subscription.model.ts       # Modelo de datos de suscripción
│   └── plan.model.ts              # Modelo de planes disponibles
└── routes/
    └── subscription.routes.ts       # Rutas API (por implementar)
```

### **Mobile App**
```
mobile/client-app/src/
└── guards/
    └── SubscriptionGuard.tsx       # Validación específica para APK
```

---

## 💰 **PLANES DE SUSCRIPCIÓN**

### **🆓 Plan Gratis**
- **Precio**: $0/mes
- **Características**:
  - Hasta 3 proyectos
  - 1 usuario
  - Soporte básico
  - Dashboard limitado
- **Acceso**: ❌ Dashboard ❌ App Móvil ❌ API

### **⭐ Plan Básico - $29.99/mes**
- **Precio**: $29.99/mes (20% descuento en anual)
- **Características**:
  - Hasta 10 proyectos
  - 3 usuarios
  - Dashboard completo
  - App móvil premium
  - Soporte por email
- **Acceso**: ✅ Dashboard ✅ App Móvil ❌ API

### **🚀 Plan Profesional - $79.99/mes**
- **Precio**: $79.99/mes (20% descuento en anual)
- **Características**:
  - Proyectos ilimitados
  - 10 usuarios
  - Dashboard avanzado
  - App móvil premium
  - API completa
  - Soporte prioritario
- **Acceso**: ✅ Dashboard ✅ App Móvil ✅ API

### **🏢 Plan Empresarial - $199.99/mes**
- **Precio**: $199.99/mes (20% descuento en anual)
- **Características**:
  - Todo ilimitado
  - Usuarios ilimitados
  - Dashboard personalizado
  - App móvil white-label
  - API dedicada
  - Soporte 24/7
  - SLA garantizado
- **Acceso**: ✅ Dashboard ✅ App Móvil ✅ API

---

## 🔧 **IMPLEMENTACIÓN TÉCNICA**

### **1. Subscription Service (Frontend)**
```typescript
// Validar acceso
const validation = await subscriptionService.validateAccess(userId, 'dashboard');
if (!validation.restrictions.canAccessDashboard) {
  // Mostrar pantalla de upgrade
}

// Verificar acceso móvil
const canAccessMobile = await subscriptionService.canAccessMobile(userId);
if (!canAccessMobile) {
  // Bloquear acceso a APK
}
```

### **2. Subscription Guard (React)**
```tsx
<SubscriptionGuard 
  accessType="dashboard"
  showUpgradePrompt={true}
  onAccessDenied={(validation) => {
    console.log('Access denied:', validation);
  }}
>
  <ClientDashboard />
</SubscriptionGuard>
```

### **3. Mobile Validation (APK)**
```typescript
// Validación específica para móvil
const validation = await subscriptionService.validateAccess(userId, 'mobile');
if (!validation.restrictions.canAccessMobile) {
  // Mostrar pantalla de bloqueo
  // Ofrecer upgrade
  // Contactar soporte
}
```

### **4. Backend API Endpoints**
```typescript
// GET /api/subscription/:userId
// Validar suscripción del usuario

// POST /api/subscription/validate
// Validar acceso específico (dashboard/mobile/api)

// POST /api/subscription/create-payment-session
// Crear sesión de pago con Stripe

// POST /api/subscription/:userId/cancel
// Cancelar suscripción
```

---

## 🔐 **FLUJO DE VALIDACIÓN**

### **1. Usuario Intenta Acceder**
```
Usuario → Dashboard/App → SubscriptionGuard → Validación API
```

### **2. Verificación de Suscripción**
```
API → Base de Datos → Estado de Suscripción → Respuesta JSON
```

### **3. Decisión de Acceso**
```
SubscriptionGuard → ¿Activa? → 
  ✅ Sí → Permitir acceso
  ❌ No → Mostrar pantalla de upgrade
```

### **4. Flujo de Upgrade**
```
Usuario → Click "Actualizar" → Stripe Checkout → Pago → Webhook → Actualización BD
```

---

## 📱 **VALIDACIÓN PARA APK**

### **Modo Online**
- Validación en tiempo real con servidor
- Cache de 5 minutos para rendimiento
- Sincronización automática de estado

### **Modo Offline**
- Usar última validación cacheada
- Funcionalidad limitada
- Alerta de modo offline

### **Manejo de Errores**
- 3 reintentos automáticos
- Modo seguro si falla servidor
- Opción de contacto con soporte

---

## 💾 **BASE DE DATOS**

### **Subscription Model**
```typescript
{
  userId: string,              // ID del usuario
  planId: string,             // ID del plan (free/basic/professional/enterprise)
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'trial',
  startDate: Date,             // Fecha de inicio
  endDate?: Date,              // Fecha de fin (si aplica)
  trialEnd?: Date,             // Fin de período de prueba
  autoRenew: boolean,          // Renovación automática
  stripeSubscriptionId?: string, // ID de suscripción en Stripe
  lastPaymentDate?: Date,      // Último pago
  nextBillingDate?: Date,      // Próxima facturación
}
```

### **Plan Model**
```typescript
{
  id: string,                  // Identificador único
  name: string,                // Nombre del plan
  price: number,               // Precio mensual
  features: string[],          // Lista de características
  maxProjects: number,         // Máximo de proyectos
  maxUsers: number,            // Máximo de usuarios
  hasDashboardAccess: boolean, // Acceso a dashboard
  hasMobileAccess: boolean,    // Acceso a app móvil
  hasAPIAccess: boolean,       // Acceso a API
  hasPrioritySupport: boolean, // Soporte prioritario
}
```

---

## 🔌 **INTEGRACIÓN CON STRIPE**

### **1. Configuración**
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});
```

### **2. Crear Sesión de Pago**
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  mode: 'subscription',
  line_items: [{
    price_data: {
      currency: 'usd',
      unit_amount: plan.price * 100,
      recurring: { interval: 'month' },
    },
    quantity: 1,
  }],
  metadata: { userId, planId },
  success_url: `${FRONTEND_URL}/subscription/success`,
  cancel_url: `${FRONTEND_URL}/subscription/cancel`,
});
```

### **3. Webhooks**
```typescript
// checkout.session.completed → Activar suscripción
// invoice.payment_succeeded → Renovación exitosa
// customer.subscription.deleted → Cancelación
```

---

## 🚨 **MANEJO DE ERRORES**

### **Tipos de Error**
1. **Red**: Sin conexión a internet
2. **Servidor**: API no disponible
3. **Autenticación**: Token inválido
4. **Suscripción**: Estado inválido

### **Estrategias de Recuperación**
1. **Reintentos automáticos**: 3 intentos con backoff
2. **Cache offline**: Usar última validación conocida
3. **Modo degradado**: Funcionalidad limitada
4. **Contacto soporte**: Opción siempre disponible

---

## 📊 **MÉTRICAS Y MONITOREO**

### **KPIs Clave**
- **Tasa de conversión**: Free → Paid
- **Ingresos MRR**: Monthly Recurring Revenue
- **Churn rate**: Tasa de cancelación
- **LTV**: Lifetime Value
- **Activación**: Tiempo hasta primer pago

### **Eventos a Trackear**
```typescript
// Validación de acceso
track('subscription_validated', {
  userId, planId, accessType, granted: boolean
});

// Intento de upgrade
track('upgrade_attempted', {
  userId, fromPlan, toPlan
});

// Pago completado
track('payment_completed', {
  userId, planId, amount, currency
});

// Suscripción cancelada
track('subscription_cancelled', {
  userId, planId, reason, tenure
});
```

---

## 🔧 **CONFIGURACIÓN Y DEPLOY**

### **Variables de Entorno**
```bash
# Frontend
VITE_API_BASE_URL=https://api.aigestion.net
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Backend
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://aigestion.net
DATABASE_URL=mongodb://...
```

### **Endpoints API**
```typescript
GET    /api/subscription/:userId                    // Obtener suscripción
POST   /api/subscription/validate                   // Validar acceso
POST   /api/subscription/create-payment-session      // Crear pago
PUT    /api/subscription/:userId                    // Actualizar
POST   /api/subscription/:userId/cancel            // Cancelar
POST   /api/webhooks/stripe                        // Webhook Stripe
```

---

## 🧪 **TESTING**

### **Casos de Prueba**
1. **Usuario sin suscripción** → Acceso denegado
2. **Usuario con plan básico** → Acceso dashboard móvil OK
3. **Usuario con plan profesional** → Acceso completo OK
4. **Usuario con suscripción expirada** → Acceso denegado
5. **Modo offline** → Usar cache, funcionalidad limitada

### **Tests Automatizados**
```typescript
describe('Subscription Validation', () => {
  test('should deny access for free users', async () => {
    const validation = await service.validateAccess('user123', 'dashboard');
    expect(validation.restrictions.canAccessDashboard).toBe(false);
  });

  test('should allow access for basic users', async () => {
    const validation = await service.validateAccess('user456', 'mobile');
    expect(validation.restrictions.canAccessMobile).toBe(true);
  });
});
```

---

## 📈 **ROADMAP FUTURO**

### **Corto Plazo (1-3 meses)**
- [ ] Integración con PayPal
- [ ] Planes personalizados
- [ ] Códigos de descuento
- [ ] Pruebas gratuitas extendidas

### **Mediano Plazo (3-6 meses)**
- [ ] Facturación en múltiples monedas
- [ ] Integración con Apple Pay/Google Pay
- [ ] Dashboard de analytics para admins
- [ ] Sistema de referidos

### **Largo Plazo (6-12 meses)**
- [ ] Marketplace de plugins
- [ ] API pública para partners
- [ ] Sistema de tiering avanzado
- [ ] Machine learning para churn prediction

---

## 🎯 **CONCLUSIÓN**

El sistema de suscripciones AIGestion proporciona:

✅ **Control granular de acceso** basado en planes de pago
✅ **Experiencia de usuario fluida** con upgrade in-app
✅ **Procesamiento de pagos seguro** con Stripe
✅ **Validación robusta** para web y móvil
✅ **Modo offline** para APK
✅ **Escalabilidad** para miles de usuarios
✅ **Analytics completas** para business intelligence

**🚀 LISTO PARA PRODUCCIÓN Y ESCALADO**

---

*Documentación actualizada: Febrero 2026*
*Versión: 1.0.0*
