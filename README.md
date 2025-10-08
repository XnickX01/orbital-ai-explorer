# 🛰️ Orbital AI Explorer

Full-stack AI web application that visualizes and interprets real-world aerospace data — built with React, Express, and FastAPI.

## 🌟 Features

- **AI-Powered Natural Language Search**: Search through space missions, rockets, and launches using natural language queries
- **Dynamic Visual Dashboards**: Interactive charts and statistics for space data analytics
- **Real-time Data Synchronization**: Automated data pipelines from NASA, SpaceX, and FAA APIs
- **Vector Similarity Search**: Find related missions and launches using AI embeddings
- **AI-Generated Insights**: Get intelligent analysis and summaries of space data

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Custom components with responsive design
- **Data Visualization**: Recharts for interactive charts
- **State Management**: React Query for server state
- **Styling**: CSS3 with modern layouts

### Backend - Express (REST APIs)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with connection pooling
- **External APIs**: NASA, SpaceX, FAA integrations
- **Data Pipeline**: Automated synchronization with cron jobs
- **Features**: RESTful endpoints for launches, rockets, missions, and statistics

### Backend - FastAPI (AI Services)
- **Framework**: FastAPI with Python
- **AI Features**: Natural language search, vector similarity, insights generation
- **ML Libraries**: LangChain, OpenAI, Sentence Transformers
- **Vector Database**: ChromaDB for embeddings storage
- **Features**: Semantic search, AI insights, similarity matching

### Database
- **System**: PostgreSQL 15+
- **Schema**: Normalized tables for launches, rockets, and missions
- **Indexing**: Full-text search and B-tree indexes for performance
- **Features**: JSONB support for flexible data, triggers for auto-updates

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **PostgreSQL** 15+
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/XnickX01/orbital-ai-explorer.git
cd orbital-ai-explorer
```

### 2. Set Up PostgreSQL Database

```bash
# Create database
createdb orbital_explorer

# Run schema
psql -d orbital_explorer -f database/schema.sql
```

### 3. Set Up Express Backend

```bash
cd backend/express

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials and API keys

# Run in development mode
npm run dev

# Or build and run in production
npm run build
npm start
```

The Express server will start at `http://localhost:5000`

### 4. Set Up FastAPI Backend

```bash
cd backend/fastapi

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your database URL and OpenAI API key

# Run in development mode
python main.py

# Or with uvicorn
uvicorn main:app --reload --port 8000
```

The FastAPI server will start at `http://localhost:8000`

### 5. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file (optional - defaults work with proxies)
cp .env.example .env

# Run in development mode
npm run dev
```

The frontend will start at `http://localhost:3000`

## 📚 API Documentation

### Express REST API (Port 5000)

#### Launches
- `GET /launches` - Get all launches
- `GET /launches/:id` - Get launch by ID
- `GET /launches/recent/:count` - Get recent launches

#### Rockets
- `GET /rockets` - Get all rockets
- `GET /rockets/:id` - Get rocket by ID
- `GET /rockets/filter/active` - Get active rockets

#### Missions
- `GET /missions` - Get all missions
- `GET /missions/:id` - Get mission by ID

#### Statistics
- `GET /stats` - Get dashboard statistics

#### Data Sync
- `POST /sync` - Synchronize data from external APIs

### FastAPI AI Service (Port 8000)

#### Search
- `POST /search` - Natural language search across all data
  ```json
  {
    "query": "successful Falcon 9 launches in 2023",
    "filters": {
      "dateFrom": "2023-01-01",
      "dateTo": "2023-12-31",
      "successOnly": true
    }
  }
  ```

#### Insights
- `GET /insights/{data_type}/{id}` - Get AI-generated insights
  - data_type: `launch`, `rocket`, or `mission`

#### Similarity
- `GET /similar/{data_type}/{id}` - Find similar items using vector search
  - data_type: `launch`, `rocket`, or `mission`

Interactive API docs available at:
- FastAPI: `http://localhost:8000/docs`
- Express: View code or use tools like Postman

## 🔧 Configuration

### Environment Variables

#### Express Backend
- `PORT` - Server port (default: 5000)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `NASA_API_KEY` - NASA API key (get from https://api.nasa.gov/)

#### FastAPI Backend
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `CHROMA_PERSIST_DIRECTORY` - ChromaDB storage path

#### Frontend
- `VITE_EXPRESS_API_URL` - Express API URL
- `VITE_FASTAPI_URL` - FastAPI URL

## 📊 Data Sources

- **SpaceX API**: Launch and rocket data (https://api.spacexdata.com/v4)
- **NASA API**: Mission data, APOD, NEOs (https://api.nasa.gov)
- **FAA**: Launch licenses and data (integration planned)

## 🧪 Development

### Running Tests

```bash
# Express backend
cd backend/express
npm test

# FastAPI backend
cd backend/fastapi
pytest

# Frontend
cd frontend
npm test
```

### Linting

```bash
# Express backend
cd backend/express
npm run lint

# Frontend
cd frontend
npm run lint
```

### Building for Production

```bash
# Express backend
cd backend/express
npm run build

# Frontend
cd frontend
npm run build
```

## 🐳 Docker Support (Coming Soon)

Docker Compose configuration for easy deployment:

```bash
docker-compose up -d
```

## 📖 Project Structure

```
orbital-ai-explorer/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── express/            # Express REST API
│   │   ├── src/
│   │   │   ├── routes/     # API routes
│   │   │   ├── services/   # Business logic
│   │   │   ├── config/     # Configuration
│   │   │   └── index.ts    # Entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── fastapi/            # FastAPI AI service
│       ├── app/
│       │   ├── routes/     # API routes
│       │   ├── services/   # AI services
│       │   ├── models/     # Data models
│       │   └── config/     # Configuration
│       ├── main.py         # Entry point
│       └── requirements.txt
├── database/
│   └── schema.sql          # PostgreSQL schema
└── docs/
    └── API.md              # API documentation
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- SpaceX for the public API
- NASA for the comprehensive space data APIs
- The open-source community for excellent tools and libraries

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for space enthusiasts and data scientists
