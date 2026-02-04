# Planora Backend API

Node.js/Express backend for authentication, trip management, and AI-powered itinerary generation.

## Features

- ✅ **User Authentication**: Secure registration/login with JWT and bcrypt
- ✅ **Trip Management**: Create, read, and delete trips
- ✅ **AI-Powered Parsing**: Uses Groq API to parse natural language trip requests
- ✅ **Itinerary Generation**: Automatically generates detailed day-by-day itineraries
- ✅ **Database Integration**: PostgreSQL for data persistence

## Architecture

```
Frontend (React)
    ↓
Backend (Express) ← Authentication, Trip Management, AI Integration
    ↓
Groq API ← AI for trip parsing and itinerary generation
    ↓
PostgreSQL Database
```

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file:**
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=travelguide
   DB_USER=travelguide
   DB_PASSWORD=travelguide_secret
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this
   
   # Groq API (Free AI)
   GROQ_API_KEY=your-groq-api-key-here
   GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
   
   # Server
   PORT=3001
   ```

3. **Start the server:**
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth token)

### Trips

- `GET /api/trips` - Get all trips for current user
- `POST /api/trips` - Create a new trip (AI-powered parsing)
- `GET /api/trips/:id` - Get trip details
- `DELETE /api/trips/:id` - Delete a trip

### Itineraries

- `GET /api/itinerary/:tripId` - Get itinerary for a trip
- `POST /api/itinerary/generate/:tripId` - Generate itinerary (auto-triggered)

## Request Examples

**Register:**
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Create Trip:**
```json
POST /api/trips
Headers: Authorization: Bearer <token>
{
  "request": "Plan a 4-day trip to Tokyo for 2 people. We love food and technology."
}
```

**Get Current User:**
```bash
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (via pg library)
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **AI**: Groq API (llama-3.3-70b-versatile)
- **HTTP Client**: Axios

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # PostgreSQL connection
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── tripController.js     # Trip CRUD + AI parsing
│   │   └── itineraryController.js # Itinerary generation
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.js    # Auth endpoints
│   │   ├── tripRoutes.js    # Trip endpoints
│   │   └── itineraryRoutes.js # Itinerary endpoints
│   └── server.js            # Express app setup
├── package.json
└── README.md
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_PORT` | PostgreSQL port | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database user | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `GROQ_API_KEY` | Groq API key (get from https://console.groq.com) | Yes |
| `GROQ_API_URL` | Groq API endpoint | Yes (default provided) |
| `PORT` | Server port | No (default: 3001) |

## Development

The backend uses `nodemon` for auto-reload during development:

```bash
npm run dev
```

## See Also

- [Main README](../README.md) - Full project documentation
