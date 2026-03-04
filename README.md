## STT Travel – FastAPI + Supabase + React

A minimal, modern full‑stack travel website. The backend is a FastAPI service connected to Supabase;
the frontend is a Vite + React SPA that consumes exactly 10 APIs.

### Stack

- **Backend**: FastAPI, Supabase (PostgreSQL), Uvicorn
- **Frontend**: React 18, React Router, Vite, Axios

### Backend structure

- `backend/app/main.py` – FastAPI app and **10 routes**:
  - `GET /api/health`
  - `GET /api/packages`
  - `GET /api/packages/{package_id}`
  - `GET /api/packages/featured`
  - `GET /api/gallery`
  - `GET /api/reviews`
  - `POST /api/reviews`
  - `GET /api/faqs`
  - `GET /api/videos`
  - `POST /api/contact`
- `backend/app/database.py` – Supabase client bootstrap
- `backend/app/models.py` – Pydantic models for request/response schemas

### Frontend structure

- `frontend/src/App.jsx` – Layout, routes, shell
- `frontend/src/services/api.js` – All API calls
- `frontend/src/components/*` – `Navbar`, `Footer`, `PackageCard`, `ChatBot`
- `frontend/src/pages/*` – Home, Packages, PackageDetail, Gallery, Reviews, Videos, FAQ, Contact, About, Admin
- `frontend/src/styles.css` – Clean, minimal global styling

### Getting started

#### Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate  # Windows PowerShell
pip install -r requirements.txt

# Copy env template and fill in values
copy .env.example .env  # Windows

uvicorn app.main:app --reload
```

Configure Supabase tables such as `packages`, `gallery_images`, `reviews`, `faqs`, `videos`,
and `contact_messages` with columns matching the Pydantic models.

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

By default, Vite proxies `/api` to `http://localhost:8000`, so the SPA and backend can be
developed together on separate ports.

### Notes

- There is **no authentication, payments or booking system**; the focus is browsing and content.
- All external calls are centralized in `services/api.js` for easy refactoring.
- The design favors a calm, minimal interface that you can easily restyle or extend.
