#!/bin/bash
echo ">> Cleaning up Monitoring Resources..."
docker-compose -f infra/docker/docker-compose.yml down --remove-orphans
echo ">> Cleanup complete."
