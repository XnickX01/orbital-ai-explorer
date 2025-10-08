# Project Architecture

## Overview

Orbital AI Explorer follows a modern, microservices-inspired architecture with three main components:

1. **Frontend** - React SPA for user interface
2. **Express Backend** - RESTful API for data management
3. **FastAPI Backend** - AI-powered search and analytics
4. **PostgreSQL Database** - Centralized data storage

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                    React + TypeScript                       │
│                         (Port 3000)                         │
│                                                             │
│  Components:                                                │
│  ├─ Dashboard (Stats & Metrics)                            │
│  ├─ AI Search (Natural Language)                           │
│  └─ Visualizations (Charts & Graphs)                       │
└──────────────┬──────────────────┬────────────────────────────┘
               │                  │
               │ HTTP             │ HTTP
               │                  │
       ┌───────▼──────┐   ┌──────▼─────────┐
       │   Express    │   │    FastAPI     │
       │   Backend    │   │    Backend     │
       │  (Port 5000) │   │  (Port 8000)   │
       │              │   │                │
       │ REST APIs:   │   │ AI Services:   │
       │ - Launches   │   │ - Search       │
       │ - Rockets    │   │ - Insights     │
       │ - Missions   │   │ - Similarity   │
       │ - Stats      │   │                │
       │ - Sync       │   │ ML Models:     │
       │              │   │ - Embeddings   │
       │ External:    │   │ - LangChain    │
       │ - SpaceX API │   │ - OpenAI       │
       │ - NASA API   │   │                │
       └──────┬───────┘   └────────┬───────┘
              │                    │
              │ SQL                │ SQL
              │                    │
       ┌──────▼────────────────────▼───────┐
       │         PostgreSQL Database       │
       │           (Port 5432)              │
       │                                    │
       │  Tables:                           │
       │  ├─ launches                       │
       │  ├─ rockets                        │
       │  └─ missions                       │
       └────────────────────────────────────┘
```

## Component Details

### Frontend (React + TypeScript)

**Technology Stack:**
- React 18
- TypeScript
- Vite (build tool)
- Recharts (data visualization)
- Axios (HTTP client)

**Key Features:**
- Single Page Application (SPA)
- Component-based architecture
- Type-safe development
- Hot module replacement
- Responsive design

**Directory Structure:**
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Dashboard.tsx
│   │   ├── AISearch.tsx
│   │   └── LaunchVisualization.tsx
│   ├── pages/            # Page components
│   │   └── HomePage.tsx
│   ├── services/         # API communication
│   │   └── api.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.css           # Styles
│   └── main.tsx          # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

**Data Flow:**
1. User interacts with UI components
2. Components call API service methods
3. API service makes HTTP requests to backends
4. Response data updates component state
5. UI re-renders with new data

### Express Backend (Node.js + TypeScript)

**Technology Stack:**
- Express.js
- TypeScript
- PostgreSQL client (node-pg)
- Axios (external APIs)
- Node-cron (scheduled tasks)

**Key Features:**
- RESTful API design
- Connection pooling
- Error handling middleware
- External API integration
- Data synchronization

**Directory Structure:**
```
backend/express/
├── src/
│   ├── config/           # Configuration
│   │   └── database.ts
│   ├── routes/           # API endpoints
│   │   ├── launches.ts
│   │   ├── rockets.ts
│   │   ├── missions.ts
│   │   ├── stats.ts
│   │   └── sync.ts
│   ├── services/         # Business logic
│   │   └── externalAPIs.ts
│   └── index.ts          # Entry point
├── package.json
└── tsconfig.json
```

**API Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/launches` | Get all launches |
| GET | `/launches/:id` | Get launch by ID |
| GET | `/rockets` | Get all rockets |
| GET | `/rockets/:id` | Get rocket by ID |
| GET | `/missions` | Get all missions |
| GET | `/stats` | Get statistics |
| POST | `/sync` | Sync external data |

**External API Integration:**
- **SpaceX API**: Launch and rocket data
- **NASA API**: Mission data, APOD, NEOs
- Data is fetched, transformed, and stored in PostgreSQL

### FastAPI Backend (Python)

**Technology Stack:**
- FastAPI
- Python 3.10+
- SQLAlchemy (ORM)
- Pydantic (data validation)
- LangChain (AI framework)
- OpenAI (language models)
- ChromaDB (vector database)

**Key Features:**
- Async API endpoints
- Automatic API documentation (OpenAPI/Swagger)
- Type hints and validation
- AI-powered search
- Vector embeddings

**Directory Structure:**
```
backend/fastapi/
├── app/
│   ├── config/           # Configuration
│   │   └── database.py
│   ├── models/           # Data models
│   │   └── schemas.py
│   ├── routes/           # API endpoints
│   │   ├── search.py
│   │   ├── insights.py
│   │   └── similar.py
│   └── services/         # AI services
│       ├── ai_insights.py
│       └── vector_search.py
├── main.py               # Entry point
└── requirements.txt
```

**AI Capabilities:**

1. **Natural Language Search**
   - Parse user queries
   - Search across multiple data types
   - Rank results by relevance

2. **AI Insights**
   - Generate summaries
   - Extract key facts
   - Provide contextual analysis

3. **Vector Similarity**
   - Find similar launches/rockets
   - Use embeddings for semantic matching
   - Recommend related content

### PostgreSQL Database

**Schema Design:**

