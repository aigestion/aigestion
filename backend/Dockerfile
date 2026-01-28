# 🌌 [GOD MODE] AIGestion Backend Optimized Dockerfile
# Optimized for: Multi-Region / Autonomous Railway Build / Cloud Build

# ---------- Builder Stage ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
# Install all dependencies for build
RUN npm ci --legacy-peer-deps
COPY . .
# Build the application
RUN npm run build

# ---------- Runtime Stage ----------
FROM node:20-alpine AS runtime

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

# Install security tools (ClamAV, YARA)
# RUN apk add --no-cache clamav yara

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production --legacy-peer-deps

# Create non-root user for security
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
RUN mkdir -p /app/quarantine /app/uploads && \
  chown -R nodejs:nodejs /app

# Copy built artifacts from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Switch to non-root user
USER nodejs

# Expose the Cloud Run / Railway default port
EXPOSE 8080

# Health check to ensure the container is healthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/v1/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start the application
CMD ["node", "dist/server.js"]
