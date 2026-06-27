# Voice Bot Assistant - Frontend UI

A modern, responsive Angular-based web client for the Voice Bot Assistant application. This frontend provides an intuitive interface for voice-based conversations with AI-powered responses.

## 🎯 Features

- **Modern Angular 22 Architecture** - Latest Angular framework with standalone components
- **Real-time Chat Interface** - Seamless conversation UI with message threading
- **Voice Input Support** - Integration-ready for Web Speech API
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **TypeScript Best Practices** - Fully typed for enhanced developer experience
- **Production Optimized** - Bundled and optimized for minimal load times
- **Environment-Based Configuration** - Easy switching between dev and production APIs

## 🚀 Quick Start

### Prerequisites

- **Node.js:** v20 or higher
- **npm:** v11 or higher
- **Backend Service:** Running on `http://localhost:8080` (local development)

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:4200
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Output directory: dist/voicebot-ui/browser/
```

## 📁 Project Structure

```
voicebot-ui/
├── src/
│   ├── main.ts                           # Angular bootstrap
│   ├── app.ts                            # Root component
│   ├── app.html                          # Root template
│   ├── app.routes.ts                     # Route configuration
│   ├── app.config.ts                     # App configuration
│   ├── styles.css                        # Global styles
│   ├── index.html                        # HTML entry point
│   ├── app/
│   │   ├── components/
│   │   │   └── voice-bot/                # Voice bot chat component
│   │   │       ├── voice-bot.ts
│   │   │       ├── voice-bot.html
│   │   │       ├── voice-bot.css
│   │   │       └── voice-bot.spec.ts
│   │   └── services/
│   │       └── voice.ts                  # API service for backend communication
│   └── environments/
│       ├── environment.ts                # Development environment
│       └── environment.prod.ts           # Production environment
├── public/                               # Static assets
├── angular.json                          # Angular CLI configuration
├── tsconfig.json                         # TypeScript configuration
├── package.json                          # Dependencies
└── README.md                             # This file
```

## 🔌 API Integration

The frontend communicates with the backend API through the `VoiceService`.

### Environment Configuration

**Development** (`environment.ts`):
```typescript
apiBaseUrl: 'http://localhost:8080/api'
```

**Production** (`environment.prod.ts`):
```typescript
apiBaseUrl: process.env['API_BASE_URL'] || '/api'
```

### Chat Endpoint

```typescript
// Send message to backend
this.voiceService.sendMessage('Hello!').subscribe(
  response => console.log(response),
  error => console.error(error)
);
```

**Expected Response:**
```json
{
  "response": "Hello! I'm here to assist you.",
  "timestamp": "2026-06-27T12:30:45Z",
  "status": "success"
}
```

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Framework: **Angular**
   - Build Command: `npm run build`
   - Output Directory: `dist/voicebot-ui/browser`

3. **Set Environment Variables** in Vercel Dashboard:
   ```
   API_BASE_URL = https://your-backend-api.onrender.com/api
   ```

4. **Deploy**
   - Automatic deployment on push to main branch

### Other Deployment Options

**Netlify:**
```bash
npm run build
# Deploy dist/voicebot-ui/browser/ folder
```

**AWS S3 + CloudFront:**
```bash
npm run build
# Upload dist/voicebot-ui/browser/ to S3 bucket
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Coverage Report
```bash
npm test -- --coverage
```

### E2E Tests
```bash
npm run e2e
```

## 🎨 Component Architecture

### VoiceBotComponent
Main chat component handling:
- Message input and display
- Real-time API communication
- Error handling and user feedback
- Message history management

### VoiceService
Service layer providing:
- HTTP communication with backend
- Error handling
- Response transformation
- Environment-based URL management

## 📦 Dependencies

**Core:**
- `@angular/core` - Angular framework
- `@angular/common` - Common utilities
- `@angular/forms` - Form handling
- `@angular/platform-browser` - Browser utilities
- `rxjs` - Reactive programming

**Development:**
- `@angular/cli` - Development tools
- `typescript` - Language support
- `vitest` - Testing framework
- `prettier` - Code formatting

## 🔒 Security Best Practices

1. **HTTPS Only** - Always use HTTPS in production
2. **CORS Configuration** - Backend must allow frontend domain
3. **Input Validation** - Validate all user inputs
4. **Sensitive Data** - Never hardcode API keys
5. **Environment Variables** - Use `.env` files for secrets
6. **XSS Protection** - Angular's built-in sanitization
7. **CSP Headers** - Configure Content Security Policy

## 🐛 Troubleshooting

### Issue: "Cannot connect to API"
```
Solution: Check API_BASE_URL environment variable
         Verify backend is running
         Check CORS configuration in backend
```

### Issue: "Build fails with memory error"
```
Solution: Increase Node memory:
         set NODE_OPTIONS=--max-old-space-size=4096
```

### Issue: "Page shows 404 after build"
```
Solution: Ensure output directory is correct
         Check routing configuration
         Verify static file serving
```

## 📚 Resources

- [Angular Documentation](https://angular.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Angular CLI Guide](https://angular.io/cli)
- [RxJS Documentation](https://rxjs.dev)

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the main project repository for backend documentation

## 📄 License

MIT License - See LICENSE file for details

## ✅ Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Build completes without errors (`npm run build`)
- [ ] Environment variables configured
- [ ] Backend API URL verified
- [ ] CORS enabled for frontend domain
- [ ] Performance tested and optimized
- [ ] Accessibility requirements met (WCAG 2.1)
- [ ] Security audit completed
- [ ] Monitoring and logging configured

---

**Version:** 1.0.0  
**Last Updated:** June 27, 2026  
**Maintained By:** Voice Bot Development Team
