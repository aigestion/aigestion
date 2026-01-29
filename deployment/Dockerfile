# 🌌 [GOD MODE] AIGestion Root Optimized Dockerfile
# Optimized for: Legacy Dashboard / Mono-entry

# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy root config
COPY pnpm-lock.yaml* pnpm-workspace.yaml* package.json ./

# Copy all source (for monorepo build context)
COPY . .

# Build the dashboard app
RUN pnpm install --frozen-lockfile && \
  pnpm --filter dashboard build

# ---------- Runtime Stage ----------
FROM nginx:stable-alpine AS runtime

# Copy build output
COPY --from=builder /app/frontend/apps/dashboard/dist /usr/share/nginx/html

# Basic Nginx security
RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /usr/share/nginx/html

USER nginx

EXPOSE 8080

# Cloud Run port adjustment
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
