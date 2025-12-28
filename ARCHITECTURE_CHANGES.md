# Architecture Restructure - Grok API Migration

## Summary

Moved itinerary generation from n8n (GPT-4) to backend (Grok API) to:
- Use free Grok API instead of paid OpenAI
- Centralize business logic in backend
- Simplify n8n to only handle AI tools
- Better error handling and debugging

## What Changed

### Backend (Node.js/Express)
✅ **NEW**: `generateItinerary` controller with Grok API integration
✅ **NEW**: `POST /api/itinerary/generate/:tripId` endpoint
✅ Handles: API calls, JSON parsing, validation, database saving
✅ Uses: Grok API (free) instead of OpenAI (paid)

### N8N Workflows
✅ **UPDATED**: `trip-request-handler.json` now calls backend API
✅ **REMOVED**: Direct itinerary generation from n8n
✅ **KEPT**: Trip request parsing (can be moved to backend later)

### Frontend
✅ No changes needed - still calls n8n for trip creation
✅ n8n automatically triggers backend for itinerary generation

## Setup Instructions

1. **Get Grok API Key**
   - Visit: https://x.ai/api
   - Sign up and get API key

2. **Configure Backend**
   ```bash
   # Add to backend/.env
   GROK_API_KEY=your-api-key-here
   GROK_API_URL=https://api.x.ai/v1/chat/completions
   ```

3. **Update n8n Workflow**
   - Delete current "Trip Request Handler" workflow
   - Import: `n8n/workflows/trip-request-handler.json`
   - Activate and Publish

4. **Restart Backend**
   ```bash
   cd backend
   npm run dev
   ```

## API Flow

```
User → Frontend → n8n (trip parsing) → Backend (save trip)
                                    ↓
                              Backend (Grok API) → Generate Itinerary
                                    ↓
                              Backend (save to DB) → Return to Frontend
```

## Benefits

- ✅ Free API (Grok vs paid OpenAI)
- ✅ Better control (all logic in backend)
- ✅ Easier debugging (centralized logs)
- ✅ Simpler n8n (only AI tools)
- ✅ Better error handling

## Files Modified

- `backend/src/controllers/itineraryController.js` - Added Grok integration
- `backend/src/routes/itineraryRoutes.js` - Added generate route
- `n8n/workflows/trip-request-handler.json` - Updated to call backend
- `backend/package.json` - Added axios dependency
