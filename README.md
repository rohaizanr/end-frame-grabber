# End Frame Grabber

This project consists of a React frontend and a Python Flask backend to extract the last frame of an MP4 video. Usually used for AI video creations.

## Prerequisites

- Node.js and npm
- Python 3.x

## Setup & Run

### 1. Backend (Python)

Navigate to the `backend` folder:

# End Frame Grabber

A small utility that extracts the last frame from an MP4 video using a React frontend and a Python Flask backend.

**Quick Links:**

- **Repo:** `end-frame-grabber`
- **Demo / Local frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5001`

---

## Table of Contents

- Features
- Prerequisites
- Quick Start
	- Backend
	- Frontend
- Usage
- Development
- License
- Acknowledgements

---

## Features

- Upload an MP4 file from the browser
- Server-side extraction of the final frame
- Preview and download the resulting image

## Prerequisites

- Node.js (v14+ recommended) and npm/yarn
- Python 3.8+

## Quick Start

Clone the repo and run backend and frontend in separate terminals.

### Backend (Python)

```bash
cd backend
# (optional) create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

The backend listens on `http://localhost:5001` by default.

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` (Vite default).

## Usage

1. Open the frontend in your browser.
2. Choose an MP4 video using the file picker.
3. Click "Extract End Frame" to upload and process the file.
4. Preview the extracted frame and download it if desired.

## Development

- Backend: `backend/app.py` (Flask)
- Frontend: `frontend/src` (React + Vite)

Make changes, then restart the relevant dev server.

## License

This project is licensed under the MIT License — see the included `LICENSE` file for details.

## Acknowledgements & Linkback

Built with ❤️. For more projects and resources, visit https://4w4n.com — thanks for the support!

