#!/usr/bin/env bash
set -euo pipefail
APP_DIR="/opt/familyflow"

echo "[familyflow] Pulling latest…"
git -C "$APP_DIR" fetch origin
git -C "$APP_DIR" pull --ff-only

echo "[familyflow] Rebuild & restart…"
docker compose -f "$APP_DIR/docker-compose.yml" up --build -d

echo "[familyflow] Migrations…"
docker compose -f "$APP_DIR/docker-compose.yml" exec -T web npx prisma migrate deploy || docker compose -f "$APP_DIR/docker-compose.yml" exec -T web npx prisma migrate dev --name update

echo "[familyflow] Done."
