#!/bin/bash

# SSL Certificate Setup Script for AIGestion
# This script sets up Let's Encrypt SSL certificates for aigestion.net

echo "🔧 Configurando SSL para AIGestion..."

# 1. Install Certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Instalando Certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# 2. Obtain SSL certificate
echo "🔐 Obteniendo certificado SSL para aigestion.net..."
sudo certbot --nginx -d aigestion.net -d www.aigestion.net --email admin@aigestion.net --agree-tos --no-eff-email --redirect

# 3. Setup auto-renewal
echo "⏰ Configurando renovación automática..."
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

# 4. Test certificate renewal
echo "🧪 Probando renovación de certificado..."
sudo certbot renew --dry-run

echo "✅ Certificado SSL configurado exitosamente!"
echo "🌐 Tu sitio ahora debería funcionar con HTTPS en https://aigestion.net"
