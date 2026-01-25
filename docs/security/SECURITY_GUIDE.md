# 🔒 Guía de Seguridad - AIGestion (NEXUS V1)

## 📋 Resumen de Seguridad

Este documento describe las medidas de seguridad implementadas en el proyecto AIGestion para proteger la aplicación, los datos de los usuarios y la infraestructura subyacente.

## 🛡️ Medidas de Seguridad Implementadas

### 1. Auditoría Regular de Dependencias

#### GitHub Actions - Security Audit

- **Archivo**: `.github/workflows/security-audit.yml`
- **Frecuencia**: Todos los lunes a las 2:00 AM UTC
- **Activadores**: Push a main, cambios en archivos de dependencias

**Características**:

- Auditoría de dependencias Node.js (pnpm audit)
- Auditoría de dependencias Python (pip-audit, safety)
- Escaneo con Trivy para vulnerabilidades
- Integración con Snyk para análisis continuo
- Generación de reportes automáticos

#### Script Local - Security Audit

- **Archivo**: `scripts/security-audit.js`
- **Uso**: `node scripts/security-audit.js`

**Características**:

- Análisis de dependencias locales
- Detección de paquetes desactualizados
- Reporte en formato JSON
- Salida coloreada para fácil interpretación

### 2. Content Security Policy (CSP) Mejorado

#### Implementación

- **Archivo**: `backend/src/middleware/csp.middleware.ts`
- **Configuración**: Dinámica basada en entorno

**Directivas CSP**:

```javascript
{
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-eval'"], // Solo en desarrollo
  styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
  imgSrc: ["'self'", "data:", "https:", "blob:"],
  connectSrc: [
    "'self'", "ws:", "wss:",
    "api.openai.com", "api.anthropic.com",
    "googleapis.com", "vertexai.googleapis.com",
    "pinecone.io"
  ],
  fontSrc: ["'self'", "fonts.gstatic.com", "data:"],
  objectSrc: ["'none'"],
  frameSrc: ["'none'"],
  childSrc: ["'none'"],
  workerSrc: ["'self'", "blob:"],
  upgradeInsecureRequests: [] // Solo en producción
}
```

**Características**:

- CSP dinámico según entorno
- Políticas más restrictivas para rutas de autenticación
- Reporte de violaciones para monitoreo
- Soporte para endpoints de IA y APIs externas

### 3. Escaneo de Vulnerabilidades Automatizado

#### GitHub Actions - Vulnerability Scan

- **Archivo**: `.github/workflows/vulnerability-scan.yml`
- **Frecuencia**: Diariamente a las 3:00 AM UTC

**Tipos de Escaneo**:

1. **Contenedores Docker**: Trivy para imágenes de backend, frontend, ML service
2. **Código Fuente**: CodeQL para JavaScript y Python
3. **Secretos**: Gitleaks y TruffleHog
4. **Dependencias**: OWASP Dependency Check

#### Script Local - Vulnerability Scan

- **Archivo**: `scripts/vulnerability-scan.sh`
- **Uso**: `chmod +x scripts/vulnerability-scan.sh && ./scripts/vulnerability-scan.sh`

**Características**:

- Escaneo completo de imágenes Docker
- Análisis de dependencias Node.js y Python
- Detección de secretos en el código
- Generación de reportes Markdown
- Limpieza automática de recursos

### 4. Políticas de Seguridad Mejoradas

#### Middleware de Seguridad

- **Archivo**: `backend/src/middleware/security.middleware.ts`

**Características**:

- Rate limiting por niveles de usuario (Free/Pro/Enterprise)
- Límites específicos por endpoint (Auth, IA, Upload)
- Seguridad basada en IP
- Validación de API keys
- Monitoreo de seguridad
- Límites de tamaño de solicitud

#### Configuración de Seguridad

- **Archivo**: `backend/src/config/security.config.ts`

**Configuraciones**:

- Validación con Zod schema
- Configuración desde variables de entorno
- Valores por defecto seguros
- Soporte para diferentes entornos

## 🔐 Configuración de Seguridad

### Variables de Entorno

```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_FREE_MAX=100
RATE_LIMIT_PRO_MAX=1000
RATE_LIMIT_ENTERPRISE_MAX=10000

# CSP
CSP_REPORT_ONLY=false

# API Security
REQUIRE_API_KEY=true
API_KEY_FORMAT=nexus_[a-f0-9]{32}

# File Upload
MAX_FILE_SIZE=10mb
MAX_FILES=5
SCAN_UPLOADS_FOR_MALWARE=true

# IP Security
ENABLE_IP_BLOCKING=true
BLOCKED_IPS=192.168.1.100,10.0.0.50

# Monitoring
LOG_SECURITY_EVENTS=true
SECURITY_LOG_LEVEL=warn
ENABLE_SECURITY_METRICS=true
```

### Headers de Seguridad

La aplicación implementa los siguientes headers de seguridad:

