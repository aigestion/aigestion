#!/bin/bash

# Quick SSL Fix for AIGestion - Emergency Script
# Use this if you need immediate SSL setup

echo "🚨 EMERGENCY SSL SETUP FOR AIGESTION.NET"
echo "======================================="

# Check if domain points to this server
echo "🔍 Verificando dominio..."
DOMAIN_IP=$(dig +short aigestion.net)
SERVER_IP=$(curl -s ifconfig.me)

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    echo "⚠️  ADVERTENCIA: El dominio aigestion.net apunta a $DOMAIN_IP"
    echo "   pero este servidor tiene IP $SERVER_IP"
    echo "   Asegúrate que el dominio apunte a la IP correcta del servidor"
    read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install required packages
echo "📦 Instalando paquetes necesarios..."
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Backup current nginx config
echo "💾 Haciendo backup de configuración actual..."
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Use our SSL configuration
echo "⚙️  Instalando configuración SSL..."
sudo cp nginx-ssl.conf /etc/nginx/sites-available/aigestion.net
sudo ln -sf /etc/nginx/sites-available/aigestion.net /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx config
echo "🧪 Probando configuración de nginx..."
sudo nginx -t
if [ $? -ne 0 ]; then
    echo "❌ Error en configuración de nginx. Restaurando backup..."
    sudo rm -f /etc/nginx/sites-enabled/aigestion.net
    sudo ln -sf /etc/nginx/sites-available/default.backup /etc/nginx/sites-enabled/default
    exit 1
fi

# Get SSL certificate
echo "🔐 Obteniendo certificado SSL..."
sudo certbot --nginx -d aigestion.net -d www.aigestion.net --email admin@aigestion.net --agree-tos --no-eff-email --redirect --non-interactive

# Setup auto-renewal
echo "⏰ Configurando renovación automática..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Restart services
echo "🔄 Reiniciando servicios..."
sudo systemctl reload nginx
sudo systemctl enable certbot.timer

# Test SSL
echo "🔍 Probando configuración SSL..."
echo "Verificando certificado..."
sudo certbot certificates

echo ""
echo "✅ SSL CONFIGURADO EXITOSAMENTE!"
echo "==============================="
echo "🌐 Tu sitio ahora está disponible en:"
echo "   https://aigestion.net"
echo "   https://www.aigestion.net"
echo ""
echo "🔒 El certificado se renueva automáticamente"
echo "📊 Puedes verificar el estado con: sudo certbot certificates"
