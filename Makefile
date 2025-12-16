.PHONY: help build up down restart logs clean install dev test

# Default target
help:
	@echo "LastSnap Free - Available Commands"
	@echo "===================================="
	@echo ""
	@echo "Docker Commands:"
	@echo "  make build    - Build Docker containers"
	@echo "  make up       - Start the application"
	@echo "  make down     - Stop the application"
	@echo "  make restart  - Restart the application"
	@echo "  make logs     - View application logs"
	@echo "  make clean    - Remove containers, volumes, and images"
	@echo ""
	@echo "Development Commands:"
	@echo "  make install  - Install dependencies for local development"
	@echo "  make dev      - Run in development mode (local)"
	@echo "  make test     - Run tests (if available)"
	@echo ""

# Docker commands
build:
	@echo "🔨 Building Docker containers..."
	docker-compose build

up:
	@echo "🚀 Starting LastSnap..."
	docker-compose up -d
	@echo ""
	@echo "✅ LastSnap is running!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:5001"

down:
	@echo "🛑 Stopping LastSnap..."
	docker-compose down

restart:
	@echo "🔄 Restarting LastSnap..."
	docker-compose restart

logs:
	@echo "📋 Viewing logs (Ctrl+C to exit)..."
	docker-compose logs -f

clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker-compose down -v --rmi all --remove-orphans
	@echo "✅ Cleanup complete!"

# Development commands
install:
	@echo "📦 Installing dependencies..."
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ Installation complete!"

dev:
	@echo "🔧 Starting development servers..."
	@echo "Backend will run on http://localhost:5001"
	@echo "Frontend will run on http://localhost:3000"
	@echo ""
	@echo "Run these in separate terminals:"
	@echo "  Terminal 1: cd backend && python app.py"
	@echo "  Terminal 2: cd frontend && npm run dev"

test:
	@echo "🧪 Running tests..."
	@echo "No tests configured yet. See CONTRIBUTING.md to add tests."
