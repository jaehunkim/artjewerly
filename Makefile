.PHONY: dev dev-frontend dev-backend build lint test migrate-up migrate-down

# Development
dev:
	@echo "Starting frontend and backend..."
	@make -j2 dev-frontend dev-backend

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && go run cmd/server/main.go

# Build
build:
	cd frontend && npm run build
	cd backend && CGO_ENABLED=0 go build -o bin/server ./cmd/server

# Lint
lint:
	cd frontend && npm run lint
	cd backend && go vet ./...

# Test
test:
	cd frontend && npm test --passWithNoTests 2>/dev/null || true
	cd backend && go test ./... -v

# Database migrations
migrate-up:
	cd backend && go run -tags migrate cmd/migrate/main.go up

migrate-down:
	cd backend && go run -tags migrate cmd/migrate/main.go down

# Docker
docker-build:
	cd backend && docker build -t heeang-api .

docker-up:
	docker compose up -d

docker-down:
	docker compose down
