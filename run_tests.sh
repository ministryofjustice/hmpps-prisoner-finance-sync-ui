#!/usr/bin/env bash

set -euo pipefail

# -----------------------------
# Config
# -----------------------------
DOCKER_COMPOSE_FILE="docker-compose-test.yml"

SERVER_PORT="${SERVER_PORT:-3007}"
SERVER_START_TIMEOUT=60

# -----------------------------
# Cleanup
# -----------------------------
cleanup() {
  echo ""
  echo "🧹 Cleaning up..."

 local PORT_PID=$(lsof -t -i:$SERVER_PORT)
  if [[ -n "$PORT_PID" ]]; then
    echo "Found process $PORT_PID listening on port 3007. Terminating..."
    kill -15 "$PORT_PID" 2>/dev/null || kill -9 "$PORT_PID" 2>/dev/null
  fi

  # Stop WireMock
  echo "Stopping WireMock..."
  docker compose -f "$DOCKER_COMPOSE_FILE" down -v --remove-orphans || true

  echo "Checking for processes running on server port..."
  lsof -i:$SERVER_PORT && echo "🚨WARN: Process found on port $SERVER_PORT🚨"


  echo "✅ Cleanup complete"
}

trap cleanup EXIT INT TERM

npm run build

# -----------------------------
# 1️⃣ Run unit tests
# -----------------------------
echo "🧪 Running unit tests..."
npm run unit-test-coverage
echo "✅ Unit tests passed"

# -----------------------------
# 2️⃣ Start WireMock
# -----------------------------
echo "🚀 Starting WireMock..."
docker compose -f "$DOCKER_COMPOSE_FILE" up -d --build --remove-orphans wiremock

# -----------------------------
# 3️⃣ Run integration tests under c8
# -----------------------------
echo "🚀 Running integration tests with coverage..."

npm run integration-test-coverage

echo "✅ Integration tests passed and coverage generated"
