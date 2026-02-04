# Debug Guide – Checking Logs and Errors (Mac)

## 1. Backend logs

The backend prints to the **terminal** where you run it.

- **Live output:** Run `npm run dev` in `backend/` and watch that terminal.
- **No log file by default:** If you want a file, run:
  ```bash
  cd backend && npm run dev > /tmp/backend.log 2>&1
  ```
  Then: `tail -f /tmp/backend.log` for live logs, or `tail -50 /tmp/backend.log` for the last 50 lines.

**Look for:** `Error`, `Failed`, `Cannot`, `undefined`, `TypeError`, `ReferenceError`, and any stack traces.

---

## 2. Browser: Network and Console

### Open DevTools
- **Chrome/Edge:** `Cmd + Option + I` or right‑click → Inspect
- **Safari:** Enable Develop menu (Preferences → Advanced), then `Cmd + Option + C`
- **Firefox:** `Cmd + Option + I`

### Network tab
1. Open the **Network** tab.
2. Clear existing requests (clear button) if you want a clean view.
3. Reproduce the issue (e.g. create a trip, open itinerary).
4. Check for **failed** requests (red or 4xx/5xx).
5. Click a failed request and check **Headers**, **Payload**, **Response**, **Preview**.

### Console tab
- Switch to **Console** and look for red errors (e.g. `Failed to fetch`, `NetworkError`, `TypeError`).

---

## 3. What to look for

| Where        | Signs of problems                                      |
|-------------|---------------------------------------------------------|
| Backend log | `Error`, `Failed`, `Cannot`, `undefined`, `TypeError`   |
| Network     | Status 400, 401, 404, 500; CORS errors; timeouts        |
| Console     | Red errors, `Failed to fetch`, `NetworkError`           |

---

## 4. Useful commands

| Task              | Command |
|-------------------|--------|
| Backend running?  | `curl http://localhost:3001/health` |
| Backend process   | `ps aux \| grep "node.*server.js"`  |
| Kill backend      | `lsof -ti:3001 \| xargs kill -9`    |
| Restart backend   | `cd backend && npm run dev`         |

Use the path to your project, e.g.  
`cd "/Users/osuappcenter/Desktop/CV/Projects/Planora - AI Powered Trip Planning/backend"`  
if you are not already in the project directory.

---

## 5. Common issues

| Symptom                    | What to check |
|---------------------------|----------------|
| Can’t connect to backend  | Backend running? `curl http://localhost:3001/health`. Port 3001 free? |
| CORS error                | Backend CORS allows frontend origin (e.g. http://localhost:5173). |
| 404                       | Correct URL and HTTP method for the API route. |
| 500                       | Backend logs for stack trace and error message. |
| 401 Unauthorized          | Valid JWT sent in `Authorization` header; token not expired. |
