#!/bin/bash
set -e

if docker network inspect bank_shared_net >/dev/null 2>&1; then
  echo "bank_shared_net already exists"
else
  echo "Creating bank_shared_net..."
  docker network create bank_shared_net >/dev/null
  echo "Created bank_shared_net"
  docker compose --env-file ../.env -f ../docker-compose.db.yml up --build -d
  echo "Created mock bank"
fi

