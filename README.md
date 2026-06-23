# Dish Management Dashboard

Production-grade dish management system with real-time WebSocket updates.

## Stack
- **Frontend**: React + Vite + Tailwind CSS + Chart.js
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB Atlas
- **Real-time**: WebSockets

---

## Local Development

### 1. MongoDB Atlas Setup
1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user with read/write permissions
3. Whitelist your IP (or use 0.0.0.0/0 for dev)
4. Copy the connection string into `backend/.env`

### 2. Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # fill in MONGODB_URI
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # adjust if backend URL differs
npm run dev
```

Open http://localhost:5173

---

## Docker Deployment

```bash
# Fill in backend/.env with real MONGODB_URI first
docker-compose up --build
```

Frontend → http://localhost:80  
Backend  → http://localhost:8000

---

## Render Deployment (Backend)

1. Push repo to GitHub
2. New Web Service on https://render.com
3. Runtime: Python 3, Build: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables: `MONGODB_URI`, `DATABASE_NAME`, `ALLOWED_ORIGINS`

---

## Vercel Deployment (Frontend)

1. Push repo to GitHub
2. Import project at https://vercel.com/new
3. Framework preset: Vite
4. Root directory: `frontend`
5. Environment variables:
   - `VITE_API_BASE_URL` = your Render backend URL
   - `VITE_WS_URL` = `wss://your-render-url/ws`

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dishes` | List all dishes |
| POST | `/api/dishes` | Create a dish |
| PATCH | `/api/dishes/{id}/toggle` | Toggle published |
| DELETE | `/api/dishes/{id}` | Delete a dish |
| WS | `/ws` | Real-time updates |

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `DATABASE_NAME` | Database name (default: `dish_management`) |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend HTTP URL |
| `VITE_WS_URL` | Backend WebSocket URL |
