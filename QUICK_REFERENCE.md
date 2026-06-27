# Quick Reference: Vercel Deployment Steps

## 🚀 Frontend (voicebot-UI) - 5 Minutes

### 1. Vercel Setup
```
1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose: busasaiteja571-cloud/voicebot-UI
5. Click "Import"
```

### 2. Configure Environment (Settings → Environment Variables)
```
Name: API_BASE_URL
Value: https://voicebot-server-[BACKEND-ID].vercel.app/api
Scopes: Production, Preview, Development
```

### 3. Deploy
```
Click "Deploy"
Wait 2-3 minutes...
✅ Vercel URL: https://voicebot-ui-[ID].vercel.app
```

---

## 🚀 Backend (voicebot-server) - 5 Minutes

### 1. Vercel Setup
```
1. Go to https://vercel.com
2. Click "New Project"
3. Click "Import Git Repository"
4. Choose: busasaiteja571-cloud/voicebot-server
5. Click "Import"
```

### 2. Configure Environment (Settings → Environment Variables)
```
Name: GEMINI_API_KEY
Value: [your-actual-api-key]
Scopes: Production ONLY (for security)
```

### 3. Deploy
```
Click "Deploy"
Wait 3-5 minutes (first build is slower)...
✅ Vercel URL: https://voicebot-server-[ID].vercel.app
```

---

## 🔗 Connect Services

### Update Frontend API URL (if not set correctly)

**In Vercel Dashboard:**
1. Go to voicebot-UI project
2. Settings → Environment Variables
3. Edit `API_BASE_URL`
4. Set to: `https://voicebot-server-[YOUR-ID].vercel.app/api`
5. Go to Deployments → Click latest → "Redeploy" button

**OR push new commit to auto-redeploy:**
```bash
cd voicebot-ui
git add .
git commit -m "chore: Update API URL"
git push origin main
```

### Update Backend CORS

**File: voicebot-server/src/main/java/.../config/WebConfig.java**

Update `allowedOrigins`:
```java
.allowedOrigins(
    "http://localhost:4200",
    "https://voicebot-ui-[YOUR-ID].vercel.app"
)
```

Then:
```bash
cd voicebot-server
git add .
git commit -m "fix: Update CORS for Vercel domain"
git push origin main
```

Vercel auto-redeploys.

---

## ✅ Verify It Works

### 1. Test Backend API
```bash
curl -X POST "https://voicebot-server-[ID].vercel.app/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi"}'

Expected: { "reply": "[AI response]" }
```

### 2. Test Frontend
- Open: `https://voicebot-ui-[ID].vercel.app`
- Type message in chat
- DevTools → Network tab → Verify POST to `/api/chat`
- Response should appear in chat UI

---

## 📊 Environment Variables Used

| Variable | Where | Value | Example |
|----------|-------|-------|---------|
| `API_BASE_URL` | Frontend (Vercel) | Backend URL with /api | `https://voicebot-server-xyz.vercel.app/api` |
| `GEMINI_API_KEY` | Backend (Vercel) | Google Gemini API key | `sk-1234567890abcdefghij` |

---

## 🔍 Troubleshooting

### Build Fails: "Cannot find name 'process'"
- ✅ Already fixed in this version
- If still issues: Check `tsconfig.app.json` has `"types": ["node"]`

### Frontend Shows 404 or Network Errors
- Verify backend is deployed
- Check `API_BASE_URL` in Vercel env vars
- Run locally to test: `npm start` (should work with localhost)

### Backend Returns 500 Errors
- Check `GEMINI_API_KEY` is set in Vercel (Production scope)
- Verify API key is valid
- Check Vercel Function logs for errors

### CORS Errors in Browser
- Backend CORS must include frontend domain
- Update WebConfig.java with frontend URL
- Redeploy backend

---

## 📱 Local Development

### Frontend (Development)
```bash
cd voicebot-ui
npm install
npm start
# Runs on: http://localhost:4200
# Connects to: http://localhost:8080/api
```

### Backend (Development)
```bash
cd voicebot-service
./mvnw spring-boot:run
# Runs on: http://localhost:8080
```

---

## 🆚 Environment Comparison

| Aspect | Development | Production |
|--------|-------------|-----------|
| Frontend Port | 4200 | Vercel CDN |
| Backend Port | 8080 | Vercel Serverless |
| Frontend URL | `http://localhost:4200` | `https://voicebot-ui-[ID].vercel.app` |
| Backend URL | `http://localhost:8080` | `https://voicebot-server-[ID].vercel.app` |
| API Endpoint | `/api/chat` | `/api/chat` |
| API_BASE_URL | `http://localhost:8080/api` | `https://voicebot-server-[ID].vercel.app/api` |
| GEMINI_API_KEY | `your-api-key-here` (default) | `[actual-key]` (from Vercel) |

---

## 🎯 Deployment Flow (One-Time Setup)

```
Local Development ✓
    ↓
Test with npm start/npm run build ✓
    ↓
Git push to GitHub ✓
    ↓
Vercel Dashboard → New Project ✓
    ↓
Select GitHub repo ✓
    ↓
Set environment variables ✓
    ↓
Click Deploy ✓
    ↓
Wait for build completion ✓
    ↓
Get Vercel URLs ✓
    ↓
Update cross-service config ✓
    ↓
Test end-to-end ✓
    ↓
PRODUCTION LIVE! 🚀
```

---

## 📝 Important Notes

- **set-env.js:** Automatically runs via `prebuild` hook before build
- **No Manual Steps Needed:** Just push to GitHub, Vercel auto-builds
- **Environment Injection:** Happens at build time, values hardcoded in JavaScript
- **Cold Start:** Backend may be slow first request (Java cold start ~1-2s)
- **Costs:** Free tier covers most use cases

---

**Version:** 1.0  
**Last Updated:** 2026-06-27  
**Status:** ✅ Production Ready
