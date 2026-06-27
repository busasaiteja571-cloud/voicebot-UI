# Vercel Deployment Checklist

## Frontend (voicebot-UI) Deployment

### ✅ Pre-Deployment Verification

- [x] Build compiles successfully without TS2591 error
- [x] No `process.env` references in compiled output
- [x] `@types/node` installed in package.json
- [x] `tsconfig.app.json` includes `"types": ["node"]`
- [x] `set-env.js` script created and tested
- [x] `package.json` includes `"prebuild": "node set-env.js production"`
- [x] Environment files are properly configured
- [x] `angular.json` has fileReplacements for production build
- [x] Git history cleaned (no secrets)
- [x] `.gitignore` properly configured
- [x] Changes committed and pushed to GitHub

### 🚀 Vercel Frontend Setup

**Via Vercel Dashboard:**

1. **Connect Repository**
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose `voicebot-UI` repository
   - Click "Import"

2. **Configure Build Settings**
   - **Framework:** Angular (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/voicebot-ui/browser`
   - **Install Command:** `npm install`

3. **Set Environment Variables**
   - Go to Project Settings → **Environment Variables**
   - Add variable:
     ```
     Name: API_BASE_URL
     Value: https://voicebot-server-[YOUR-BACKEND-ID].vercel.app/api
     Scopes: Production, Preview, Development (select all)
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Vercel will automatically:
     - `npm install` → Install dependencies
     - `npm run build` → Runs prebuild hook (injects env) + Angular build
     - Deploy to Vercel CDN

5. **Verify**
   - ✅ Deployment succeeds
   - ✅ Site is accessible at `voicebot-ui-[ID].vercel.app`
   - ✅ DevTools Network tab shows API requests going to backend

### 📝 Production URL

**Frontend:** `https://voicebot-ui-[ID].vercel.app`

---

## Backend (voicebot-server) Deployment

### ✅ Pre-Deployment Verification

- [x] No hardcoded API keys in source code
- [x] `GeminiService.java` uses `@Value` for environment injection
- [x] `application.properties` uses `${GEMINI_API_KEY:placeholder}`
- [x] `vercel.json` configured for Java 21 serverless
- [x] `.gitignore` includes Maven build artifacts
- [x] `pom.xml` configured for Spring Boot
- [x] Git history cleaned
- [x] Changes committed and pushed to GitHub

### 🚀 Vercel Backend Setup

**Via Vercel Dashboard:**

1. **Connect Repository**
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose `voicebot-server` repository
   - Click "Import"

2. **Vercel Auto-Configuration**
   - Vercel auto-detects `vercel.json`
   - **Framework:** Spring Boot (java21)
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Runtime:** Java 21
   - No manual build settings needed

3. **Set Environment Variables**
   - Go to Project Settings → **Environment Variables**
   - Add variable:
     ```
     Name: GEMINI_API_KEY
     Value: [your-actual-gemini-api-key]
     Scopes: Production (SELECT ONLY PRODUCTION for security)
     ```
   - Note: Keep API key only in Production scope
   - Preview and Development will use placeholder value

4. **Configure Serverless Functions**
   - Vercel auto-configures from `vercel.json`:
     ```json
     {
       "framework": "spring-boot",
       "runtime": "java21",
       "functions": {
         "api/**": {
           "runtime": "java21",
           "memory": 512,
           "maxDuration": 30
         }
       }
     }
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build (first build 3-5 minutes, includes Maven build)
   - Vercel will:
     - Build Spring Boot JAR with Maven
     - Create serverless functions from Spring Boot endpoints
     - Deploy to Vercel serverless infrastructure

6. **Verify**
   - ✅ Deployment succeeds
   - ✅ Site is accessible at `voicebot-server-[ID].vercel.app`
   - ✅ `/api/chat` endpoint responds to POST requests

### 📝 Production URL

**Backend:** `https://voicebot-server-[ID].vercel.app`

---

## Cross-Service Configuration

### Step 1: Get Deployed URLs

After both deployments complete:

- **Frontend URL:** `https://voicebot-ui-[ID].vercel.app`
- **Backend URL:** `https://voicebot-server-[ID].vercel.app`

### Step 2: Update Frontend Environment Variable

**Vercel Dashboard → voicebot-UI Project:**

1. Go to Settings → **Environment Variables**
2. Edit `API_BASE_URL`:
   - **Old Value:** `https://voicebot-server-xyz.vercel.app/api` (example)
   - **New Value:** `https://voicebot-server-[YOUR-ID].vercel.app/api` (your actual backend)
3. Click "Save"
4. Go to **Deployments** and click "Redeploy" to rebuild with new API URL

Or let a new git push trigger automatic redeploy:
```bash
cd voicebot-ui
npm run build  # Verify locally
git add .
git commit -m "chore: Update backend API URL for production"
git push origin main
```

### Step 3: Update Backend CORS

**File: voicebot-server/src/main/java/.../config/WebConfig.java**

Update the CORS configuration:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:4200",  // Local development
                "https://voicebot-ui-[YOUR-ID].vercel.app"  // Production
            )
            .allowedMethods("GET", "POST", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

Then:

```bash
cd voicebot-server
git add src/main/java/.../config/WebConfig.java
git commit -m "fix: Update CORS for production Vercel domain"
git push origin main
```

Vercel will auto-redeploy.

---

## Testing End-to-End

### 1. Test Backend API Directly

```bash
# Get chat response from backend
curl -X POST "https://voicebot-server-[ID].vercel.app/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'

# Expected response:
# {
#   "reply": "[AI response from Gemini]"
# }
```

### 2. Test Frontend UI

1. Open `https://voicebot-ui-[ID].vercel.app` in browser
2. Open DevTools → Network tab
3. Type a message in the chat UI
4. Verify:
   - ✅ POST request to `/api/chat` endpoint
   - ✅ Request goes to backend URL (from API_BASE_URL)
   - ✅ Response received and displayed in UI
   - ✅ No CORS errors in browser console

### 3. Test Environment Variables

**Frontend:**
- Open DevTools → Console
- Type: `fetch('/config').then(r => r.json())`
- Verify API endpoint is production URL (not localhost)

**Backend:**
- Check logs for environment variable loading
- Can verify via API response headers or health endpoint

---

## Troubleshooting

### Frontend Build Fails on Vercel

**Issue:** Build log shows TS2591 or other TypeScript errors

**Solution:**
1. Verify `prebuild` hook is in package.json
2. Check `set-env.js` is in root directory
3. Verify `@types/node` is installed
4. Run locally: `npm run build`
5. Push to GitHub to trigger Vercel rebuild

### Frontend Fails to Connect to Backend

**Issue:** Network errors, CORS errors, or 404 responses

**Solution:**
1. Verify backend is deployed and accessible
2. Check API_BASE_URL in Vercel environment variables
3. Verify backend CORS includes frontend domain
4. Check browser DevTools Network tab for actual API URL being called
5. Curl test backend manually

### Backend Returns 500 Errors

**Issue:** Backend is failing or crashing

**Solution:**
1. Check Vercel Function logs
2. Verify GEMINI_API_KEY is set in Vercel (Production scope)
3. Verify API key is valid and not expired
4. Check for rate limits from Gemini API
5. Review application logs for specific errors

### Vercel Deployment Hangs

**Issue:** Deployment taking too long or timing out

**Solution:**
1. **Frontend:** Usually 2-3 minutes, check npm logs
2. **Backend:** First build 3-5 minutes (Maven compile), subsequent builds faster
3. If timeout:
   - Check Vercel Function timeout settings (30s default)
   - Optimize Spring Boot startup time
   - Consider increasing function memory allocation

---

## Monitoring & Maintenance

### 1. Monitor Deployments

- **Vercel Dashboard:** View all deployments, logs, and performance metrics
- **GitHub Actions:** Can integrate for automated testing before deploy

### 2. Monitor Performance

- **Vercel Analytics:** Check page load times, CLS, LCP metrics
- **Backend Logs:** Monitor API response times and error rates
- **Gemini API:** Monitor quota usage and costs

### 3. Rollback Plan

If deployment breaks:

```bash
# Frontend
cd voicebot-ui
git log --oneline  # Find previous commit
git reset --hard [commit-hash]
git push origin main -f  # Force push (Vercel auto-redeploys)

# Backend
cd voicebot-server
git log --oneline
git reset --hard [commit-hash]
git push origin main -f
```

---

## Cost Optimization

### Frontend (voicebot-UI)

- **Vercel:** Free tier includes 100 GB bandwidth/month
- **Build time:** ~2-3 minutes per deployment
- **Recommendations:**
  - Compress images
  - Enable gzip compression
  - Use lazy loading

### Backend (voicebot-server)

- **Vercel:** Serverless functions billed by execution (generous free tier)
- **Cold start:** ~1-2 seconds on first request (Java)
- **Recommendations:**
  - Limit function memory to 512MB
  - Use connection pooling for database (if added)
  - Cache Gemini API responses
  - Monitor request duration

### API Costs

- **Gemini API:** Billed per request
  - Consider rate limiting
  - Implement request caching
  - Monitor usage in console

---

## Next Steps After Deployment

1. ✅ Share production URLs with users
2. ✅ Set up monitoring and alerting
3. ✅ Create deployment documentation for team
4. ✅ Plan for database (if needed)
5. ✅ Implement API authentication (if needed)
6. ✅ Add usage analytics
7. ✅ Schedule regular security updates
8. ✅ Set up CI/CD for automated deployments

---

## Quick Reference

| Component | URL | Environment Variables | Runtime |
|-----------|-----|----------------------|---------|
| Frontend | `voicebot-ui-[ID].vercel.app` | `API_BASE_URL` | Node.js 18+ |
| Backend | `voicebot-server-[ID].vercel.app` | `GEMINI_API_KEY` | Java 21 |
| API Endpoint | `/api/chat` | Both services | POST |

---

**Deployment Date:** [Date of deployment]  
**Deployed By:** [Your name]  
**Frontend Commit:** 99b192c (Build-time environment injection)  
**Backend Commit:** [Your backend commit hash]  
**Status:** ✅ Ready for Production

