# Contributing to LastSnap Free

Thank you for your interest in contributing to LastSnap Free! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Docker version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:
- A clear title and description
- The problem it solves
- Proposed implementation (optional)
- Examples or mockups (optional)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test your changes**
   - Test the backend with different video files
   - Test the frontend on different browsers
   - Run the Docker containers to ensure they build
5. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

## 📝 Development Guidelines

### Code Style

**Python (Backend):**
- Follow PEP 8 style guide
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

**JavaScript/React (Frontend):**
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Keep components small and reusable
- Use CSS for styling (no inline styles unless necessary)

### Commit Messages

Use clear and descriptive commit messages:
- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for improvements to existing features
- `Refactor:` for code refactoring
- `Docs:` for documentation changes

Examples:
```
Add: support for AVI video format
Fix: error handling for corrupted videos
Update: improve upload progress indicator
Refactor: simplify frame extraction logic
Docs: add troubleshooting section
```

### Testing

Before submitting a PR:

**Backend:**
```bash
cd backend
python app.py
# Test with curl or Postman
```

**Frontend:**
```bash
cd frontend
npm run dev
# Test in browser
```

**Docker:**
```bash
docker-compose up --build
# Test the complete application
```

## 🐛 Debugging

### Backend Debugging

Add print statements or use Python debugger:
```python
import pdb; pdb.set_trace()
```

### Frontend Debugging

Use browser DevTools:
- Console tab for errors
- Network tab for API calls
- React DevTools extension

## 📚 Project Structure

```
free-version/
├── backend/           # Flask API
│   ├── app.py        # Main application
│   └── ...
├── frontend/         # React app
│   ├── src/         # Source code
│   └── ...
└── docker-compose.yml
```

## 🔧 Adding New Features

### Adding a New Video Format

1. Update backend to handle new format (app.py)
2. Update frontend file input accept attribute (App.jsx)
3. Test with sample videos
4. Update documentation

### Adding Frame Selection Options

1. Add new endpoint in backend (e.g., `/extract-frame-at/<timestamp>`)
2. Add UI controls in frontend
3. Update API documentation
4. Test thoroughly

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💡 Questions?

Open an issue or discussion if you have questions!

Thank you for contributing! 🎉
