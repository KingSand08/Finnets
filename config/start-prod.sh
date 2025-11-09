#!/bin/bash
set -e

if docker network inspect bank_prod_net >/dev/null 2>&1; then
  echo "bank_prod_net already exists"
  docker compose --env-file ../.env -f ../docker-compose.prod.yml up --build -d
  echo "Created prod demo"
else
  echo "Created bank_prod_net..."
  docker network create bank_prod_net >/dev/null
  echo "Created bank_shared_net"
  docker compose --env-file ../.env -f ../docker-compose.prod.yml up --build -d
  echo "Created prod demo"
fi
