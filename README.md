# Planora – AI-Powered Trip Planning

An AI-powered travel planning assistant that helps you plan complete trips with detailed day-by-day itineraries, including activities, dining, and attractions.

## Features

- **Natural Language Trip Planning**: Describe your trip in plain English; the AI parses your needs
- **Smart Itinerary Generation**: Day-by-day itineraries with attractions, restaurants, and activities
- **User Authentication**: JWT and bcrypt for secure login
- **Trip Management**: Create, view, and delete trips
- **Detailed Itineraries**: Day-by-day plans with times, locations, and descriptions

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express (auth, trips, AI integration)
- **AI**: Groq API (llama-3.3-70b-versatile)
- **Database**: PostgreSQL
- **Auth**: JWT, bcrypt

## Project Structure

```
Planora/
├── frontend/           # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
├── backend/            # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   └── package.json
├── database/
│   ├── init.sql        # Schema
│   └── docker-compose.yml   # PostgreSQL only
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for PostgreSQL)
- Groq API key: https://console.groq.com

### Installation

1. **Clone and enter the project**
   ```bash
   git clone <repository-url>
   cd "Planora - AI Powered Trip Planning"
   ```

2. **Start PostgreSQL**
   ```bash
   cd database
   docker-compose up -d
   ```

3. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env   # if present, or create .env
   ```
   Set in `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=travelguide
   DB_USER=travelguide
   DB_PASSWORD=travelguide_secret

   JWT_SECRET=your-secret-key-change-this

   GROQ_API_KEY=your-groq-api-key
   GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
   ```
   Then:
   ```bash
   npm run dev   # http://localhost:3001
   ```

4. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev   # http://localhost:5173
   ```

5. **Use the app**
   - App: http://localhost:5173
   - API: http://localhost:3001

## Environment Variables (Backend)

| Variable        | Description              | Required |
|----------------|--------------------------|----------|
| `DB_HOST`      | PostgreSQL host          | Yes      |
| `DB_PORT`      | PostgreSQL port          | Yes      |
| `DB_NAME`      | Database name            | Yes      |
| `DB_USER`      | Database user            | Yes      |
| `DB_PASSWORD`  | Database password        | Yes      |
| `JWT_SECRET`   | JWT signing secret       | Yes      |
| `GROQ_API_KEY` | Groq API key             | Yes      |
| `GROQ_API_URL` | Groq API endpoint        | Yes      |

## Usage

1. **Sign up / Log in** on the app
2. **Plan a trip** with a natural language request, e.g.  
   *"4-day trip to Tokyo for 2 people. We like food, tech, and traditional culture."*
3. **View itinerary** – day-by-day plan with places, restaurants, and activities
4. **Manage trips** from the dashboard (view, delete)

## API Endpoints

### Auth
- `POST /api/auth/register` – Register
- `POST /api/auth/login` – Login
- `GET /api/auth/me` – Current user (auth required)

### Trips
- `GET /api/trips` – List user trips
- `POST /api/trips` – Create trip (AI parsing)
- `GET /api/trips/:id` – Trip details
- `DELETE /api/trips/:id` – Delete trip

### Itineraries
- `GET /api/itinerary/:tripId` – Get itinerary
- `POST /api/itinerary/generate/:tripId` – Generate (often triggered on trip creation)

## Architecture

```
Frontend (React) → Backend (Express) → Groq API
                         ↓
                  PostgreSQL
```

- **Frontend**: SPA calling backend API
- **Backend**: Auth, trip CRUD, AI calls, DB
- **Groq**: Trip parsing and itinerary generation
- **PostgreSQL**: Users, trips, itineraries

## Development

- **Frontend**: `cd frontend && npm run dev`
- **Backend**: `cd backend && npm run dev`
- **DB**: Schema is applied when the Postgres container starts. Connect:
  ```bash
  docker exec -it planora-db psql -U travelguide -d travelguide
  ```

## Troubleshooting

- **Backend won’t start**: Check Postgres is up (`docker ps`), and `backend/.env` credentials.
- **Frontend can’t reach backend**: Ensure backend runs on 3001; check CORS and `VITE_API_URL` if used.
- **DB connection errors**: Containers running; credentials in `backend/.env` match `database/docker-compose.yml`.
- **Itinerary not generating**: Set `GROQ_API_KEY` in `backend/.env` and confirm key at https://console.groq.com.

See **DEBUG_GUIDE.md** for log and network debugging.

## License

MIT
