# 🌌 [GOD MODE] AIGestion Frontend Multi-Stage Dockerfile
# Optimized for: Cloud Build + Cloud Run (Europe-Southwest1)

# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package info
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ---------- Runtime Stage ----------
FROM nginx:alpine

# Set production environment
ENV NODE_ENV=production

# Install basic tools for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run Security: Implement non-root user
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Expose the Cloud Run default port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
