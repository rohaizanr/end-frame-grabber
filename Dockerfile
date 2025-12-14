# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Production image with Python backend
FROM python:3.11-slim

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/app.py ./

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./static

# Update Flask app to serve static files
RUN echo '\n\
# Serve static frontend files\n\
@app.route("/")\n\
def serve_frontend():\n\
    return send_file("static/index.html")\n\
\n\
@app.route("/<path:path>")\n\
def serve_static(path):\n\
    static_path = os.path.join("static", path)\n\
    if os.path.exists(static_path):\n\
        return send_file(static_path)\n\
    return send_file("static/index.html")\n\
' >> app.py

# Expose port
EXPOSE 5001

# Run the application - bind to 0.0.0.0 to accept external connections
CMD ["python", "-c", "import app; app.app.run(host='0.0.0.0', port=5001)"]
