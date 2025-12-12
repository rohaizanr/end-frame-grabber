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
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements (upgrade if needed)
echo "Installing/Updating backend dependencies (this may take a moment)..."
pip install -r requirements.txt

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
