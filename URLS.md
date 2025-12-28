# 🌐 Travel Guide - All Access URLs

## ✅ Services Running

### 🎨 **Frontend (React App)**
**URL:** http://localhost:5173 ✅ **WORKING**

**What to check:**
- ✅ Landing page: http://localhost:5173
- ✅ Register new user: http://localhost:5173/register
- ✅ Login: http://localhost:5173/login
- ✅ Dashboard (after login): http://localhost:5173/dashboard
- ✅ Trip Planner: http://localhost:5173/planner

**Note:** Frontend proxies `/api/*` to backend (3001) and `/webhook/*` to n8n (5678)

---

### 🔧 **Backend API (Express)**
**URL:** http://localhost:3001 ✅ **WORKING**

**Endpoints:**
- ✅ Health check: http://localhost:3001/health
- ✅ Register: `POST http://localhost:3001/api/auth/register`
- ✅ Login: `POST http://localhost:3001/api/auth/login`
- ✅ Get current user: `GET http://localhost:3001/api/auth/me` (requires Bearer token)

**Test:** Open http://localhost:3001/health in browser - should show JSON response

**Test with curl:**
```bash
# Health check
curl http://localhost:3001/health

# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

### 🤖 **n8n Dashboard (Workflow Automation)**
**URL:** http://localhost:5678 ✅ **WORKING**

**What to check:**
- ✅ n8n workflow editor
- ✅ Import workflows from `n8n/workflows/` directory
- ✅ Configure credentials (OpenAI, PostgreSQL)
- ✅ View workflow executions
- ✅ Test webhooks

**Note:** n8n is used for AI workflows and automation, NOT for authentication anymore.

---

### 🗄️ **PostgreSQL Database**
**Host:** localhost  
**Port:** 5432  
**Database:** travelguide  
**User:** travelguide  
**Password:** travelguide123

**Connect with:**
```bash
docker exec -it travel-guide-db psql -U travelguide -d travelguide
```

**Check users:**
```sql
SELECT id, email, full_name FROM users;
```

---

### 📊 **pgAdmin (Database Management)**
**URL:** http://localhost:5050

**What to check:**
- ✅ Database management UI
- ✅ View tables
- ✅ Run SQL queries
- ✅ Check user data

**Login credentials:** (check docker-compose.yml or use default)

---

## 🚀 Quick Start Checklist

1. ✅ **Database & n8n running** (Docker containers)
2. ✅ **Backend running** (http://localhost:3001)
3. ✅ **Frontend running** (http://localhost:5173)

## 📝 Testing Flow

1. **Open Frontend:** http://localhost:5173
2. **Register:** Click "Sign up" → Create account
3. **Login:** Use your credentials
4. **Dashboard:** Should see your trips (empty initially)
5. **Plan Trip:** Use Trip Planner to create AI-powered itineraries

## 🔍 Troubleshooting

**Backend not running?**
```bash
cd backend
npm run dev
```

**Frontend not running?**
```bash
cd frontend
npm run dev
```

**Database not running?**
```bash
cd n8n
docker-compose up -d
```

**Check all services:**
```bash
# Backend
curl http://localhost:3001/health

# Frontend
curl http://localhost:5173

# n8n
curl http://localhost:5678

# Database
docker exec travel-guide-db psql -U travelguide -d travelguide -c "SELECT 1;"
```

