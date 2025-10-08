# Getting Started with Orbital AI Explorer

This guide will help you set up and run the Orbital AI Explorer on your local machine.

## Overview

Orbital AI Explorer is a full-stack AI-powered web application for exploring and analyzing space industry data. It consists of:

- **Frontend**: React + TypeScript (port 3000)
- **Express Backend**: REST API (port 5000)
- **FastAPI Backend**: AI Services (port 8000)
- **PostgreSQL Database**: Data storage (port 5432)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **Python** 3.10 or higher ([Download](https://www.python.org/))
- **PostgreSQL** 15 or higher ([Download](https://www.postgresql.org/))
- **Git** ([Download](https://git-scm.com/))

### Optional
- **Docker** and **Docker Compose** for containerized deployment

## Installation Options

### Option 1: Manual Setup (Recommended for Development)

#### Step 1: Clone the Repository

```bash
git clone https://github.com/XnickX01/orbital-ai-explorer.git
cd orbital-ai-explorer
```

#### Step 2: Set Up PostgreSQL Database

1. **Start PostgreSQL service:**
   ```bash
   # macOS (with Homebrew)
   brew services start postgresql@15
   
   # Linux
   sudo systemctl start postgresql
   
   # Windows
   # Start from Services or pgAdmin
   ```

2. **Create the database:**
   ```bash
   createdb orbital_explorer
   ```

3. **Load the schema:**
   ```bash
   psql -d orbital_explorer -f database/schema.sql
   ```

#### Step 3: Set Up Express Backend

1. **Navigate to the Express directory:**
   ```bash
   cd backend/express
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=orbital_explorer
   DB_USER=postgres
   DB_PASSWORD=your_password
   NASA_API_KEY=DEMO_KEY
   ```

4. **Start the Express server:**
   ```bash
   npm run dev
   ```
   
   The server will start at `http://localhost:5000`

#### Step 4: Set Up FastAPI Backend

1. **Open a new terminal and navigate to the FastAPI directory:**
   ```bash
   cd backend/fastapi
   ```

2. **Create a Python virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   ```bash
   # macOS/Linux
   source venv/bin/activate
   
   # Windows
   venv\Scripts\activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/orbital_explorer
   OPENAI_API_KEY=your_openai_key_optional
   ```

6. **Start the FastAPI server:**
   ```bash
   python main.py
   ```
   
   The server will start at `http://localhost:8000`
   
   View interactive API docs at `http://localhost:8000/docs`

#### Step 5: Set Up React Frontend

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will start at `http://localhost:3000`

#### Step 6: Sync External Data

Once all services are running:

1. Open your browser to `http://localhost:3000`
2. Click on the "Dashboard" tab
3. Click the "🔄 Sync Data" button
4. Wait for the data to be synchronized from SpaceX API

This will populate your database with real launch and rocket data!

### Option 2: Docker Setup (Recommended for Quick Start)

If you have Docker and Docker Compose installed:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/XnickX01/orbital-ai-explorer.git
   cd orbital-ai-explorer
   ```

2. **Create environment file:**
   ```bash
   cat > .env << EOF
   NASA_API_KEY=DEMO_KEY
   OPENAI_API_KEY=your_key_optional
   EOF
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Wait for services to start (about 30 seconds)**

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Express API: http://localhost:5000
   - FastAPI: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Verification

### Check if all services are running:

1. **Frontend** - Open http://localhost:3000
   - You should see the Orbital AI Explorer homepage

2. **Express API** - Visit http://localhost:5000
   - Should return API information JSON

3. **FastAPI** - Visit http://localhost:8000
   - Should return API information JSON
   - Visit http://localhost:8000/docs for interactive docs

4. **Database** - Check database connection:
   ```bash
   psql -d orbital_explorer -c "SELECT COUNT(*) FROM launches;"
   ```

## Using the Application

### Dashboard
- View statistics about launches, rockets, and missions
- Click "Sync Data" to fetch latest data from SpaceX API
- Monitor success rates and active rockets

### AI Search
- Type natural language queries like:
  - "successful Falcon 9 launches"
  - "rockets by SpaceX"
  - "recent launches in 2024"
- View results across launches, rockets, and missions

### Visualizations
- View launch trends over time
- See top rockets by launch count
- Analyze success rates with interactive charts

## API Keys

### NASA API Key (Optional)
- Get a free key at: https://api.nasa.gov/
- Increases rate limits for NASA data
- Default DEMO_KEY works but has lower limits

### OpenAI API Key (Optional)
- Required for advanced AI insights
- Get a key at: https://platform.openai.com/
- Not required for basic functionality

## Troubleshooting

### Database Connection Issues

**Error: "Could not connect to PostgreSQL"**

1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list | grep postgresql
   
   # Linux
   systemctl status postgresql
   ```

2. Verify credentials in `.env` files

3. Test connection:
   ```bash
   psql -d orbital_explorer -U postgres
   ```

### Port Already in Use

**Error: "Port 3000/5000/8000 is already in use"**

1. Find and kill the process:
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5000 | xargs kill -9
   lsof -ti:8000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Or change the port in configuration files

### Module Not Found Errors

**Frontend/Express:**
```bash
cd frontend  # or backend/express
rm -rf node_modules package-lock.json
npm install
```

**FastAPI:**
```bash
cd backend/fastapi
rm -rf venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Data Not Showing

1. Make sure all services are running
2. Click "Sync Data" in the Dashboard
3. Check browser console for errors (F12)
4. Check backend logs in terminal

### Docker Issues

**Services not starting:**
```bash
docker-compose down
docker-compose up -d --build
```

**View logs:**
```bash
docker-compose logs -f
```

**Reset everything:**
```bash
docker-compose down -v
docker-compose up -d --build
```

## Development Tips

### Hot Reload
All services support hot reload:
- Frontend: Changes automatically reflected
- Express: Using `ts-node-dev`
- FastAPI: Using `uvicorn --reload`

### Debugging

**Frontend:**
- Use React DevTools browser extension
- Check browser console (F12)

**Backend:**
- Check terminal logs
- Use debugger in VS Code
- Add console.log / print statements

### Database Management

**View data:**
```bash
psql -d orbital_explorer

# In psql:
\dt                    # List tables
SELECT * FROM launches LIMIT 10;
SELECT * FROM rockets;
```

**Reset database:**
```bash
dropdb orbital_explorer
createdb orbital_explorer
psql -d orbital_explorer -f database/schema.sql
```

## Next Steps

1. **Explore the codebase:**
   - Frontend components in `frontend/src/components/`
   - Express routes in `backend/express/src/routes/`
   - FastAPI routes in `backend/fastapi/app/routes/`

2. **Read the documentation:**
   - API Documentation: `docs/API.md`
   - Deployment Guide: `docs/DEPLOYMENT.md`

3. **Contribute:**
   - Check open issues on GitHub
   - Submit pull requests
   - Report bugs

## Getting Help

- **Documentation**: Check the `/docs` directory
- **Issues**: Open an issue on GitHub
- **API Docs**: http://localhost:8000/docs when FastAPI is running

## Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SpaceX API Documentation](https://github.com/r-spacex/SpaceX-API)
- [NASA APIs](https://api.nasa.gov/)

---

Happy exploring! 🚀🛰️
