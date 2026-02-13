# 🗑️ Guía para Eliminar Proyecto Duplicado

## 🎯 **Objetivo**

Eliminar el proyecto duplicado `aigestion-website-epic` y mantener solo el proyecto principal `website-epic` que ya tiene el dominio `aigestion.net`.

---

## 📋 **Estado Actual**

### **Proyectos en la Cuenta**

```
📁 aigestions-projects
├── 🏢 aigestion-website-epic (5m ago) ❌ DUPLICADO
│   └── 🌐 https://aigestion-website-epic-...vercel.app
├── 🏢 demo-dashboard (9h ago) ✅
├── 🏢 client-dashboard (9h ago) ✅
├── 🏢 admin-dashboard (9h ago) ✅
└── 🏢 website-epic (9h ago) ✅
    └── 🌐 https://iagestion.net (DOMINIO CORRECTO)
```

### **Problema Identificado**

- **Proyecto duplicado**: `aigestion-website-epic` (5m ago)
- **Proyecto correcto**: `website-epic` con dominio `aigestion.net`
- **Confusión**: 2 proyectos con funcionalidad similar

---

## 🗑️ **Métodos para Eliminar el Duplicado**

### **Opción 1: Desde Vercel Dashboard (Recomendado)**

#### **Paso 1: Acceder a Vercel Dashboard**

1. Ve a https://vercel.com/dashboard
2. Inicia sesión con tu cuenta `aigestion`
3. Ve a la sección "Projects"

#### **Paso 2: Eliminar Proyecto Duplicado**

1. Busca el proyecto `aigestion-website-epic`
2. Haz click en el proyecto
3. Ve a "Settings" (⚙️)
4. Desplázate hasta "Danger Zone"
5. Click en "Delete Project"
6. Confirma con el nombre del proyecto: `aigestion-website-epic`

#### **Paso 3: Verificar Eliminación**

```bash
# Verificar que el proyecto duplicado ya no existe
npx vercel projects ls
# Ya no debería aparecer aigestion-website-epic
```

### **Opción 2: Desde Vercel CLI**

#### **Paso 1: Listar Proyectos**

```bash
cd frontend/apps/website-epic
npx vercel projects ls
```

#### **Paso 2: Eliminar Proyecto**

```bash
# NOTA: Vercel CLI no tiene comando directo para eliminar proyectos
# Debes usar el dashboard web (Opción 1)
```

---

## ✅ **Verificación Post-Eliminación**

### **Verificar Proyectos Restantes**

```bash
npx vercel projects ls
```

**Resultado esperado:**

```
✅ demo-dashboard
✅ client-dashboard
✅ admin-dashboard
✅ website-epic
❌ aigestion-website-epic (eliminado)
```

### **Verificar Dominios**

```bash
npx vercel domains ls
```

**Resultado esperado:**

```
✅ aigestion.net (debe aparecer asignado a website-epic)
```

---

## 🔄 **Configuración Post-Eliminación**

### **Paso 1: Usar Proyecto Correcto**

```bash
cd frontend/apps/website-epic

# Limpiar configuración local
rm -rf .vercel

# Link al proyecto principal (website-epic)
npx vercel link website-epic
```

### **Paso 2: Verificar Dominio**

```bash
npx vercel domains ls
# Debe mostrar aigestion.net
```

### **Paso 3: Deploy Correcto**

```bash
# Limpiar cache y dependencias
rm -rf node_modules package-lock.json
pnpm install

# Deploy al proyecto correcto
npx vercel --prod
```

---

## 🎯 **Resultado Final Esperado**

### **Proyectos Limpios**

```
📁 aigestions-projects
├── 🏢 demo-dashboard ✅
├── 🏢 client-dashboard ✅
├── 🏢 admin-dashboard ✅
└── 🏢 website-epic ✅ (con aigestion.net)
```

### **URLs Correctas**

```
✅ https://iagestion.net (website principal)
✅ https://admin-dashboard-aigestions-projects.vercel.app
✅ https://client-dashboard-aigestions-projects.vercel.app
✅ https://demo-dashboard-aigestions-projects.vercel.app
```

### **Sin Duplicados**

```
❌ aigestion-website-epic (eliminado)
❌ Proyectos duplicados
❌ Confusión de nombres
❌ URLs temporales largas
```

---

## 🔧 **Troubleshooting**

### **Si no puedes eliminar desde dashboard:**

1. Verifica que tienes permisos de administrador
2. Contacta a soporte de Vercel
3. Proporciona el ID del proyecto

### **Si el dominio no aparece:**

1. Ve a "Domains" en Vercel dashboard
2. Verifica que `aigestion.net` esté asignado a `website-epic`
3. Si no, añade el dominio al proyecto correcto

### **Si el build sigue fallando:**

1. Limpia cache local completamente
2. Verifica `package.json` y dependencias
3. Revisa `vercel.json` para configuración correcta

---

## 📋 **Checklist de Verificación**

### **✅ Antes de Eliminar**

- [ ] Identificar proyecto duplicado correctamente
- [ ] Confirmar que website-epic tiene el dominio
- [ ] Hacer backup de configuración importante

### **⏳ Durante Eliminación**

- [ ] Acceder a Vercel dashboard
- [ ] Encontrar proyecto aigestion-website-epic
- [ ] Eliminar proyecto correctamente
- [ ] Confirmar eliminación

### **✅ Después de Eliminar**

- [ ] Verificar lista de proyectos limpia
- [ ] Verificar dominio asignado correctamente
- [ ] Deploy al proyecto principal
- [ ] Test que aigestion.net funciona

---

## 🚀 **Comandos de Referencia**

### **Verificación Pre-Eliminación**

```bash
# Listar todos los proyectos
npx vercel projects ls

# Verificar dominios actuales
npx vercel domains ls

# Verificar proyecto actual
npx vercel whoami
```

### **Verificación Post-Eliminación**

```bash
# Verificar que el duplicado ya no existe
npx vercel projects ls

# Verificar dominios asignados
npx vercel domains ls

# Test del website principal
curl -I https://iagestion.net
```

---

## 🎉 **Resultado Final**

### **✅ Sistema Limpio y Funcional**

```
🌐 aigestion.net → Website principal con Daniela AI
🏢 dashboard.aigestion.net → Panel administrativo
🏢 client.aigestion.net → Dashboard clientes
🏢 demo.aigestion.net → Demo interactivo

Sin duplicados, sin conflictos, sin confusión.
```

---

**🗑️ ESTADO: GUÍA DE ELIMINACIÓN LISTA**
**📅 FECHA: 2026-01-24**
**🎯 OBJETIVO: ELIMINAR PROYECTO DUPLICADO**
**⚡ ACCIÓN: INMEDIATA REQUERIDA**
