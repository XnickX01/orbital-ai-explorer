# AI Service - AI Space Data Explorer

This is the FastAPI-based AI microservice for the AI Space Data Explorer application. It provides AI-powered insights, recommendations, and data analysis capabilities.

## Features

- 🤖 AI-powered data analysis and insights
- 📊 Space data summarization
- 🎯 Personalized recommendations
- 🔍 Pattern recognition in space datasets
- 🌐 RESTful API with FastAPI
- 📚 Interactive API documentation
- 🔧 Configurable AI models (OpenAI, local, HuggingFace)

## Tech Stack

- **FastAPI** - Modern Python web framework
- **OpenAI API** - Large language models
- **NumPy & Pandas** - Data processing
- **Scikit-learn** - Machine learning
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## Getting Started

1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp ../.env.example .env
   ```

4. Update the `.env` file with your API keys

5. Start the development server:
   ```bash
   uvicorn main:app --reload --port 8001
   ```

6. Open [http://localhost:8001](http://localhost:8001) in your browser
7. View API documentation at [http://localhost:8001/docs](http://localhost:8001/docs)

## Available Scripts

- `uvicorn main:app --reload` - Start development server
- `pytest` - Run tests
- `black .` - Format code
- `flake8 .` - Lint code
- `mypy .` - Type checking

## API Endpoints

### Health Check
- `GET /health` - Service health and status

### Analysis
- `POST /api/analysis/summarize` - Generate AI summaries of space data
- `POST /api/analysis/insights` - Extract insights from datasets
- `POST /api/analysis/patterns` - Identify patterns in data

### Recommendations
- `POST /api/recommendations/missions` - Mission recommendations
- `POST /api/recommendations/datasets` - Dataset recommendations
- `GET /api/recommendations/trending` - Trending space topics

## Project Structure

```
app/
├── api/
│   └── endpoints/      # API route handlers
├── core/              # Core configuration
├── models/            # Pydantic models
├── services/          # Business logic
└── utils/             # Utility functions
main.py                # Application entry point
requirements.txt       # Python dependencies
```

## Environment Variables

- `AI_SERVICE_PORT` - Service port (default: 8001)
- `OPENAI_API_KEY` - OpenAI API key
- `AI_MODEL_TYPE` - Model type (openai/local/huggingface)
- `LOCAL_MODEL_PATH` - Path to local ML models
- `HUGGINGFACE_API_KEY` - HuggingFace API key

## AI Models Configuration

The service supports multiple AI backends:

### OpenAI (Default)
Set `AI_MODEL_TYPE=openai` and provide `OPENAI_API_KEY`

### Local Models
Set `AI_MODEL_TYPE=local` and `LOCAL_MODEL_PATH` to your model directory

### HuggingFace
Set `AI_MODEL_TYPE=huggingface` and provide `HUGGINGFACE_API_KEY`

## Contributing

1. Follow PEP 8 style guidelines
2. Use type hints for all functions
3. Write tests for new features
4. Update API documentation
