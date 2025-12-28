# Travel Guide AI

An AI-powered travel planning assistant that helps you plan complete trips with detailed day-by-day itineraries, including activities, dining, and attractions.

## Features

- **Natural Language Trip Planning**: Describe your trip in plain English, and the AI will understand your needs
- **Smart Itinerary Generation**: Automatically creates detailed day-by-day itineraries with specific attractions, restaurants, and activities
- **User Authentication**: Secure login with JWT and password hashing
- **Trip Management**: Create, view, and delete trips
- **Detailed Itineraries**: View complete day-by-day plans with times, locations, and descriptions

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express (Authentication, Trip Management, AI Integration)
- **AI/LLM**: Groq API (llama-3.3-70b-versatile) - Free alternative to OpenAI
- **Database**: PostgreSQL
- **Authentication**: JWT (bcrypt for password hashing)
- **Optional**: n8n (for booking workflows - not required for core functionality)

## Project Structure

```
Travel Guide/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components (Dashboard, Itinerary, etc.)
│   │   ├── services/   # API services
│   │   ├── hooks/      # Custom React hooks
│   │   ├── context/    # React context providers (Auth)
│   │   └── utils/        # Utility functions
│   └── package.json
├── backend/            # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/ # Request handlers (auth, trips, itinerary)
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth middleware
│   │   └── config/      # Database config
│   └── package.json
├── n8n/                # Optional: n8n workflow configurations
│   ├── workflows/      # Workflow JSON files (booking, calendar sync)
│   └── docker-compose.yml
├── database/           # Database schema
│   └── init.sql
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for PostgreSQL and optional n8n)
- Groq API key (free at https://console.groq.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Travel Guide"
   ```

2. **Start the database (and optional n8n)**
   ```bash
   cd n8n
   docker-compose up -d
   ```
   This starts:
   - PostgreSQL database on port 5432
   - n8n (optional) on port 5678

3. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Create .env file if it doesn't exist
   ```
   
   Edit `backend/.env` with your configuration:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=travelguide
   DB_USER=travelguide
   DB_PASSWORD=travelguide_secret
   
   # JWT
   JWT_SECRET=your-secret-key-change-this
   
   # Groq API (Free AI)
   GROQ_API_KEY=your-groq-api-key-here
   GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
   ```
   
   Start the backend:
   ```bash
   npm run dev  # Starts on http://localhost:3001
   ```

4. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev  # Starts on http://localhost:5173
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - n8n Dashboard (optional): http://localhost:5678

## Environment Variables

### Backend (.env)

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

### n8n (docker-compose.yml)

| Variable | Description | Default |
|----------|-------------|---------|
| `N8N_BASIC_AUTH_USER` | n8n admin username | admin |
| `N8N_BASIC_AUTH_PASSWORD` | n8n admin password | admin |

## Usage

1. **Sign up/Login**: Create an account or sign in
2. **Plan a Trip**: Enter a natural language description like:
   > "Plan a 4-day trip to Tokyo for 2 people. We love food, technology, and traditional culture."
3. **View Itinerary**: The AI will generate a detailed day-by-day itinerary with:
   - Specific attractions and landmarks
   - Restaurant recommendations with names
   - Activities grouped by location
   - Times, durations, and prices
4. **Manage Trips**: View all your trips on the dashboard and delete them as needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Trips
- `GET /api/trips` - Get all trips for current user
- `POST /api/trips` - Create a new trip (AI-powered parsing)
- `GET /api/trips/:id` - Get trip details
- `DELETE /api/trips/:id` - Delete a trip

### Itineraries
- `GET /api/itinerary/:tripId` - Get itinerary for a trip
- `POST /api/itinerary/generate/:tripId` - Generate itinerary (auto-triggered on trip creation)

## Architecture

### Current Architecture

```
Frontend (React) → Backend (Express) → Groq API → Database (PostgreSQL)
```

- **Frontend**: React SPA that calls backend API
- **Backend**: Handles all business logic, AI calls, database operations
- **Groq API**: Free AI service for trip parsing and itinerary generation
- **Database**: PostgreSQL for storing users, trips, and itineraries
- **n8n**: Optional, used for booking workflows (not required for core functionality)

### Why This Architecture?

- ✅ **Backend handles AI**: All AI logic in one place, easier to debug and maintain
- ✅ **Free AI**: Uses Groq API (free) instead of paid OpenAI
- ✅ **Standard REST API**: Easy to test and integrate
- ✅ **Simple**: No complex workflow automation needed for core features

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev  # Auto-reloads on changes
```

### Database

The database schema is automatically initialized when you start the PostgreSQL container via `docker-compose up`.

To connect to the database:
```bash
docker exec -it travel-guide-db psql -U travelguide -d travelguide
```

### n8n (Optional)

n8n is included for optional booking workflows (flights, hotels, activities, calendar sync). It's not required for the core trip planning functionality.

To use n8n:
1. Access http://localhost:5678
2. Import workflows from `n8n/workflows/`
3. Configure credentials as needed

## Troubleshooting

### Backend not starting
- Check that PostgreSQL is running: `docker ps`
- Verify database credentials in `backend/.env`
- Check backend logs for errors

### Frontend not connecting to backend
- Verify backend is running on port 3001
- Check browser console for CORS errors
- Ensure `VITE_API_URL` is set correctly (if using environment variables)

### Database connection errors
- Ensure Docker containers are running: `docker ps`
- Check database credentials match in `backend/.env` and `n8n/docker-compose.yml`
- Restart containers: `cd n8n && docker-compose restart`

### AI not generating itineraries
- Verify `GROQ_API_KEY` is set in `backend/.env`
- Check backend logs for API errors
- Ensure you have a valid Groq API key from https://console.groq.com

## License

MIT License
