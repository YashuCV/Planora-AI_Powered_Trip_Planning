# 🚀 Next Steps: Setting Up n8n Workflows

## ✅ What's Already Done

- ✅ **Backend Authentication**: Register/Login working perfectly
- ✅ **Database**: PostgreSQL connected and working
- ✅ **Frontend**: React app running on http://localhost:5173
- ✅ **n8n**: Running on http://localhost:5678

## 📋 What You Need to Do Next

### Step 1: Import n8n Workflows (Priority Order)

Since authentication is now in the backend, you need to import workflows for **AI-powered trip planning**. Here's what to import:

#### **Priority 1: Core Trip Planning** ⭐ START HERE

1. **`trip-request-handler.json`** ⭐ **MOST IMPORTANT**
   - **What it does**: Main entry point for trip planning
   - **Webhook**: `/webhook/trip-request`
   - **Status**: ✅ **UPDATED** - Now extracts user ID from JWT token
   - **How to import**:
     1. Go to http://localhost:5678
     2. Click **"Workflows"** → **"Import from File"**
     3. Select `n8n/workflows/trip-request-handler.json`
     4. Click **"Import"**

2. **`itinerary-generator.json`**
   - **What it does**: Creates detailed day-by-day itineraries using AI
   - **Webhook**: `/webhook/generate-itinerary`
   - **How to import**: Same process as above

3. **`trips-crud.json`**
   - **What it does**: Get/Update/Delete trips
   - **Webhooks**: `/webhook/trips`, `/webhook/trips/:id`
   - **Status**: ✅ Already has JWT token extraction

#### **Priority 2: Discovery & Booking** (Import Later)

4. `place-browser.json` - Search for places
5. `flight-booking.json` - Search flights
6. `hotel-booking.json` - Search hotels
7. `activity-booking.json` - Search activities
8. `booking-orchestrator.json` - Coordinate bookings
9. `calendar-sync.json` - Sync to Google Calendar

### Step 2: Configure Credentials in n8n

For each workflow, ensure these credentials exist:

#### ✅ PostgreSQL Credentials
- **Name**: "Travel Guide DB"
- **Host**: `travel-guide-db` (or `localhost` if connecting from host)
- **Port**: `5432`
- **Database**: `travelguide`
- **User**: `travelguide`
- **Password**: `travelguide_secret`

#### ✅ OpenAI Credentials
- **Name**: "OpenAI API" or "Travel Guide"
- **API Key**: Your OpenAI API key
- **Model**: `gpt-4o-mini` (recommended for cost)

### Step 3: Activate Workflows

After importing each workflow:

1. Open the workflow
2. Click the **"Active"** toggle (top right) to activate
3. Click **"Save"**
4. Click **"Publish"** (if available)

### Step 4: Test Trip Planning

1. **Login** to frontend: http://localhost:5173/login
2. **Go to Trip Planner**: http://localhost:5173/planner
3. **Enter a trip request**, e.g.:
   > "Plan a 5-day trip to Tokyo for 2 people in March. We love food and technology!"
4. **Click "Plan Trip"**
5. **Check n8n Executions** to see if workflow ran successfully

## 🔧 Important Notes

### ✅ What Changed

- **Authentication**: Moved from n8n to Express backend
- **User ID**: Workflows now extract `userId` from JWT token in Authorization header
- **Database**: All workflows use same PostgreSQL database

### ⚠️ What You Can Delete

- **`auth.json` workflow**: No longer needed - authentication is in backend

### 📝 Workflow Updates Made

- ✅ **trip-request-handler.json**: Updated to extract `userId` from JWT token
- ✅ **trips-crud.json**: Already has JWT token extraction

## 🧪 Testing Checklist

- [ ] Import `trip-request-handler.json`
- [ ] Configure PostgreSQL credentials
- [ ] Configure OpenAI credentials
- [ ] Activate workflow
- [ ] Test trip planning from frontend
- [ ] Check database for saved trips
- [ ] Import `itinerary-generator.json`
- [ ] Test itinerary generation
- [ ] Import `trips-crud.json`
- [ ] Test getting trips list

## 🚨 Troubleshooting

### Issue: "Authentication required" error
**Solution**: Make sure you're logged in and the JWT token is being sent in the Authorization header

### Issue: "User not found" in database
**Solution**: Check that `userId` is being extracted correctly from JWT token

### Issue: OpenAI API errors
**Solution**: 
- Check API key is correct
- Ensure you have credits
- Verify model name (use `gpt-4o-mini`)

### Issue: Database connection fails
**Solution**: 
- Use `travel-guide-db` as hostname (not `localhost`) when connecting from n8n container
- Verify credentials match docker-compose.yml

## 📚 Detailed Setup Guide

See `n8n/SETUP_GUIDE.md` for complete instructions on all workflows.

## ✅ Success Criteria

You'll know everything is working when:
1. ✅ You can create a trip from the frontend
2. ✅ Trip is saved to database with your `user_id`
3. ✅ AI generates a response about the trip
4. ✅ Itinerary is generated automatically
5. ✅ You can see your trips in the dashboard

---

**Ready to start?** Import `trip-request-handler.json` first! 🚀


