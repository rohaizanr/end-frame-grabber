# 🎬 LastSnap Free - Project Summary

## Overview

LastSnap Free is a simplified, open-source version of the LastSnap video frame extraction tool. This version removes all enterprise features (security layers, Kubernetes, Cloudflare integration, Turnstile verification) and focuses on providing a clean, simple, and free tool for extracting the last frame from MP4 videos.

## What Was Changed

### ✅ Removed Features
- ❌ Cloudflare Turnstile verification
- ❌ Kubernetes deployment configurations
- ❌ Complex security layers and WAF
- ❌ Domain-specific CORS restrictions
- ❌ Production architecture documentation
- ❌ Enterprise deployment guides
- ❌ Multiple environment configurations

### ✅ Added Features
- ✅ Simplified single README.md with all documentation
- ✅ Docker Compose for one-command deployment
- ✅ Open CORS policy (accepts all origins)
- ✅ Quick start script (`start.sh`)
- ✅ Makefile for common commands
- ✅ Comprehensive inline documentation
- ✅ Contributing guidelines
- ✅ MIT License
- ✅ Changelog for version tracking

## Project Structure

```
free-version/
├── backend/
│   ├── app.py                 # Simplified Flask app (no Turnstile)
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile            # Backend container
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # React app (no Turnstile UI)
│   │   ├── App.css           # Styles (kept from original)
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   ├── index.html            # HTML template
│   ├── package.json          # Dependencies (removed @marsidev/react-turnstile)
│   ├── vite.config.js        # Vite config
│   ├── Dockerfile            # Frontend container
│   └── .env.example          # Environment template
│
├── docker-compose.yml         # Orchestration for both services
├── start.sh                  # Quick start script
├── Makefile                  # Common commands
├── README.md                 # Complete documentation
├── CONTRIBUTING.md           # Contribution guidelines
├── CHANGELOG.md              # Version history
├── LICENSE                   # MIT License
└── .gitignore               # Git ignore rules
```

## Key Differences from Enterprise Version

| Feature | Enterprise Version | Free Version |
|---------|-------------------|--------------|
| **Security** | Multi-layer (Cloudflare + WAF + Turnstile) | None (open access) |
| **CORS** | Restricted to specific domains | Open to all origins |
| **Deployment** | Kubernetes + Nginx Ingress | Docker Compose |
| **Authentication** | Turnstile verification required | None required |
| **Documentation** | Multiple specialized docs | Single comprehensive README |
| **Setup Complexity** | High (multiple services) | Low (one command) |
| **Target Audience** | Production/Enterprise | Developers/Hobbyists |

## Technology Stack

### Backend
- **Language**: Python 3.11
- **Framework**: Flask
- **Video Processing**: OpenCV (cv2)
- **CORS**: Flask-CORS (open policy)
- **Container**: Python slim image

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Modern CSS with custom properties
- **Container**: Node Alpine + Nginx Alpine (multi-stage)

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (for frontend static files)

## Quick Start

### Using Start Script (Easiest)
```bash
cd free-version
./start.sh
```

### Using Docker Compose
```bash
cd free-version
docker-compose up -d
```

### Using Makefile
```bash
cd free-version
make up
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## API Endpoints

### POST /extract-frame
Extracts the last frame from an uploaded MP4 video.

**Request:**
- Content-Type: multipart/form-data
- Body: `video` (file)

**Response:**
- Success: JPEG image (200)
- Error: JSON with error message (400/500)

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Environment Variables

### Backend
- `FLASK_ENV`: development or production (default: production)
- `PORT`: Backend port (default: 5001)

### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:5001)

## File Sizes

- **Backend Image**: ~500MB (includes OpenCV dependencies)
- **Frontend Image**: ~25MB (multi-stage build with Nginx)
- **Total**: ~525MB

## Performance

- **Frame Extraction**: 0.5-2 seconds per video
- **Upload Speed**: Depends on network and video size
- **Concurrent Users**: Limited by server resources

## Development Workflow

1. **Clone and enter directory**
   ```bash
   git clone <repo>
   cd free-version
   ```

2. **Local development**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   python app.py
   
   # Frontend (in new terminal)
   cd frontend
   npm install
   npm run dev
   ```

3. **Docker development**
   ```bash
   docker-compose up --build
   ```

## Future Enhancements

See [CHANGELOG.md](CHANGELOG.md) for planned features:
- Additional video formats (AVI, MOV, WebM)
- Multiple frame extraction
- Timestamp-based extraction
- Batch processing
- Video thumbnails
- GIF generation

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) file.

## Support

- **Issues**: Open an issue on GitHub
- **Documentation**: See README.md
- **Contributing**: See CONTRIBUTING.md

---

**Created**: December 16, 2025
**Version**: 1.0.0
**License**: MIT
**Status**: Stable and production-ready for free use
