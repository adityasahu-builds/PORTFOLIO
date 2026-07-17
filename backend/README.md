# Portfolio Backend

This is the backend service for Aditya Sahu's portfolio, built with Node.js, Express, and TypeScript.

## Architecture Highlights
- **Strictly Typed**: Full TypeScript support with rigorous configurations.
- **Security-First**: Configured with Helmet, CORS, and Express Rate Limiter.
- **Centralized Error Handling**: Standardized API responses and robust global error catching.
- **Modular Design**: Separates concerns (Routes, Controllers, Middlewares, Config) for highly scalable code.

## Folder Structure
```text
src/
├── config/          # Centralized configuration and env variable validation
├── controllers/     # Request handlers containing business logic
├── database/        # Enterprise database connection manager, schemas, & plugins
├── errors/          # Custom error types (e.g., AppError)
├── middlewares/     # Global and route-specific middleware functions
├── routes/          # Express route definitions
├── utils/           # Helper functions (AsyncHandler, Logger, API responses)
├── app.ts           # Express application configuration
└── server.ts        # Server entry point
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository and navigate to the backend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *Note: Edit the `.env` file with your specific configuration details.*

### Development
Start the development server with hot-reloading:
```bash
npm run dev
```

### Production Build
Compile the TypeScript code to JavaScript:
```bash
npm run build
```
Start the production server:
```bash
npm start
```

### Linting & Formatting
- **Lint**: `npm run lint` (or `npm run lint:fix` to autofix)
- **Format**: `npm run format`

### API Endpoints
#### Health Check
- `GET /api/v1/health` - Returns server status, uptime, environment details, and **live database connection state**.

## Database Architecture (Phase 2)
- **Robust Connection Manager**: Features exponential backoff on initial connection failure to protect infrastructure.
- **Connection Lifecycle Logs**: Real-time logging of MongoDB `connected`, `disconnected`, and `reconnected` events.
- **Graceful Shutdown**: Automatically closes the Mongoose connection when the application receives a termination signal.
- **Base Standards**: Global `toJSON` plugin automatically handles `_id` to `id` conversion and strips `__v` across all future models.

## Future Roadmap
- [x] Database Integration Architecture (MongoDB/Mongoose)
- [ ] Contact Form API (Nodemailer/SMTP)
- [ ] Authentication Module (JWT)
- [ ] Admin Dashboard API
