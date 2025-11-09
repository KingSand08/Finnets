#!/bin/bash
set -euo pipefail

COMPOSE_DIR="${COMPOSE_DIR:-..}"

echo "==> Stopping & removing DB stack (containers/images/volumes)…"
docker compose -p db   -f "$COMPOSE_DIR/docker-compose.db.yml"   down --rmi all --volumes --remove-orphans || true

echo "==> Stopping & removing DEV stack (containers/images/volumes)…"
docker compose -p dev  -f "$COMPOSE_DIR/docker-compose.dev.yml"  down --rmi all --volumes --remove-orphans || true

echo "==> Stopping & removing PROD stack (containers/images/volumes)…"
docker compose -p prod -f "$COMPOSE_DIR/docker-compose.prod.yml" down --rmi all --volumes --remove-orphans || true

echo "==> Pruning any dangling images (safe, project-agnostic)…"
docker image prune -f || true


echo "==> Removing project networks…"
./remove-nets.sh || true

echo "Project containers/images/volumes removed."
