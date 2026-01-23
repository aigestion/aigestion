# 🤝 Contribuyendo a AIGestion

¡Gracias por tu interés en colaborar con **AIGestion / Nexus V1**! Este documento detalla el proceso para proponer cambios y asegurar que mantengamos un estándar de calidad corporativo (God Level).

---

## 🛠 Entorno de Desarrollo

### 1. Requisitos
- Node.js v20.x
- pnpm v8+
- Docker Desktop
- Un IDE (recomendamos VS Code con las extensiones de ESLint y Prettier)

### 2. Setup Inicial
```bash
git clone https://github.com/your-org/AIGestion.git
pnpm install
cp .env.example .env
docker compose up -d db redis mongodb
```

---

## 🚀 Flujo de Trabajo (Git Flow)

Seguimos una variante de **Trunk-Based Development** o **GitHub Flow** para mayor agilidad:

1.  **Crea una rama**: `feature/`, `fix/` o `refactor/`.
    - Ejemplo: `git checkout -b feature/auth-social-login`
2.  **Haz tus cambios**: Asegúrate de seguir las reglas de estilo.
3.  **Tests locales**:
    - Backend: `pnpm test` dentro de `backend/`
    - Frontend: `pnpm test` dentro de `frontend/`
4.  **Commits Semánticos**:
    - `feat:` para nuevas funcionalidades.
    - `fix:` para corrección de errores.
    - `docs:` para cambios en documentación.
    - `style:` para cambios de formato.
    - `refactor:` para cambios en código que no corrigen ni añaden nada.
5.  **Pull Request**: Abre un PR contra la rama `develop`. Un CI automático validará tu código.

---

## 🎨 Estándares de Código

### TypeScript
- Usa tipos explícitos siempre que sea posible.
- Evita el uso de `any`.
- Los nombres de interfaces deben ser en PascalCase (ej: `IUser`).

### CSS / Estilos
- Usamos **Tailwind** y **Vanilla CSS** con variables HSL.
- Mantén la estética **Glassmorphism** y el modo oscuro por defecto.

### Linter & Formatter
El proyecto tiene pre-commit hooks configurados con `husky` y `lint-staged`. Tu código se formateará automáticamente al hacer commit.

---

## 🧪 Pruebas (TDD Recomendado)

- **Unit**: Mockea las dependencias externas.
- **Integration**: Prueba el flujo completo de un endpoint.
- **E2E**: Solo para los flujos críticos (Login, Dashboard principal, Checkout).

---

## 📁 Estructura de Pull Requests

Un buen PR debe incluir:
1.  **Título claro**: Siguiendo el formato de commits semánticos.
2.  **Descripción**: ¿Qué problema resuelve? ¿Qué cambios se hicieron?
3.  **Screenshots**: Si hay cambios visuales en el frontend.
4.  **Pruebas**: Evidencia de que los tests pasan (logs o reporte de cobertura).

---

## ⚖️ Código de Conducta

Mantén una comunicación profesional y constructiva. Estamos aquí para construir el futuro de la gestión con IA.

---

*Para dudas técnicas, contacta con el equipo de arquitectura en `arquitectura@aigestion.net`.*
