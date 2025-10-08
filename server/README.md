# Server - AI Space Data Explorer Backend

This is the Express.js backend API for the AI Space Data Explorer application. Built with Express, TypeScript, and MongoDB.

## Features

- 🚀 Express.js with TypeScript
- 🔐 JWT-based authentication
- 🛡️ Security middleware (Helmet, CORS)
- 📊 Integration with NASA and SpaceX APIs
- 🗄️ MongoDB database with Mongoose ODM
- 🧪 Comprehensive error handling
- 📝 Request logging with Morgan
- 🔧 Environment-based configuration

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp ../.env.example .env
   ```

3. Update the `.env` file with your database and API credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The server will be running at [http://localhost:3001](http://localhost:3001)

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Space Data
- `GET /api/space-data/nasa/apod` - NASA Astronomy Picture of the Day
- `GET /api/space-data/spacex/launches` - SpaceX launches
- `GET /api/space-data/spacex/rockets` - SpaceX rockets
- `GET /api/space-data/nasa/missions` - NASA missions

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/favorites` - Get user favorites
- `POST /api/users/favorites` - Add to favorites

## Project Structure

```
src/
├── config/         # Database and app configuration
├── controllers/    # Request handlers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `SERVER_PORT` - Server port (default: 3001)
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `NASA_API_KEY` - NASA API key
- `OPENAI_API_KEY` - OpenAI API key

## Contributing

1. Follow TypeScript best practices
2. Use the provided ESLint and Prettier configurations
3. Write tests for new features
4. Update API documentation