- **Content-Security-Policy**: Política de contenido restrictiva
- **Strict-Transport-Security**: HTTPS forzado
- **X-Frame-Options**: Prevención de clickjacking
- **X-Content-Type-Options**: Prevención de MIME sniffing
- **Referrer-Policy**: Control de información de referer
- **X-XSS-Protection**: Filtro XSS del navegador

## 🚨 Monitoreo y Alertas

### Eventos de Seguridad Monitoreados

1. **Intentos de autenticación fallidos**
2. **Solicitudes sospechosas**
3. **Violaciones de CSP**
4. **Límites de rate excedidos**
5. **Acceso desde IPs bloqueadas**
6. **Uploads de archivos sospechosos**

### Umbrales de Alerta

```javascript
{
  failedAuthAttempts: 10,
  suspiciousRequests: 50,
  slowRequests: 100
}
```

### Integración con Monitoreo

- **Sentry**: Error tracking y rendimiento
- **Prometheus**: Métricas de seguridad
- **OpenTelemetry**: Tracing distribuido
- **Logs**: Winston con rotación diaria

## 📊 Reportes de Seguridad

### Tipos de Reportes

1. **Reporte de Auditoría de Dependencias**
   - Generado: Lunes semanal
   - Formato: JSON + Markdown
   - Contenido: Vulnerabilidades, paquetes desactualizados

2. **Reporte de Escaneo de Vulnerabilidades**
   - Generado: Diario
   - Formato: SARIF + JSON
   - Contenido: Escaneo de contenedores, código, secretos

3. **Reporte de Eventos de Seguridad**
   - Generado: Tiempo real
   - Formato: Logs estructurados
   - Contenido: Eventos sospechosos, intentos de ataque

### Acceso a Reportes

- **GitHub Security Tab**: Resultados de CodeQL y Trivy
- **Sentry Dashboard**: Errores y rendimiento
- **Prometheus Dashboard**: Métricas en tiempo real
- **Log Files**: Archivos de logs rotativos

## 🛠️ Herramientas de Seguridad

### Herramientas Implementadas

1. **Trivy**: Escaneo de vulnerabilidades en contenedores
2. **CodeQL**: Análisis estático de código
3. **Gitleaks**: Detección de secretos
4. **Snyk**: Análisis de dependencias
5. **OWASP Dependency Check**: Vulnerabilidades en dependencias
6. **Helmet**: Headers de seguridad para Express
7. **Rate Limiting**: Protección contra ataques DDoS

### Integración CI/CD

```yaml
# .github/workflows/security-audit.yml
- name: Audit dependencies
  run: pnpm audit --audit-level moderate

- name: Run Trivy
  uses: aquasecurity/trivy-action@master

- name: Run CodeQL
  uses: github/codeql-action/analyze@v2

- name: Run Gitleaks
  uses: gitleaks/gitleaks-action@v2
```

## 🔄 Procedimientos de Respuesta

### Incidentes de Seguridad

1. **Detección Automática**
   - Monitoreo continuo
   - Alertas automáticas
   - Análisis de logs

2. **Clasificación**
   - Baja: Información recolectada
   - Media: Investigación requerida
   - Alta: Respuesta inmediata
   - Crítica: Escalado urgente

3. **Respuesta**
   - Contención del incidente
   - Análisis forense
   - Comunicación a stakeholders
   - Implementación de correcciones

### Plan de Recuperación

1. **Backup de Datos**
   - Backups diarios automáticos
   - Almacenamiento en múltiples ubicaciones
   - Pruebas periódicas de restauración

2. **Recuperación de Servicios**
   - Procedimientos de failover
   - Documentación de recuperación
   - Simulacros de desastres

## 📈 Mejoras Continuas

### Próximas Mejoras Planificadas

1. **Short Term (1-3 meses)**
   - Implementación de Web Application Firewall (WAF)
   - Escaneo de malware en uploads
   - Autenticación de dos factores

2. **Medium Term (3-6 meses)**
   - Integración con threat intelligence
   - Análisis de comportamiento de usuarios
   - Encriptación de campo a nivel de base de datos

3. **Long Term (6+ meses)**
   - Zero Trust Architecture
   - Homomorphic encryption para datos sensibles
   - Quantum-resistant cryptography

### Métricas de Seguridad

- **MTTR (Mean Time to Respond)**: < 4 horas
- **MTTD (Mean Time to Detect)**: < 15 minutos
- **Vulnerability Remediation**: < 72 horas
- **Security Test Coverage**: > 90%

## 📞 Contacto de Seguridad

Para reportar incidentes de seguridad:

- **Email**: security@aigestion.com
- **PGP Key**: Disponible en request
- **Bug Bounty**: Programa activo en HackerOne

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [SANS Security Controls](https://www.sans.org/controls/)
- [CIS Controls](https://www.cisecurity.org/controls/)

---

**Última actualización**: Enero 2026
**Versión**: 1.0
**Responsable**: Equipo de Seguridad AIGestion
