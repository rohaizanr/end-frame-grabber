# LastSnap Free - Quick Reference Card

## 🚀 Quick Start

```bash
# Clone and start
git clone <repo-url>
cd free-version
./start.sh

# Or use Docker Compose
docker-compose up -d

# Or use Makefile
make up
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## 📦 Installation Methods

### Method 1: Docker (Recommended)
```bash
docker-compose up -d
```

### Method 2: Local Development
```bash
# Backend
cd backend && pip install -r requirements.txt && python app.py

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

## 🛠️ Common Commands

### Docker Compose
```bash
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose logs -f        # View logs
docker-compose restart        # Restart
docker-compose up --build     # Rebuild and start
```

### Makefile
```bash
make up        # Start
make down      # Stop
make logs      # View logs
make restart   # Restart
make build     # Build
make clean     # Clean up
```

## 🔧 Configuration

### Backend (.env or environment)
```env
FLASK_ENV=production
PORT=5001
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001
```

## 📡 API Endpoints

### Extract Frame
```bash
# Using curl
curl -X POST -F "video=@video.mp4" http://localhost:5001/extract-frame -o frame.jpg

# Using JavaScript
const formData = new FormData();
formData.append('video', videoFile);
fetch('http://localhost:5001/extract-frame', {
  method: 'POST',
  body: formData
})
```

### Health Check
```bash
curl http://localhost:5001/health
```

## 📁 Project Structure
```
free-version/
├── backend/          # Python Flask API
├── frontend/         # React app
├── docker-compose.yml
├── README.md
└── start.sh
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :5001  # Backend
lsof -i :3000  # Frontend

# Kill the process
kill -9 <PID>
```

### Docker Issues
```bash
# View container logs
docker-compose logs backend
docker-compose logs frontend

# Restart containers
docker-compose restart

# Rebuild from scratch
docker-compose down
docker-compose up --build
```

### Backend Won't Start
```bash
# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 20+
```

## 🔒 Default Configuration

- **CORS**: Enabled for all origins
- **Authentication**: None required
- **Rate Limiting**: None
- **Max Upload Size**: Limited by server memory
- **Supported Formats**: MP4 only

## 📚 Documentation

- **Full Guide**: [README.md](README.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
- **Project Summary**: [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)

## 🆘 Need Help?

1. Check [README.md](README.md) for detailed documentation
2. See [Troubleshooting](#troubleshooting) section above
3. Open an issue on GitHub

## 📄 License

MIT License - Free for any use

---

**Version**: 1.0.0
**Updated**: December 16, 2025
