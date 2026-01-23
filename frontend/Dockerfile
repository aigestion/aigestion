# ⚠️ DEPRECATED: Este Dockerfile ha sido reemplazado
# Usar: frontend/apps/website-epic/Dockerfile en su lugar
#
# Para build local:
#   docker build -f frontend/apps/website-epic/Dockerfile -t aigestion-frontend .
#
# Este archivo se mantiene por compatibilidad hacia atrás

FROM node:20-alpine AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY frontend/ ./frontend/
COPY packages/ ./packages/
COPY tsconfig.json ./
WORKDIR /app/frontend/apps/website-epic
RUN pnpm run build

FROM nginx:alpine
COPY frontend/apps/website-epic/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/frontend/apps/website-epic/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
