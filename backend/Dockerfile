# 🌌 [GOD MODE] AIGestion Backend Optimized Dockerfile
# Optimized for: Fast Build & Production Hardening
# Uses pre-built dist folder to avoid OOM issues during Docker build

# ---------- Build Stage (Copy pre-built dist) ----------
FROM node:22-alpine AS builder
WORKDIR /app
# Copy pre-built dist directly (faster and avoids OOM)
COPY dist ./dist

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
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev --legacy-peer-deps && \
  npm cache clean --force

# Copy pre-built artifacts from host (Fast Build) or from builder
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
