#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/familyflow"
REPO_URL="https://github.com/nubsrofl/PersonalCalBudget.git"
BRANCH="main"

log(){ echo -e "\033[1;32m[familyflow]\033[0m $*"; }
need_root(){ [ "$EUID" -ne 0 ] && { echo "Run as root: sudo bash scripts/install.sh"; exit 1; }; }
need_root

log "Updating apt & installing prerequisites…"
apt-get update -y
apt-get install -y ca-certificates curl git gnupg

if ! command -v docker >/dev/null 2>&1; then
  log "Installing Docker Engine & Compose plugin…"
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(. /etc/os-release; echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
fi

log "Cloning/updating repo to ${APP_DIR}…"
mkdir -p "$APP_DIR"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  git -C "$APP_DIR" fetch origin "$BRANCH"
  git -C "$APP_DIR" checkout "$BRANCH"
  git -C "$APP_DIR" pull --ff-only
fi

cd "$APP_DIR"

log "Creating .env from template (and generating NEXTAUTH_SECRET)…"
if [ ! -f ".env" ]; then
  cp .env.example .env
  SECRET=$(openssl rand -base64 32 | tr -d '\n=' | cut -c1-40)
  sed -i "s|^NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=${SECRET}|" .env
fi

log "Launching containers…"
docker compose up --build -d

log "Running Prisma migrations…"
docker compose exec -T web npx prisma migrate deploy || docker compose exec -T web npx prisma migrate dev --name init

log "All set ✅  Visit http://<server-ip>:3000 (or your tunnel URL)."
