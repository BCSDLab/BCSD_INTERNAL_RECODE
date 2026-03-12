#!/usr/bin/env bash
set -euo pipefail

COMPOSE="sudo docker compose -p bcsd-frontend --env-file .env -f infra/docker/docker-compose.yml"
MAX_RETRIES=10

# 필수 환경변수 검증
if [ ! -f .env ]; then
    echo "FAIL: .env not found (CI/CD should have uploaded it)"
    exit 1
fi

health_check() {
    local port
    port=$(grep -m1 '^FRONTEND_PORT=' .env | cut -d= -f2-)
    local retries=0
    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -sf "http://localhost:${port}/health" > /dev/null 2>&1; then
            return 0
        fi
        retries=$((retries + 1))
        echo "  retry ${retries}/${MAX_RETRIES}..."
        sleep 3
    done
    return 1
}

echo "=== BCSD Frontend Deploy ==="

echo "1. Building..."
if ! $COMPOSE build frontend; then
    echo "FAIL: build failed"
    exit 1
fi

echo "2. Starting..."
$COMPOSE up -d --remove-orphans frontend

echo "3. Health check..."
if ! health_check; then
    echo "FAIL: frontend did not become healthy"
    echo "--- Container logs ---"
    $COMPOSE logs --tail=30 frontend
    exit 1
fi

echo "=== Deploy complete ==="
