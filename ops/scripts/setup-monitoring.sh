#!/bin/bash
echo ">> Setting up Nexus Monitoring..."
docker-compose -f infra/docker/docker-compose.yml up -d
echo ">> Monitoring services active."
