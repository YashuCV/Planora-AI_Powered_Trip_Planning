# Planora – Access URLs

## Services

### Frontend (React)
**URL:** http://localhost:5173

- Landing: http://localhost:5173
- Register: http://localhost:5173/register
- Login: http://localhost:5173/login
- Dashboard: http://localhost:5173/dashboard
- Trip Planner: http://localhost:5173/planner

Frontend proxies `/api` to the backend (port 3001).

---

### Backend API (Express)
**URL:** http://localhost:3001

- Health: http://localhost:3001/health
- Register: `POST http://localhost:3001/api/auth/register`
- Login: `POST http://localhost:3001/api/auth/login`
- Current user: `GET http://localhost:3001/api/auth/me` (Bearer token required)

**Quick test:**
```bash
curl http://localhost:3001/health
```

---

### PostgreSQL
**Host:** localhost  
**Port:** 5432  
**Database:** travelguide  
**User:** travelguide  
**Password:** travelguide_secret

**Connect:**
```bash
docker exec -it planora-db psql -U travelguide -d travelguide
```

**Example:**
```sql
SELECT id, email, full_name FROM users;
```

---

## Quick start

1. Start DB: `cd database && docker-compose up -d`
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`

## Test flow

1. Open http://localhost:5173
2. Sign up → Log in
3. Open Dashboard (trips list)
4. Use Trip Planner to create an itinerary

## Troubleshooting

| Issue            | Command / check                          |
|------------------|------------------------------------------|
| Backend not up   | `cd backend && npm run dev`              |
| Frontend not up  | `cd frontend && npm run dev`             |
| DB not up        | `cd database && docker-compose up -d`    |
| Check services   | `curl http://localhost:3001/health`      |
| Check DB         | `docker exec planora-db psql -U travelguide -d travelguide -c "SELECT 1;"` |
