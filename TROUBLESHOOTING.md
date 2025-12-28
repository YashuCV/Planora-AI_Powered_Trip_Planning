# 🔧 Troubleshooting: n8n Webhook Not Triggering

## 🚨 Problem: "Waiting for you to call the Test URL"

This means the n8n workflow webhook is **not receiving requests** from the frontend.

## ✅ Step-by-Step Fix

### Step 1: Check if Workflow is Activated

1. Go to http://localhost:5678
2. Open the **"Trip Request Handler"** workflow
3. Check the **"Active"** toggle (top right) - it should be **ON** (green)
4. If OFF, toggle it ON and click **"Save"**
5. Click **"Publish"** (if available)

### Step 2: Verify Webhook URL

The webhook should be at:
```
http://localhost:5678/webhook/trip-request
```

**Check in n8n:**
1. Click on the **"Trip Request Webhook"** node
2. Look at the **"Path"** field - should be `trip-request`
3. The full URL will be shown below: `http://localhost:5678/webhook/trip-request`

### Step 3: Test Webhook Directly

Open browser console (F12) and run:

```javascript
fetch('http://localhost:5678/webhook/trip-request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    request: 'Plan a trip to Las Vegas for 3 days',
    preferences: { travelersCount: 2 }
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Expected:** Should see response from n8n workflow
**If error:** Check n8n workflow is activated

### Step 4: Check Frontend Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try creating a trip
4. Look for errors (red text)

**Common errors:**
- `Failed to fetch` → n8n not running or workflow not activated
- `404 Not Found` → Wrong webhook path
- `CORS error` → n8n CORS settings

### Step 5: Check n8n Executions

1. Go to http://localhost:5678
2. Click **"Executions"** (left sidebar)
3. Try creating a trip from frontend
4. Check if a new execution appears

**If no execution appears:**
- Workflow is not activated
- Webhook URL is wrong
- Request is not reaching n8n

**If execution appears but shows error:**
- Check the execution details
- Look at which node failed
- Fix the error in that node

## 🔍 Common Issues

### Issue 1: Workflow Not Activated

**Symptoms:**
- "Waiting for you to call the Test URL" message
- No executions in n8n

**Fix:**
1. Open workflow in n8n
2. Toggle **"Active"** to ON
3. Click **"Save"**
4. Click **"Publish"**

### Issue 2: Wrong Webhook Path

**Symptoms:**
- 404 error in browser console
- "Webhook not found" error

**Fix:**
1. Check webhook node path is `trip-request`
2. Full URL should be: `http://localhost:5678/webhook/trip-request`
3. Frontend should call: `${N8N_WEBHOOK_URL}/trip-request`

### Issue 3: CORS Error

**Symptoms:**
- Browser console shows CORS error
- Request blocked by browser

**Fix:**
1. In n8n, go to **Settings** → **Security**
2. Enable CORS for localhost
3. Or add `http://localhost:5173` to allowed origins

### Issue 4: Frontend Showing Demo Data

**Symptoms:**
- Frontend shows static/demo data
- No real API response

**Fix:**
1. Check browser console for errors
2. The catch block is showing demo data when API fails
3. Fix the API call (see steps above)

## 🧪 Quick Test

Run this in terminal to test webhook:

```bash
curl -X POST http://localhost:5678/webhook/trip-request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "request": "Plan a trip to Las Vegas for 3 days",
    "preferences": {"travelersCount": 2}
  }'
```

**Expected:** JSON response from workflow
**If 404:** Workflow not activated or wrong path
**If error:** Check workflow node errors

## ✅ Verification Checklist

- [ ] n8n is running on http://localhost:5678
- [ ] Workflow is imported
- [ ] Workflow is **ACTIVATED** (green toggle)
- [ ] Workflow is **PUBLISHED**
- [ ] Webhook path is `trip-request`
- [ ] Frontend calls correct URL: `http://localhost:5678/webhook/trip-request`
- [ ] JWT token is being sent in Authorization header
- [ ] Browser console shows no errors
- [ ] n8n Executions shows new execution when testing

## 🎯 Most Common Fix

**90% of the time, the issue is:**
1. Workflow is not **ACTIVATED** in n8n
2. Solution: Toggle "Active" to ON → Save → Publish

Try this first!


