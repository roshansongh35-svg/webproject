# ARKIV Capstone — PRD

## Original problem statement
Design and develop a fully functional, multi-page web application using HTML, CSS, JavaScript, PHP, and MySQL for a capstone project. Min 6 pages (Home, About, Features, Data, Login, Contact). Responsive design, JS interactivity (calculator/form validation), PHP server-side handling with sessions across 2+ pages, MySQL CRUD, deployment-ready.

## Stack decision
- React 19 + Tailwind (frontend)
- FastAPI + Pydantic (backend)
- MongoDB + Motor async driver
- JWT in httpOnly cookies (with Bearer fallback) for sessions
- Bcrypt password hashing
- Phosphor icons · Cabinet Grotesk + IBM Plex fonts (Swiss/brutalist aesthetic)

PHP/MySQL substitution rationale: Emergent platform is React+FastAPI+Mongo native. Spirit of the brief is preserved — full mapping documented in `/app/docs/PHP_TO_FASTAPI_MAPPING.md`.

## User personas
- **Capstone reviewer / professor** — needs to verify each brief requirement is met
- **Student demonstrator** — wants to log in, archive a record, show the GPA calculator
- **Anonymous visitor** — explores marketing pages and submits a contact message

## Core requirements (static)
- 6 pages with consistent navigation: Home, About, Features, Data (protected), Login, Contact
- Responsive layout: mobile menu, grid → stacked at md/lg breakpoints
- DHTML: GPA calculator (add/remove rows, live recompute)
- Form validation: client-side (regex, length, range) + server-side (Pydantic)
- Sessions: persist auth across at least Login → Data → Contact
- CRUD: create + read student records via authenticated API
- Deployment-ready: env-driven, single repo, README + docs

## Implemented (2026-02 / iteration 1)
- ✅ Backend: `/api/auth/{register,login,logout,me}`, `/api/records`, `/api/records/public`, `/api/contact`, `/api/stats`, `/api/health`
- ✅ Admin seed on startup (`admin@arkiv.edu` / `Admin@123`)
- ✅ MongoDB indexes (unique email)
- ✅ JWT cookie + Bearer fallback (works in cross-origin previews)
- ✅ Frontend: 6 routes, Layout/Navbar/Footer, ProtectedRoute, AuthContext
- ✅ Home: ticker, asymmetric hero, KPI grid, feature bento, recent records preview
- ✅ About: editorial 2-column with sticky aside + objectives grid
- ✅ Features: 8-feature bento with 1px borders + brief cross-reference table
- ✅ Data: KPI row, CRUD form (left), GPA calculator with editable rows (right), live records table with search
- ✅ Login: split-screen with image, login + register tabs, validation, error shake
- ✅ Contact: brutalist big-type heading, 1px form, success/error states
- ✅ Backend pytest suite (13/13 passing)
- ✅ README, ARCHITECTURE.md (Mermaid), PHP→FastAPI mapping
- ✅ Deployment health check passed

## Backlog (priority-tagged)

### P1 — quality / submission polish
- Brute-force lockout on `/api/auth/login` (5 fails → 15 min)
- Tighten CORS to specific frontend origin
- Add per-field inline validation testids on Login (`login-email-error`, etc.)
- Update / Delete on records (full CRUD beyond the brief's "Create + Read")

### P2 — nice to have
- Export records to CSV
- Admin-only view: list registered users
- Email confirmation on register
- Light/dark theme toggle
- Charts on the Data dashboard (GPA distribution by semester)
- Pagination on records table

### P3 — stretch
- Forgot password flow with token email
- File upload (transcripts) using object storage
- Role-based granular permissions

## Next tasks
- (User) Click **Deploy** in the Emergent UI to publish.
- (User) Optionally rotate `ADMIN_PASSWORD` in `backend/.env` before deploy.
- (Agent, on request) Pick up P1 items above.
