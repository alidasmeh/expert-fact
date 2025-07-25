# ExpertVoice - Mobile-First Social Expert Platform

A Progressive Web App (PWA) built with React and JavaScript that allows users to share social media posts (Instagram and X.com) and receive expert feedback from verified professionals.

## Features

- 📱 **Mobile-First PWA**: Native app-like experience with offline capabilities
- 🔐 **Secure Authentication**: Replit Auth integration with OpenID Connect
- 📸 **Social Media Integration**: Share Instagram and X.com posts
- 👥 **Expert Matching**: Connect with verified professionals in your field
- 💬 **Real-time Comments**: Get expert feedback and engage in discussions
- ❤️ **Social Features**: Like posts and comments
- 🎯 **Expertise Categories**: Marketing, Design, Technology, and more
- 📊 **User Profiles**: Track posts, comments, and engagement

## Tech Stack

### Frontend
- React 18 with JavaScript (JSX)
- Vite for fast development and building
- Tailwind CSS + shadcn/ui components
- TanStack Query for server state management
- Wouter for client-side routing

### Backend
- Express.js with TypeScript
- Replit Auth (OpenID Connect)
- PostgreSQL with Drizzle ORM
- Session-based authentication

### PWA Features
- Service Worker for offline functionality
- Web App Manifest for installation
- Mobile-optimized touch interactions
- Safe area support for notched devices

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd expertvoice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - `DATABASE_URL`: PostgreSQL connection string
   - `SESSION_SECRET`: Session encryption key
   - `REPLIT_DOMAINS`: Allowed domains for auth

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── index.css      # Global styles
│   └── public/            # Static assets & PWA files
├── server/                # Express backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── replitAuth.ts      # Authentication setup
├── shared/                # Shared code
│   └── schema.ts          # Database schema
└── migrations/            # Database migrations
```

## Key Features

### User Authentication
- Seamless login with Replit Auth
- Automatic session management
- User expertise selection

### Post Sharing
- Share Instagram and X.com links
- Request specific types of expert feedback
- Rich social media link previews

### Expert System
- Browse experts by category
- Filter by expertise areas
- View expert profiles and engagement stats

### Mobile Experience
- Touch-optimized interactions
- Bottom navigation for easy thumb access
- Pull-to-refresh functionality
- Native app installation prompt

## Database Schema

- **users**: User profiles with expertise categories
- **posts**: Social media posts seeking expert feedback
- **comments**: Expert responses and discussions
- **likes**: User engagement tracking
- **sessions**: Authentication session storage

## Deployment

The app is configured for Replit deployment with automatic:
- Frontend building to `dist/public`
- Backend bundling to `dist/index.js`
- Static asset serving in production
- Database connection handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@expertvoice.app or join our [Discord community](https://discord.gg/expertvoice).