**Launches Table:**
```sql
CREATE TABLE launches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    date TIMESTAMP NOT NULL,
    rocket VARCHAR(255),
    success BOOLEAN DEFAULT false,
    details TEXT,
    launchpad VARCHAR(255),
    crew JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Rockets Table:**
```sql
CREATE TABLE rockets (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    active BOOLEAN DEFAULT true,
    stages INTEGER,
    boosters INTEGER,
    cost_per_launch BIGINT,
    success_rate_pct DECIMAL(5,2),
    first_flight VARCHAR(50),
    country VARCHAR(255),
    company VARCHAR(255),
    height DECIMAL(10,2),
    diameter DECIMAL(10,2),
    mass BIGINT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Missions Table:**
```sql
CREATE TABLE missions (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    spacecraft VARCHAR(255),
    objectives JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- B-tree indexes on frequently queried columns
- Full-text search indexes on text fields
- JSONB indexes for nested data

## Data Flow

### 1. Data Synchronization Flow

```
SpaceX API → Express Backend → PostgreSQL
NASA API   ↗
```

1. User clicks "Sync Data" in Dashboard
2. Frontend sends POST request to Express `/sync`
3. Express fetches data from SpaceX and NASA APIs
4. Data is validated and transformed
5. Upserted into PostgreSQL (INSERT ... ON CONFLICT)
6. Response sent back to frontend

### 2. Dashboard Statistics Flow

```
Frontend → Express `/stats` → PostgreSQL → Express → Frontend
```

1. Dashboard component loads
2. Calls `dataService.getDashboardStats()`
3. Express aggregates data from PostgreSQL
4. Returns statistics JSON
5. Dashboard renders metrics

### 3. AI Search Flow

```
Frontend → FastAPI `/search` → PostgreSQL → FastAPI → Frontend
```

1. User enters search query
2. Frontend sends POST to FastAPI `/search`
3. FastAPI parses query
4. Searches database with LIKE/full-text search
5. (Future: Use vector embeddings for semantic search)
6. Returns ranked results
7. Frontend displays results

## Security Considerations

### Current Implementation
- CORS enabled for development
- No authentication required
- Environment variables for sensitive data

### Production Recommendations
1. **Authentication & Authorization**
   - JWT tokens
   - OAuth 2.0
   - API keys

2. **Rate Limiting**
   - Implement rate limits per IP/user
   - Protect AI endpoints from abuse

3. **Input Validation**
   - Sanitize all user inputs
   - Validate data types and ranges

4. **Database Security**
   - Use connection pooling
   - Enable SSL connections
   - Principle of least privilege

5. **API Security**
   - HTTPS only
   - CORS restrictions
   - Request signing

## Performance Optimization

### Current Optimizations
1. **Database Indexes** - Fast queries on common fields
2. **Connection Pooling** - Reuse database connections
3. **Async Operations** - Non-blocking API calls

### Future Optimizations
1. **Caching Layer** - Redis for frequently accessed data
2. **CDN** - Static asset delivery
3. **Database Read Replicas** - Scale read operations
4. **Query Optimization** - Analyze and optimize slow queries
5. **Code Splitting** - Lazy load frontend components

## Scalability

### Horizontal Scaling
- Multiple frontend instances behind load balancer
- Multiple Express instances (stateless)
- Multiple FastAPI instances (stateless)
- PostgreSQL read replicas

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database performance
- Upgrade PostgreSQL instance

## Monitoring & Logging

### Recommended Tools
- **Application Monitoring**: Sentry, New Relic
- **Log Aggregation**: ELK Stack, CloudWatch
- **Database Monitoring**: pgAdmin, pg_stat_statements
- **Uptime Monitoring**: Pingdom, UptimeRobot

## Deployment Architecture

### Development
- Local PostgreSQL
- Local Node.js servers
- Local Python server

### Production (Recommended)
```
Internet
    │
    ▼
Load Balancer (AWS ALB, Nginx)
    │
    ├─────────────┬────────────┐
    │             │            │
Frontend       Express     FastAPI
(Vercel/       (ECS/        (ECS/
 S3+CF)        Heroku)      Heroku)
                │            │
                └────┬───────┘
                     │
              PostgreSQL (RDS/
               Heroku Postgres)
```

## Technology Choices Rationale

### Why React?
- Component reusability
- Strong ecosystem
- Excellent TypeScript support
- Fast rendering with Virtual DOM

### Why Express?
- Lightweight and flexible
- Large middleware ecosystem
- Easy to learn and use
- Great for RESTful APIs

### Why FastAPI?
- Modern Python framework
- Async support
- Automatic API documentation
- Type hints and validation
- Perfect for ML/AI integration

### Why PostgreSQL?
- Robust and reliable
- JSONB support for flexible data
- Full-text search capabilities
- Strong ACID compliance
- Excellent for analytics

## Future Enhancements

1. **Real-time Updates**
   - WebSocket connections
   - Live data streaming

2. **Advanced AI Features**
   - Vector database integration
   - Custom embeddings
   - Conversational AI interface

3. **User Management**
   - User accounts
   - Saved searches
   - Personalized dashboards

4. **Enhanced Visualization**
   - 3D rocket models
   - Interactive maps
   - Timeline views

5. **Mobile App**
   - React Native
   - Native features
   - Offline support

## Contributing

When contributing to this project, please maintain the architectural principles:

1. **Separation of Concerns** - Keep components focused
2. **Type Safety** - Use TypeScript and Python type hints
3. **RESTful Design** - Follow REST principles
4. **Documentation** - Document all APIs and components
5. **Testing** - Write tests for new features

---

For more information, see:
- [API Documentation](API.md)
- [Getting Started Guide](GETTING_STARTED.md)
- [Deployment Guide](DEPLOYMENT.md)
