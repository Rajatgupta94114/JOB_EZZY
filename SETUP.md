# JOBEZZY Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
JOBEZZY/
├── app/
│   ├── layout.tsx              # Root layout with TonConnect provider
│   ├── page.tsx                # Dashboard home page
│   ├── globals.css             # Global styles & animations
│   ├── jobs/
│   │   └── page.tsx            # Jobs listing page
│   ├── candidates/
│   │   └── page.tsx            # Candidates management page
│   ├── leaderboard/
│   │   └── page.tsx            # Recruiter leaderboard
│   └── profile/
│       └── page.tsx            # User profile page
├── components/
│   ├── SplashScreen.tsx        # 3-second splash screen
│   ├── AuthModal.tsx           # TON Wallet & Telegram login
│   └── Navigation.tsx          # Bottom/top navigation bar
├── lib/
│   └── store.ts                # Zustand state management
├── public/
│   └── tonconnect-manifest.json # TON Connect configuration
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## Features Implemented

### ✅ Frontend
- **Splash Screen** - 3-second animated intro with gradient background
- **Auth Modal** - TON Wallet & Telegram login options
- **Navigation** - Responsive mobile/desktop navigation
- **Dashboard** - User stats, featured jobs, leaderboard preview
- **Pages** - Jobs, Candidates, Leaderboard, Profile
- **Dark Theme** - Optimized for Telegram Mini-App
- **Animations** - Fade-in, slide-in, pulse effects
- **Responsive Design** - Mobile-first approach

### 🔐 Authentication
- TON Wallet connection via @tonconnect/ui-react
- Telegram Mini-App login support
- JWT token management (ready for backend)
- User state persistence with Zustand

### 🎨 UI/UX
- Glass morphism design
- Gradient text and buttons
- Smooth transitions
- Touch-friendly interface
- Dark color scheme (primary: cyan, accent: pink)

## Environment Setup

### TON Connect Configuration
The app uses TON Connect v2. Update the manifest URL in `app/layout.tsx`:

```typescript
manifestUrl="https://your-domain.com/tonconnect-manifest.json"
```

Update `public/tonconnect-manifest.json`:
```json
{
  "url": "https://your-domain.com",
  "name": "JOBEZZY",
  "iconUrl": "https://your-domain.com/icon.png",
  "termsOfUseUrl": "https://your-domain.com/terms",
  "privacyPolicyUrl": "https://your-domain.com/privacy"
}
```

### Telegram Mini-App Setup
1. Create a bot with [@BotFather](https://t.me/botfather)
2. Enable Mini-App in bot settings
3. Set Mini-App URL to your deployment URL
4. Integrate Telegram SDK in components

## Development

### Add New Page
```bash
mkdir -p app/new-page
touch app/new-page/page.tsx
```

### Add New Component
```bash
touch components/NewComponent.tsx
```

### Styling
- Use Tailwind CSS utility classes
- Custom colors in `tailwind.config.ts`
- Global styles in `app/globals.css`

## Building for Production

### Build
```bash
npm run build
```

### Type Check
```bash
npm run type-check
```

### Start Production Server
```bash
npm start
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./
EXPOSE 3000
CMD ["npm", "start"]
```

## Backend Integration (Next Steps)

### API Endpoints to Implement
```
POST   /api/auth/login-wallet
POST   /api/auth/login-telegram
POST   /api/jobs
GET    /api/jobs
POST   /api/candidates
GET    /api/leaderboard
POST   /api/escrow/create
POST   /api/credentials/mint
```

### Database Schema
See `README.md` for full schema details.

### Smart Contracts
- Escrow contract (Tact)
- SBT collection (Tact)
- NFT collection (TIP-4, optional)

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### TON Connect Issues
- Verify manifest URL is accessible
- Check wallet extension is installed
- Clear browser cache
- Try incognito mode

### Telegram Mini-App Issues
- Ensure HTTPS is enabled
- Check Mini-App URL in bot settings
- Verify bot token is correct
- Test with Telegram Web App

## Performance Optimization

### Next.js Optimizations
- Image optimization enabled
- Code splitting automatic
- CSS minification enabled
- Tree-shaking enabled

### Bundle Size
```bash
npm run build
# Check .next/static folder
```

## Security

### Best Practices
- Never commit `.env` files
- Use environment variables for secrets
- Validate all user inputs
- Sanitize output
- Use HTTPS in production
- Enable CSP headers

### TON Wallet Security
- Verify transaction signatures
- Use secure random number generation
- Implement rate limiting
- Monitor for suspicious activity

## Monitoring

### Sentry (Error Tracking)
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

### Analytics
- Google Analytics
- Mixpanel
- Custom event tracking

## Support & Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TON Docs](https://ton.org/docs)
- [TON Connect Docs](https://ton-connect.github.io/docs)
- [Telegram Mini-App Docs](https://core.telegram.org/bots/webapps)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT - See LICENSE file for details
