# DishBoard — Restaurant CMS

Full-stack restaurant content management system with real-time WebSocket updates.

**Stack:** React + Vite + Tailwind · FastAPI + Motor · MongoDB Atlas · WebSockets

**Pages:**
- `/admin` — dish management dashboard (add, edit, delete, publish, analytics)
- `/menu` — public customer-facing menu (published dishes only, live updates)

---

## Local Development

### 1. MongoDB Atlas

1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user (read/write access)
3. Add your IP to the allowlist (Network Access → `0.0.0.0/0` for dev)
4. Copy the connection string

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
cp .env.example .env
# Edit .env — paste your MONGODB_URI

python -m uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
# .env already has empty values for dev (Vite proxy handles routing)
npm run dev
```

Open http://localhost:5173/admin

---

## Production Deployment

### Step 1 — Deploy Backend to Render

1. Go to https://render.com → **New Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables** in the Render dashboard:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your Atlas connection string |
   | `DATABASE_NAME` | `dish_management` |
   | `ALLOWED_ORIGINS` | `https://your-app.vercel.app` (fill after Vercel deploy) |

5. Click **Deploy** — note your Render URL e.g. `https://dishboard-api.onrender.com`

### Step 2 — Deploy Frontend to Vercel

1. Go to https://vercel.com → **New Project** → Import your GitHub repo
2. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
3. Add **Environment Variables:**

   | Key | Value |
   |-----|-------|
   | `VITE_API_BASE_URL` | `https://dishboard-api.onrender.com` |
   | `VITE_WS_URL` | `wss://dishboard-api.onrender.com/ws` |

4. Click **Deploy** — note your Vercel URL e.g. `https://dishboard.vercel.app`

### Step 3 — Update ALLOWED_ORIGINS on Render

Go back to Render → your service → **Environment** → update `ALLOWED_ORIGINS`:

```
https://dishboard.vercel.app
```

Click **Save** — Render will redeploy automatically.

### Step 4 — MongoDB Atlas: Allow Render IPs

Render uses dynamic IPs on the free tier. The easiest fix:

1. MongoDB Atlas → **Network Access** → **Add IP Address**
2. Click **Allow Access From Anywhere** (`0.0.0.0/0`)
3. Click **Confirm**

> For production security, upgrade to Render paid tier for static IPs and whitelist only those.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dishes` | All dishes (admin) |
| POST | `/api/dishes` | Create dish |
| PATCH | `/api/dishes/:id` | Edit dish fields |
| PATCH | `/api/dishes/:id/toggle` | Toggle published |
| DELETE | `/api/dishes/:id` | Delete dish |
| POST | `/api/dishes/upload-image` | Upload image |
| GET | `/api/menu` | Published dishes (public) |
| GET | `/api/menu/:id` | Single published dish |
| GET | `/api/activities` | Recent activity log |
| WS | `/ws` | Real-time updates |

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `DATABASE_NAME` | Database name (`dish_management`) |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend URL (empty in dev, Render URL in prod) |
| `VITE_WS_URL` | WebSocket URL (`wss://` in prod) |
