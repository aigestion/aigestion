# SSL Certificate Setup for AIGestion

## 🔒 Problema Actual

Tu sitio `aigestion.net` muestra "No es seguro" en todos los navegadores porque no tiene un certificado SSL válido instalado.

## 🛠️ Solución Rápida

### Opción 1: Usar Certbot (Recomendado)

1. **Conéctate a tu servidor via SSH**
2. **Ejecuta el script de configuración SSL:**

```bash
cd /ruta/a/tu/proyecto
chmod +x scripts/setup-ssl.sh
sudo ./scripts/setup-ssl.sh
```

### Opción 2: Manual con Certbot

```bash
# 1. Instalar Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 2. Obtener certificado
sudo certbot --nginx -d aigestion.net -d www.aigestion.net --email admin@aigestion.net --agree-tos --no-eff-email --redirect

# 3. Configurar renovación automática
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### Opción 3: Cloudflare (Gratis y Fácil)

1. **Crear cuenta en Cloudflare**
2. **Añadir tu dominio `aigestion.net`**
3. **Cambiar los nameservers de tu dominio a los de Cloudflare**
4. **Activar SSL/TLS en modo "Full" o "Full (strict)"**
5. **Añadir registro A para `@` y `www` apuntando a tu IP del servidor**

## 🐳 Si usas Docker

Añade esto a tu `docker-compose.prod.yml`:

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx-ssl.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - frontend
```

## 🔍 Verificación

Después de configurar, verifica:

```bash
# Verificar estado del certificado
sudo certbot certificates

# Probar renovación
sudo certbot renew --dry-run

# Verificar configuración de nginx
sudo nginx -t
```

## ⚠️ Notas Importantes

- El certificado es gratuito y se renueva automáticamente
- Asegúrate que tu dominio apunta a la IP correcta del servidor
- Los puertos 80 y 443 deben estar abiertos en tu firewall
- La configuración puede tardar unos minutos en propagarse

## 🚀 Después de la Configuración

Tu sitio será accesible en:

- `https://aigestion.net` ✅ Seguro
- `https://www.aigestion.net` ✅ Seguro
- `http://aigestion.net` → Redirige a HTTPS
- `http://www.aigestion.net` → Redirige a HTTPS

El candado verde aparecerá en todos los navegadores 🎉
