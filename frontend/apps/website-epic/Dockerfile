# 🌌 [GOD MODE] Frontend Dockerfile
# Optimized for Vite + Nginx + Multi-arch

# ---------- Builder Stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy deps first for caching
COPY package.json ./

# Install deps (using install instead of ci since lockfile might be missing)
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build args
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build the app
# Build the app with fixed permissions
RUN chmod +x node_modules/.bin/vite
RUN npm run build

# ---------- Runtime Stage ----------
FROM nginx:alpine AS runtime

# Copy build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
