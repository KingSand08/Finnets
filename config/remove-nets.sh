#!/bin/bash
set -e

docker compose --env-file ../.env -f ../docker-compose.db.yml down || true

docker network inspect bank_shared_net >/dev/null 2>&1 && docker network rm bank_shared_net || echo "bank_shared_net already absent"
docker network inspect bank_prod_net   >/dev/null 2>&1 && docker network rm bank_prod_net   || echo "bank_prod_net already absent"
docker network inspect bank_dev_net    >/dev/null 2>&1 && docker network rm bank_dev_net    || echo "bank_dev_net already absent"
