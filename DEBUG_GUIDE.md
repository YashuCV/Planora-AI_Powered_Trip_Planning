# Debug Guide - How to Check Logs on Mac

## 🔍 Method 1: Check Backend Terminal Logs

### Option A: View Live Logs (Recommended)
1. **Open Terminal**
   - Press `Cmd + Space` to open Spotlight
   - Type "Terminal" and press Enter
   - OR go to: Applications > Utilities > Terminal

2. **View Live Backend Logs**
   ```bash
   tail -f /tmp/backend.log
   ```
   - This shows **live** backend logs (updates in real-time)
   - Press `Ctrl + C` to stop

3. **What to Look For:**
   - ❌ Red error messages
   - ⚠️ Warning messages
   - ✅ Success messages
   - Look for: "Error", "Failed", "Cannot", "undefined"

### Option B: View Last 50 Lines
```bash
tail -50 /tmp/backend.log
```

### Option C: View All Logs
```bash
cat /tmp/backend.log
```

### Option D: Search for Errors
```bash
grep -i "error\|fail\|exception" /tmp/backend.log
```

### Option E: If Backend is Running in Another Terminal
1. Find the terminal window where you ran `npm run dev`
2. Look for error messages (usually in red)
3. Scroll up to see previous errors

---

## 🌐 Method 2: Check Browser Network Tab

### Step-by-Step Instructions:

#### 1. Open Developer Tools
**Chrome/Edge:**
- Press `Cmd + Option + I`
- OR right-click page → "Inspect"
- OR View menu → Developer → Developer Tools

**Safari:**
- First enable Developer menu:
  - Safari menu → Preferences → Advanced
  - Check "Show Develop menu in menu bar"
- Then press `Cmd + Option + C`
- OR Develop menu → Show Web Inspector

**Firefox:**
- Press `Cmd + Option + I`
- OR Tools menu → Web Developer → Web Console

#### 2. Open Network Tab
1. In Developer Tools, click the **"Network"** tab
2. You should see a list of network requests

#### 3. Clear Previous Requests (Optional)
- Click the 🚫 (clear) button to start fresh

#### 4. Reproduce the Error
1. Go back to your app
2. Try creating a trip
3. Watch the Network tab fill with requests

#### 5. Find Failed Requests
- Look for requests in **RED** (these failed)
- Look for status codes:
  - `4xx` = Client error (bad request, not found, etc.)
  - `5xx` = Server error (backend crashed, etc.)
  - `200` = Success (green)

#### 6. Inspect Failed Requests
1. Click on a **red/failed** request
2. Look at these tabs:
   - **Headers**: Request/response headers
   - **Payload**: What data was sent
   - **Response**: What the server returned
   - **Preview**: Formatted response

#### 7. Check Console Tab Too
1. Click the **"Console"** tab
2. Look for red error messages
3. These show JavaScript errors

---

## 📋 What to Look For

### In Backend Logs:
- ❌ `Error: ...`
- ❌ `Failed to ...`
- ❌ `Cannot ...`
- ❌ `undefined`
- ❌ `TypeError`
- ❌ `ReferenceError`
- ⚠️ `Warning: ...`

### In Network Tab:
- ❌ Status: `400`, `401`, `404`, `500`, `502`, `503`
- ❌ Failed requests (red)
- ❌ CORS errors
- ❌ Timeout errors

### In Console Tab:
- ❌ Red error messages
- ❌ `Failed to fetch`
- ❌ `NetworkError`
- ❌ `TypeError`

---

## 🛠️ Quick Commands Reference

### Check if Backend is Running:
```bash
curl http://localhost:3001/health
```

### Check Backend Process:
```bash
ps aux | grep "node.*server.js"
```

### Kill Backend Process:
```bash
lsof -ti:3001 | xargs kill -9
```

### Restart Backend:
```bash
cd "/Users/osuappcenter/Desktop/CV/Travel Guide/backend"
npm run dev
```

### View Backend Logs:
```bash
tail -f /tmp/backend.log
```



## 🆘 Common Issues

### "Cannot connect to backend"
- Check if backend is running: `curl http://localhost:3001/health`
- Check backend logs for errors
- Make sure port 3001 is not blocked

### "CORS error"
- Backend needs to allow frontend origin
- Check backend CORS configuration

### "404 Not Found"
- Check if the API endpoint exists
- Check if the route is correct

### "500 Internal Server Error"
- Check backend logs for detailed error
- Usually means backend code crashed

### "401 Unauthorized"
- Check if JWT token is being sent
- Check if token is valid/expired

---


