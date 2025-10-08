# AI Space Data Explorer

A full-stack AI web application that visualizes and interprets real-world aerospace data. Built with React, Express, FastAPI, and powered by AI for intelligent insights into space exploration.

## 🚀 Features

- **🌌 Interactive Data Visualization**: Explore NASA missions, SpaceX launches, and cosmic discoveries through beautiful, responsive charts and visualizations
- **🤖 AI-Powered Insights**: Get intelligent summaries, pattern recognition, and personalized recommendations using OpenAI and custom ML models
- **📊 Real-time Space Data**: Integration with NASA and SpaceX APIs for up-to-date information on missions, launches, and astronomical events
- **🔐 User Authentication**: Secure JWT-based authentication with user profiles and preferences
- **📱 Responsive Design**: Modern Material-UI interface that works seamlessly on desktop and mobile devices
- **🎯 Personalized Recommendations**: AI-driven suggestions for missions, datasets, and discoveries based on user interests

## 🏗️ Architecture

This project uses a modern microservices architecture:

- **Frontend** (`/client`): React + TypeScript + Vite + Material-UI
- **Backend API** (`/server`): Express.js + TypeScript + MongoDB + JWT Authentication  
- **AI Service** (`/ai-service`): FastAPI + Python + OpenAI + Machine Learning

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- MongoDB (local or cloud)
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd orbital-ai-explorer
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and database URLs
   ```

4. **Start all services in development mode**
   ```bash
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001  
- AI Service: http://localhost:8001
- AI Service Docs: http://localhost:8001/docs

## 📁 Project Structure

```
orbital-ai-explorer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components (Landing, Dashboard, Auth)
│   │   ├── services/      # API service layers
│   │   ├── types/         # TypeScript type definitions
│   │   ├── hooks/         # Custom React hooks
│   │   └── stores/        # State management
│   └── package.json
├── server/                # Express.js backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # External API integrations
│   │   └── config/        # Database and app configuration
│   └── package.json
├── ai-service/            # FastAPI AI microservice
│   ├── app/
│   │   ├── api/endpoints/ # AI API endpoints
│   │   ├── models/        # Pydantic models
│   │   ├── services/      # AI/ML business logic
│   │   └── core/          # Core configuration
│   ├── main.py
│   └── requirements.txt
├── package.json           # Root package.json with scripts
├── .env.example          # Environment variables template
└── README.md
```

## 🛠️ Available Scripts

### Root Level
- `npm run dev` - Start all services in development mode
- `npm run install:all` - Install dependencies for all projects
- `npm run build` - Build all projects for production
- `npm run test` - Run all tests
- `npm run lint` - Lint all projects
- `npm run format` - Format code in all projects

### Individual Services
- `npm run client:dev` - Start only the React frontend
- `npm run server:dev` - Start only the Express backend  
- `npm run ai:dev` - Start only the FastAPI AI service

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/orbital-ai-explorer

# API Keys
NASA_API_KEY=your_nasa_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Authentication
JWT_SECRET=your_jwt_secret_here

# Service Ports
CLIENT_PORT=3000
SERVER_PORT=3001
AI_SERVICE_PORT=8001
```

## 🌐 API Endpoints

### Backend API (Port 3001)
- `GET /health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/space-data/nasa/apod` - NASA Astronomy Picture of the Day
- `GET /api/space-data/spacex/launches` - SpaceX launch data
- `GET /api/users/profile` - User profile management

### AI Service (Port 8001)
- `GET /health` - AI service health check
- `POST /api/analysis/summarize` - Generate AI summaries
- `POST /api/analysis/insights` - Extract data insights
- `POST /api/recommendations/missions` - Mission recommendations
- `GET /api/recommendations/trending` - Trending space topics

## 🚀 Deployment

### Docker (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Build all projects: `npm run build`
2. Deploy each service to your preferred platform
3. Configure environment variables in production
4. Set up MongoDB and external API access

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests for specific service
npm run client:test
npm run server:test
npm run ai:test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Update documentation as needed
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NASA for providing open access to space data and APIs
- SpaceX for their public API and mission data
- OpenAI for AI capabilities
- The open-source community for the amazing tools and libraries

## 🔗 Links

- [NASA Open Data Portal](https://data.nasa.gov/)
- [SpaceX API](https://github.com/r-spacex/SpaceX-API)
- [React Documentation](https://reactjs.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Material-UI](https://mui.com/)
