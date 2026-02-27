FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Install pnpm
RUN npm install -g pnpm

# Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends redis-tools mongodb-clients

# Set workspace
WORKDIR /workspace
