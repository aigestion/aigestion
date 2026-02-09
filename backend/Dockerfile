# 🌌 [GOD MODE] AIGestion Backend Optimized Dockerfile
# Optimized for: Cloud-Native Build & Production Hardening
# Performs in-container compilation (tsc) to ensure environment consistency

# ---------- Build Stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files for layer caching
COPY package*.json ./

# Install ALL dependencies including devDependencies for tsc
# Use --legacy-peer-deps to handle peer dependency conflicts
RUN npm ci --legacy-peer-deps

# Copy source code and config
# .dockerignore/gcloudignore should exclude dist to ensure fresh build
COPY . .

# Compile TypeScript
RUN npm run build

# ---------- Runtime Stage ----------
FROM node:22-alpine AS runtime

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080
ENV TZ=UTC

WORKDIR /app

# Install security tools & useful utilities
RUN apk add --no-cache curl tzdata

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --legacy-peer-deps && \
  npm cache clean --force

# Copy compiled artifacts from builder stage (guarantees consistency)
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
RUN mkdir -p /app/quarantine /app/uploads /app/logs && \
  chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the Cloud Run / Railway default port
EXPOSE 8080

# Health check to ensure the container is healthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]
