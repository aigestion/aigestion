#!/bin/bash
echo ">> Nexus Monitoring Status"
docker-compose -f infra/docker/docker-compose.yml ps
echo ">> System Metrics"
curl -s http://localhost:5000/api/v1/health | grep status || echo "Backend unreachable"
