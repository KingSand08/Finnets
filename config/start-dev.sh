#!/bin/bash
set -e

# Start up the db and db network
./start-db.sh

# Start up the dev and dev network
if docker network inspect bank_dev_net >/dev/null 2>&1; then
  echo "bank_dev_net already exists"
  docker compose --env-file ../.env -f ../docker-compose.dev.yml up --build -d
  echo "Created dev demo"
else
  echo "Creating bank_dev_net..."
  docker network create bank_dev_net >/dev/null
  echo "Created bank_shared_net"
  docker compose --env-file ../.env -f ../docker-compose.dev.yml up --build  -d
fi

