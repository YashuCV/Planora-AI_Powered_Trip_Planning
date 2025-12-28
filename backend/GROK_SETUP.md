# Groq API Setup for Itinerary Generation

## Overview

The itinerary generation is handled by the backend, using Groq API (free alternative to OpenAI).

## Architecture

```
Frontend → Backend → Groq API → Backend → Database
```

- **Backend** handles all logic: API calls, parsing, validation, database saving
- **AI Model**: llama-3.3-70b-versatile (via Groq API)

## Setup Steps

### 1. Get Groq API Key

1. Visit: https://console.groq.com
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (starts with `gsk_`)

### 2. Configure Backend

Add to `backend/.env`:

```env
GROQ_API_KEY=your-groq-api-key-here
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
```

### 3. Restart Backend

```bash
cd backend
npm run dev
```

## API Endpoint

**POST** `/api/itinerary/generate/:tripId`

- Requires authentication (JWT token)
- Automatically generates itinerary using Groq API
- Saves to database
- Returns the generated itinerary

## Benefits

✅ **Free API**: Groq API is free (vs paid OpenAI)
✅ **Better Control**: All logic in backend, easier to debug
✅ **Better Error Handling**: Centralized in backend
✅ **Easier Testing**: Can test backend independently
✅ **Fast Responses**: Groq provides fast inference

## Troubleshooting

### "Groq API key not configured"
- Check that `GROQ_API_KEY` is set in `backend/.env`
- Restart the backend server after adding the key

### "Invalid Groq API key"
- Verify your API key is correct (should start with `gsk_`)
- Check that the key is active in your Groq console account

### "Failed to generate itinerary"
- Check backend logs for detailed error messages
- Verify Groq API is accessible
- Check that trip data is correct
- Ensure you're using the correct model name: `llama-3.3-70b-versatile`

