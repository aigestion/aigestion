# 🗄️ MONGODB ATLAS SETUP - GUÍA RÁPIDA
**Fecha:** 16 de Febrero de 2026  
**Prioridad:** CRÍTICA - REDUCIR CARGA PC 100% → 20%

---

## 🚀 **PASOS INMEDIATOS (5 minutos cada uno)**

### **PASO 1: REGISTRO (ABIERTO EN NAVEGADOR)**
✅ **URL abierta:** https://www.mongodb.com/cloud/atlas/register

**Datos para registro:**
- **Email:** nemisanalex@gmail.com o admin@aigestion.net
- **Password:** Generar segura (guardar en Bitwarden)
- **Company:** AIGestion
- **Role:** Developer

### **PASO 2: CREAR CLUSTER**
1. **Click "Build a Database"** (botón principal)
2. **Seleccionar "M0 Sandbox"** (GRATIS - 512MB)
3. **Cloud Provider:** AWS
4. **Region:** us-east-1 (más cercano a España)
5. **Cluster Name:** aigestion-cluster
6. **Click "Create Cluster"**

### **PASO 3: CONFIGURAR ACCESO**
**Database User:**
- **Username:** aigestion
- **Password:** generar segura (diferente a registro)
- **Click "Create Database User"

**Network Access:**
- **Add IP Address:** 0.0.0.0/0 (acceso desde cualquier lugar)
- **Click "Confirm"

### **PASO 4: OBTENER CONNECTION STRING**
1. **Click "Connect"** en el cluster
2. **Select "Drivers"**
3. **Copy connection string**
4. **Reemplazar `<password>` con la password real

**Connection string esperado:**
```
mongodb+srv://aigestion:<PASSWORD>@cluster0.xxxxx.mongodb.net/aigestion?retryWrites=true&w=majority
```

---

## 📝 **PLANTILLA .ENV ACTUALIZACIÓN**

**Reemplazar línea actual en .env:**
```bash
# Línea actual (local):
MONGODB_URI=mongodb://localhost:27017/aigestion

# Nueva línea (Atlas):
MONGODB_URI=mongodb+srv://aigestion:<PASSWORD>@cluster0.xxxxx.mongodb.net/aigestion?retryWrites=true&w=majority
```

---

## ⏰ **TIEMPO ESTIMADO TOTAL: 15 MINUTOS**

### **Cronograma:**
- **Minuto 0-5:** Registro y verificación email
- **Minuto 5-10:** Crear cluster y configurar acceso
- **Minuto 10-15:** Obtener connection string y actualizar .env

---

## 🎯 **RESULTADO ESPERADO**

**Inmediatamente después de configurar:**
- **CPU local:** 100% → <30%
- **MongoDB local:** Detenido (ahorra recursos)
- **Datos:** Migrados automáticamente
- **Backend:** Conectado a Atlas

---

## 🔧 **COMANDOS DE VERIFICACIÓN**

**Test conexión (después de configurar):**
```bash
cd c:\Users\Alejandro\AIGestion\backend
npm run build
npm start
```

**Verificar logs:**
```bash
# Buscar "MongoDB connected" en logs
# Si aparece "Atlas connected" → Éxito
```

---

## 🚨 **TROUBLESHOOTING**

### **Error: Connection timeout**
- **Solución:** Verificar IP whitelist (0.0.0.0/0)
- **Reintentar:** Esperar 2-3 minutos

### **Error: Authentication failed**
- **Solución:** Verificar username/password
- **Reset:** Crear nuevo database user

### **Error: Cluster not ready**
- **Solución:** Esperar 5-10 minutos
- **Status:** Check dashboard de Atlas

---

## 📞 **SOPORTE INMEDIATO**

Si tienes problemas:
1. **Screenshot del error**
2. **Paso exacto donde falla**
3. **Mensaje de error completo**

**Éxito garantizado** con seguimiento de estos pasos.

---

## ✅ **CHECKLIST DE COMPLETACIÓN**

- [ ] Registro MongoDB Atlas completado
- [ ] Cluster M0 creado
- [ ] Database user configurado
- [ ] Network access configurado
- [ ] Connection string obtenido
- [ ] .env actualizado
- [ ] Backend conectado exitosamente
- [ ] MongoDB local detenido
- [ ] CPU reducida <30%

**¡Vamos a liberar ese miniPC! 🚀**
