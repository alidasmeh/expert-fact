# ExpertVoice - Social Expert Platform

## Overview

ExpertVoice is a full-stack web application that allows users to share social media posts (Instagram and X.com) and receive expert feedback from verified professionals. The platform connects content creators with domain experts to provide valuable insights and advice.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

This is a modern full-stack application built with a React frontend, Express.js backend, and PostgreSQL database. The architecture follows a monorepo structure with clear separation between client, server, and shared code.

### Key Technologies
- **Frontend**: React 18 with TypeScript, Vite for bundling
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Authentication**: Replit Auth with OpenID Connect
- **State Management**: TanStack Query for server state

## Key Components

### Frontend Architecture (`/client`)
- **React SPA**: Single-page application with client-side routing using Wouter
- **Component Library**: shadcn/ui components for consistent UI/UX
- **Styling**: Tailwind CSS with custom design system
- **Mobile-First**: Responsive design optimized for mobile devices
- **PWA Features**: Service worker, manifest, and offline capabilities

### Backend Architecture (`/server`)
- **Express Server**: RESTful API with middleware for logging and error handling
- **Authentication Middleware**: Replit Auth integration with session management
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Storage Interface**: Abstracted storage layer for user and content management

### Shared Code (`/shared`)
- **Database Schema**: Centralized Drizzle schema definitions
- **Type Definitions**: Shared TypeScript types between frontend and backend
- **Validation**: Zod schemas for runtime type validation

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth (OpenID Connect)
2. **Session Management**: Sessions stored in PostgreSQL using connect-pg-simple
3. **Content Creation**: Users create posts with social media URLs and expertise requests
4. **Expert Interaction**: Experts can comment on posts within their domain of expertise
5. **Social Features**: Like/unlike functionality for posts and comments
6. **Real-time Updates**: TanStack Query provides optimistic updates and cache invalidation

## External Dependencies

### Database
- **Neon Database**: PostgreSQL-compatible serverless database
- **Connection Pooling**: Uses @neondatabase/serverless for efficient connections

### Authentication
- **Replit Auth**: OpenID Connect provider for user authentication
- **Session Storage**: PostgreSQL-based session management

### UI/UX
- **Radix UI**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **FontAwesome**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool with HMR support
- **ESBuild**: Fast bundler for production builds
- **TypeScript**: Type safety across the entire stack

## Deployment Strategy

### Development
- **Vite Dev Server**: Frontend development with HMR
- **tsx**: TypeScript execution for backend development
- **Database Migrations**: Drizzle Kit for schema management

### Production Build
1. **Frontend**: Vite builds optimized React bundle to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Static Serving**: Express serves frontend assets in production
4. **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPLIT_DOMAINS required

### Database Schema
- **users**: User profiles with expertise categories
- **posts**: Social media posts with seeking expertise
- **comments**: Expert feedback on posts
- **likes**: User engagement tracking
- **sessions**: Authentication session storage

### Key Features
- **Expertise Matching**: Users can request specific types of expert feedback
- **Social Media Integration**: Support for Instagram and X.com post sharing
- **Mobile Optimization**: Bottom navigation and mobile-first design
- **Progressive Web App**: Offline capabilities and app-like experience
- **Type Safety**: End-to-end TypeScript for reliability