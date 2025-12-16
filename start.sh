#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo "Stopping servers..."
    # Kill all child processes in the current process group
    kill 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "Starting Backend..."
cd backend

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: backend/.env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements (upgrade if needed)
echo "Installing/Updating backend dependencies (this may take a moment)..."
pip install -r requirements.txt

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Start Flask app in background
python app.py &
cd ..

echo "Starting Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start Vite dev server
npm run dev &
cd ..

# Wait for both processes
wait
#!/bin/bash

# LastSnap Free - Quick Start Script
# This script helps you get started quickly

echo "🎬 LastSnap Free - Quick Start"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if containers are already running
if docker ps | grep -q lastsnap; then
    echo "⚠️  LastSnap containers are already running"
    echo ""
    read -p "Do you want to restart them? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Stopping existing containers..."
        docker-compose down
    else
        echo "✅ Keeping existing containers running"
        echo ""
        echo "Access the application at:"
        echo "  Frontend: http://localhost:3000"
        echo "  Backend:  http://localhost:5001"
        exit 0
    fi
fi

# Build and start containers
echo "🚀 Building and starting containers..."
echo "This may take a few minutes on the first run..."
echo ""

if docker compose version &> /dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

# Check if containers started successfully
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ LastSnap is now running!"
    echo ""
    echo "Access the application at:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:5001"
    echo ""
    echo "To stop the application, run:"
    echo "  docker-compose down"
    echo ""
    echo "To view logs, run:"
    echo "  docker-compose logs -f"
    echo ""
    echo "Happy frame extracting! 🎥"
else
    echo ""
    echo "❌ Failed to start containers"
    echo "Check the error messages above for details"
    exit 1
fi
