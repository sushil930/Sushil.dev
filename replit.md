# Portfolio Website

## Overview

This is a modern portfolio website built with React and Express.js, featuring a retro/pixel art aesthetic design theme. The application showcases a developer's work, skills, and provides a contact form for potential clients or employers. The site uses a full-stack architecture with a React frontend and Express backend, integrated with PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom retro/pixel theme
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Validation**: Zod for runtime type checking
- **Session Management**: Built-in session handling (connect-pg-simple for PostgreSQL sessions)
- **API Design**: RESTful API structure

### Development Environment
- **Runtime**: Node.js with ES modules
- **Development Server**: Vite dev server with HMR
- **Build Process**: Vite for frontend, esbuild for backend bundling
- **Database Migrations**: Drizzle Kit for schema management

## Key Components

### Frontend Components
1. **Navigation**: Fixed header with smooth scrolling navigation
2. **Hero Section**: Main introduction with retro styling
3. **Portfolio**: Project showcase with card-based layout
4. **Skills**: Technical skills display with progress bars
5. **Contact Form**: Form with validation and submission handling
6. **UI Components**: Comprehensive set of reusable components from shadcn/ui

### Backend Components
1. **Contact API**: Handles form submissions and stores contact data
2. **Storage Layer**: Abstracted storage interface with in-memory implementation
3. **Route Registration**: Centralized route management
4. **Error Handling**: Global error handling middleware
5. **Static File Serving**: Serves built frontend assets in production

### Database Schema
- **Users Table**: Basic user authentication structure (id, username, password)
- **Contacts Table**: Contact form submissions (id, name, email, message, created_at)

## Data Flow

1. **Client Request**: User interacts with React frontend
2. **Form Submission**: Contact form data validated with Zod schemas
3. **API Call**: TanStack Query handles HTTP requests to Express backend
4. **Database Operation**: Drizzle ORM performs database operations
5. **Response**: Server responds with JSON data
6. **UI Update**: React components update based on response

## External Dependencies

### Frontend Dependencies
- **UI Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation
- **Carousel**: Embla Carousel for image galleries

### Backend Dependencies
- **Database**: Neon Database (PostgreSQL) for cloud hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod for schema validation
- **Session Store**: connect-pg-simple for PostgreSQL session storage

### Development Dependencies
- **Build Tools**: Vite and esbuild for fast builds
- **Type Checking**: TypeScript for static type checking
- **Development**: tsx for TypeScript execution
- **Replit Integration**: Replit-specific plugins for development environment

## Deployment Strategy

### Production Build
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Database: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: Uses tsx for hot reloading and Vite dev server
- **Production**: Serves static files from Express with built assets
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database instance
- Environment variables for database connection

## Changelog

```
Changelog:
- July 08, 2025. Added project management functionality with full CRUD operations
- July 08, 2025. Made snake game mobile-responsive (hides score/coins on mobile)
- July 08, 2025. Backend project API routes completed with validation
- July 06, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```