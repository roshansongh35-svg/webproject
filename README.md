# ARKIV — Academic Records Capstone

> A multi-page, full-stack web application demonstrating responsive design, server-side form handling, session/cookie management, CRUD persistence, and DHTML interactivity.

**Live demo:** _to be filled after deploy_
**Stack:** React 19 · FastAPI · MongoDB · Tailwind CSS · JWT auth (httpOnly cookies)

---

## 1. Capstone Brief Compliance

| Requirement (original PHP/MySQL brief)                     | Implementation in ARKIV                                                              |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Minimum 6 pages                                            | Home · About · Features · Data · Login · Contact                                      |
| Responsive design (Box Model, Positioning, Floats)         | Tailwind utility classes — flex/grid, position, float — mobile-first across all pages |
| JavaScript / DHTML interactive feature                     | Live GPA calculator (add/remove rows, instant recompute) + form validation             |
| Server-side form handling                                  | FastAPI endpoints with Pydantic validation                                            |
| Session / Cookie management across 2+ pages                | JWT in `httpOnly` cookie — persists across Login → Data → Contact (12-hour lifetime)    |
| MySQL CRUD (Create + Read)                                 | MongoDB collections — `users`, `records`, `messages` (Create + Read implemented)       |
| Clear navigation & consistent styling                      | Sticky `Navbar`, shared `Layout`, Swiss-brutalist design system                        |
| Deployment ready (GitHub + live host)                      | Single repo, env-driven, deploy notes below                                           |

> **Note on stack substitution.** The original brief specified PHP + MySQL. This implementation preserves the *spirit* of the brief — server-rendered data flow, session continuity, schema-backed persistence — using a modern, auditable Python + JS stack. See `docs/PHP_TO_FASTAPI_MAPPING.md` for a one-to-one concept map.

---

## 2. Project structure

```
/app
├── backend/
│   ├── server.py          # FastAPI app, /api routes, JWT auth, CRUD
│   ├── requirements.txt
│   └── .env               # MONGO_URL, DB_NAME, JWT_SECRET, ADMIN_*, CORS_ORIGINS
├── frontend/
│   ├── src/
│   │   ├── App.js                  # Routes
│   │   ├── index.css               # Design system (Cabinet Grotesk + IBM Plex)
│   │   ├── lib/api.js              # Axios w/ withCredentials + Bearer fallback
│   │   ├── context/AuthContext.jsx # Session state
│   │   ├── components/
│   │   │   ├── Navbar.jsx · Footer.jsx · Layout.jsx · ProtectedRoute.jsx
│   │   └── pages/
│   │       ├── Home.jsx · About.jsx · Features.jsx
│   │       ├── Data.jsx (CRUD form + GPA calculator + table)
│   │       ├── Login.jsx (login + register tabs)
│   │       └── Contact.jsx
│   ├── package.json
│   └── .env               # REACT_APP_BACKEND_URL
├── docs/
│   ├── ARCHITECTURE.md           # System diagram (Mermaid)
│   └── PHP_TO_FASTAPI_MAPPING.md # Brief-to-implementation map
└── memory/
    ├── PRD.md
    └── test_credentials.md
```

---

## 3. Quick start (local dev)

### Prerequisites
- Node.js 18+ and **Yarn** (do not use npm)
- Python 3.11+
- MongoDB running locally (default `mongodb://localhost:27017`)

### Backend
```bash
cd backend
pip install -r requirements.txt
# Edit .env if needed (MONGO_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD)
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd frontend
yarn install
# Set REACT_APP_BACKEND_URL in .env to http://localhost:8001
yarn start
```

App runs at: **http://localhost:3000**
API docs at: **http://localhost:8001/docs**

---

## 4. Default credentials

The backend seeds an admin account on first startup using the values in `backend/.env`:

| Field    | Value             |
| -------- | ----------------- |
| Email    | `admin@arkiv.edu` |
| Password | `Admin@123`       |
| Role     | `admin`           |

Anyone can also self-register on `/login` (Register tab) — new accounts get `student` role.

> ⚠️ **Change the admin password before deploying to production** — edit `ADMIN_PASSWORD` in `backend/.env`. The startup hook will hash and update it automatically.

---

## 5. API surface

All endpoints are prefixed with `/api`.

### Auth
- `POST /api/auth/register` `{ name, email, password }` → user + cookie
- `POST /api/auth/login` `{ email, password }` → user + cookie
- `POST /api/auth/logout` → clears cookie
- `GET  /api/auth/me` → current user (auth required)

### Records (CRUD — Create + Read)
- `POST /api/records` `{ student_name, student_id, course, semester, gpa, notes }` (auth)
- `GET  /api/records` → list all records (auth)
- `GET  /api/records/public` → 10 most recent (public sample)

### Misc
- `GET  /api/health`
- `GET  /api/stats` → user/record/message counts + average GPA
- `POST /api/contact` `{ name, email, subject, message }` → store message

---

## 6. Deployment

### Option A — Emergent (one click)
Click **Deploy** in the Emergent UI (top right of the editor). The platform handles the container build, MongoDB provisioning, env injection, and ingress. No additional configuration needed.

### Option B — GitHub + any modern host

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "ARKIV capstone v1.0.0"
   git branch -M main
   git remote add origin git@github.com:<you>/arkiv.git
   git push -u origin main
   ```

2. **Backend** (Render / Railway / Fly / Heroku)
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - Env vars: `MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGINS=https://your-frontend.example`

3. **Frontend** (Vercel / Netlify / Cloudflare Pages)
   - Framework: Create React App
   - Root: `frontend/`
   - Build: `yarn build`
   - Output: `build/`
   - Env var: `REACT_APP_BACKEND_URL=https://your-backend.example`

4. **Database**
   - Use **MongoDB Atlas** free tier — paste the connection string into `MONGO_URL`.

### Option C — Classic PHP host (XAMPP / 000webhost / cPanel)
Not applicable — this app uses FastAPI, not PHP. To run on a traditional PHP host, port the backend logic to PHP using the concept map in `docs/PHP_TO_FASTAPI_MAPPING.md`.

---

## 7. Testing

- Backend pytest suite: `backend/tests/test_arkiv_api.py` — 13 tests covering auth, CRUD, validation.
- Run: `cd backend && pytest tests/ -v`
- Manual test credentials: see `memory/test_credentials.md`.

---

## 8. License

MIT — free to use for academic submission and beyond.
