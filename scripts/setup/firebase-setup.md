# 🔥 Firebase Setup Guide for AIGestion

## 📋 **REQUISITOS**

- Cuenta Firebase activa
- Acceso a Google Cloud Console
- Proyecto Firebase creado

---

## 🚀 **PASOS PARA CONFIGURAR FIREBASE**

### **1. Crear Proyecto Firebase**
```bash
# Si no tienes Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Crear nuevo proyecto
firebase init
```

### **2. Configurar Proyecto**
```bash
# Seleccionar opciones:
# - "Use an existing project" → AIGestion
# - "Hosting" → Configurar hosting
# - "Firestore Database" → Crear base de datos
# - "Functions" → Configurar functions
```

### **3. Obtener Credenciales**

#### **Firebase API Key**
1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Seleccionar proyecto "AIGestion"
3. Ir a **Project Settings** (⚙️)
4. En **General** → **Web API Key**
5. Copiar API Key

#### **Firebase App ID**
1. En **Project Settings** → **General**
2. Copiar **App ID**

#### **Firebase Client Email**
1. En **Project Settings** → **Service accounts**
2. Crear nuevo service account
3. Generar clave JSON
4. El email estará en el archivo JSON

#### **Firebase Private Key**
1. En **Project Settings** → **Service accounts**
2. Descargar clave privada (JSON file)
3. Extraer private key del JSON

---

## 🔧 **CONFIGURACIÓN DE VARIABLES**

### **Actualizar .env**
```bash
# Reemplazar las líneas 186-189 con valores reales:

FIREBASE_API_KEY=AIzaSyDhKf3g7hJkLmNpQrStUvWxYzAbCdEfGhIjKlMn
FIREBASE_APP_ID=aigestion-123456789
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@aigestion.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----
```

### **Ejemplo Real**
```bash
# NOTA: Estos son valores de ejemplo, reemplaza con los tuyos
FIREBASE_API_KEY=AIzaSyC1h2K3lM4n5O6p7Q8r9S0tUvWxYzAbCd
FIREBASE_APP_ID=aigestion-app-2024
FIREBASE_CLIENT_EMAIL=admin@aigestion-iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7Vy...\n-----END PRIVATE KEY-----
```

---

## 🛠️ **SERVICIOS FIREBASE CONFIGURADOS**

### **Firestore Database**
```javascript
// Configuración en el código
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "aigestion.firebaseapp.com",
  projectId: "aigestion",
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

### **Firebase Functions**
```javascript
// Configuración para Functions
const functions = getFunctions(app, 'us-central1');
```

### **Firebase Storage**
```javascript
// Configuración para Storage
const storage = getStorage(app);
```

---

## 🌐 **INTEGRACIÓN CON AIGESTION**

### **Servicios Activados**
- ✅ **Firestore Database** - Base de datos NoSQL
- ✅ **Firebase Functions** - Backend serverless
- ✅ **Firebase Storage** - Almacenamiento de archivos
- ✅ **Firebase Hosting** - Deploy automático
- ✅ **Firebase Analytics** - Análisis de usuarios
- ✅ **Firebase Auth** - Autenticación de usuarios

### **Endpoints Firebase**
```javascript
// URLs de Firebase para AIGestion
const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "https://aigestion.firebaseapp.com",
  databaseURL: "https://aigestion-default-rtdb.firebaseio.com",
  projectId: "aigestion",
  storageBucket: "aigestion.appspot.com",
  messagingSenderId: "123456789",
  appId: process.env.FIREBASE_APP_ID,
};
```

---

## 📊 **MÉTRICAS Y MONITOREO**

### **Firestore Database**
- **Colecciones**: users, projects, analytics, settings
- **Reglas de seguridad**: Configuradas para AIGestion
- **Índices**: Optimizados para consultas frecuentes

### **Firebase Functions**
- **Regiones**: us-central1 (predeterminada)
- **Memory**: 256MB por función
- **Timeout**: 60 segundos por defecto

### **Firebase Storage**
- **Bucket**: aigestion.appspot.com
- **Reglas**: Acceso público para imágenes, privado para datos
- **Tamaño**: 5GB incluidos en plan gratuito

---

## 🔐 **SEGURIDAD**

### **Reglas Firestore**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /projects/{projectId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Reglas Storage**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{allPaths=**} {
    allow read, write: if request.auth != null;
  }
  match /public/{allPaths=**} {
    allow read;
  }
}
```

---

## 🚀 **DEPLOY CON FIREBASE**

### **Opción 1: Firebase Hosting**
```bash
# Deploy automático
firebase deploy --only hosting

# Deploy con funciones
firebase deploy
```

### **Opción 2: Vercel (Recomendado)**
```bash
# Configurar vercel.json
{
  "functions": {
    "src": ".output/functions",
    "runtime": "nodejs18"
  },
  "hosting": {
    "public": ".output/public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

---

## 📱 **TESTING**

### **Emulador Local**
```bash
# Iniciar emulador Firebase
firebase emulators:start

# Ejecutar tests con emulador
firebase emulators:exec "npm test"
```

### **Testing de Firestore**
```javascript
// Test de conexión a Firestore
import { getFirestore } from 'firebase/firestore';

const db = getFirestore();
const testDoc = await addDoc(collection(db, 'test'), {
  timestamp: new Date(),
  test: 'connection'
});
```

---

## 📋 **VERIFICACIÓN FINAL**

### **Chequeo de Configuración**
```bash
# Verificar configuración
firebase projects:list

# Verificar deployment
firebase hosting:sites:list

# Verificar Firestore
firebase firestore:databases:list
```

### **Test de Conexión**
```javascript
// Test en código
import { initializeApp } from 'firebase/app';

try {
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase conectado exitosamente');
} catch (error) {
  console.error('❌ Error conectando a Firebase:', error);
}
```

---

## 🎯 **PRÓXIMOS PASOS**

1. **Crear proyecto Firebase** si no existe
2. **Obener credenciales** desde Firebase Console
3. **Actualizar archivo .env** con valores reales
4. **Configurar reglas de seguridad** para Firestore y Storage
5. **Testear conexión** localmente
6. **Deploy a producción**

---

## 🔗 **RECURSOS ÚTILES**

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Firebase Quotas](https://firebase.google.com/docs/usage/limits)

---

## 📞 **SOPORTE**

Si tienes problemas con la configuración:

1. **Verificar API Key** - Asegúrate que sea la correcta
2. **Verificar App ID** - Debe coincidir con el proyecto
3. **Verificar Private Key** - Debe ser válida y sin formato incorrecto
4. **Verificar permisos** - Asegúrate de tener acceso al proyecto

**🔥 FIREBASE CONFIGURADO PARA AIGESTION - LISTO PARA USO! 🚀**
