# 🚀 AIGestion Deploy God Mode - Guía Completa

## 📋 Resumen

Sistema completo de deploy automatizado para AIGestion.net con GitHub Pages, optimizado para producción y configurado con DNS personalizado.

## 🏗️ Arquitectura de Deploy

### **Frontend Build**
- **Framework**: React 18.3.1 + TypeScript + Vite
- **Build Time**: ~15 segundos
- **Bundle Size**: ~500KB (gzipped: ~180KB)
- **Output**: `/frontend/website-epic/dist`

### **Deploy Pipeline**
1. **Build** → Vite production build
2. **Optimize** → Assets y chunks separados
3. **Configure** → GitHub Pages setup
4. **Deploy** → Push a rama gh-pages
5. **DNS** → Configuración Squarespace

## 🎯 Métodos de Deploy

### **1. Automático (GitHub Actions)**
```yaml
# .github/workflows/deploy-pages.yml
Trigger: Push a main/develop
Build: Vite production
Deploy: GitHub Pages
```

### **2. Manual (Script PowerShell)**
```powershell
# Ejecutar deploy completo
.\scripts\deploy\AIGestion-Deploy-GodMode.ps1

# Deploy forzado (ignora cambios sin commit)
.\scripts\deploy\AIGestion-Deploy-GodMode.ps1 -Force

# Deploy sin tests
.\scripts\deploy\AIGestion-Deploy-GodMode.ps1 -SkipTests
```

### **3. Desarrollo Local**
```bash
# Build local
cd frontend/website-epic
npm run build

# Servir local
npx serve dist -l 3000
```

## 🔧 Configuración Requerida

### **GitHub Pages**
1. **Repository Settings** → Pages
2. **Source**: GitHub Actions
3. **Custom Domain**: `aigestion.net`
4. **HTTPS**: Enforce SSL

### **DNS (Squarespace)**
```
Type: A
Name: @
Value: 185.199.108.153
TTL: 1 hora

Type: A  
Name: @
Value: 185.199.109.153
TTL: 1 hora

Type: A
Name: @
Value: 185.199.110.153
TTL: 1 hora

Type: A
Name: @
Value: 185.199.111.153
TTL: 1 hora
```

### **Environment Variables**
```bash
# GitHub Repository Secrets
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 📊 Métricas de Performance

### **Build Optimization**
- **Code Splitting**: 12 chunks separados
- **Lazy Loading**: Componentes 3D bajo demanda
- **Tree Shaking**: Código muerto eliminado
- **Minification**: JavaScript y CSS optimizados

### **Bundle Analysis**
```
vendor-react-B5kky_qD.js     168KB (54KB gzipped)
vendor-supabase-BfBB1_pB.js  160KB (40KB gzipped)
components-PsM3YWyQ.js      155KB (39KB gzipped)
vendor-FncoC6P9.js          132KB (41KB gzipped)
vendor-motion-m6bCG5ok.js   38KB  (13KB gzipped)
```

### **Runtime Performance**
- **First Load**: ~200KB
- **Time to Interactive**: ~2s
- **Lighthouse Score**: 95+
- **Mobile Optimized**: ✅

## 🚨 Troubleshooting

### **Build Errors**
```bash
# Limpiar cache
npm run clean
rm -rf node_modules dist
npm install

# Build con Vite directo
npx vite build --mode production
```

### **Deploy Issues**
```powershell
# Verificar estado Git
git status
git checkout main

# Forzar deploy
.\scripts\deploy\AIGestion-Deploy-GodMode.ps1 -Force -SkipTests
```

### **DNS Problems**
```bash
# Verificar DNS
nslookup aigestion.net
dig aigestion.net

# Propagación DNS
whois aigestion.net
```

## 🔄 Flujo de Trabajo

### **Desarrollo**
1. **Branch**: `develop` para desarrollo
2. **Commits**: Mensajes semánticos
3. **PR**: Pull requests a `main`
4. **Deploy**: Automático al merge

### **Producción**
1. **Build**: Trigger por push a `main`
2. **Test**: Tests automatizados
3. **Deploy**: GitHub Pages
4. **Monitor**: Verificación post-deploy

## 📈 Monitorización

### **GitHub Actions**
- **Status**: `.github/workflows/deploy-pages.yml`
- **Logs**: Build y deploy logs
- **History**: Historial de deploys

### **Website Health**
```bash
# Verificación de website
curl -I https://aigestion.net

# Performance test
lighthouse https://aigestion.net --view
```

### **Analytics**
- **Google Analytics**: Configurado
- **Vercel Analytics**: Disponible
- **Custom Metrics**: Event tracking

## 🎯 Best Practices

### **Pre-Deploy Checklist**
- [ ] Tests pasando
- [ ] Build exitoso
- [ ] Assets optimizados
- [ ] DNS configurado
- [ ] SSL activado

### **Post-Deploy Verification**
- [ ] Website accesible
- [ ] HTTPS funcionando
- [ ] Mobile responsive
- [ ] Performance OK
- [ ] Analytics tracking

## 🚀 Comandos Rápidos

```powershell
# Deploy completo
.\scripts\deploy\AIGestion-Deploy-GodMode.ps1

# Build local
cd frontend/website-epic; npm run build

# Servir local
npx serve frontend/website-epic/dist -l 3000

# Verificar deploy
curl -I https://aigestion.net
```

## 📞 Soporte

### **Contacto**
- **Email**: admin@aigestion.net
- **GitHub**: Issues en repository
- **Documentation**: `/docs/deployment`

### **Emergency**
- **Rollback**: `git checkout previous_commit`
- **Hotfix**: Branch `hotfix/` → `main`
- **Monitor**: Status page activa

---

**🔥 AIGestion Deploy God Mode - Sistema de deploy nivel dios para máxima velocidad y fiabilidad!**
