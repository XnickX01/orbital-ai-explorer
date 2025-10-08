from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn

from app.api.endpoints import analysis, recommendations, health, chat
# Import training modules
try:
    from app.api.endpoints import data_ingestion, model_training
    DATA_INGESTION_AVAILABLE = True
    MODEL_TRAINING_AVAILABLE = True
except ImportError:
    DATA_INGESTION_AVAILABLE = False
    MODEL_TRAINING_AVAILABLE = False

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="AI Space Data Explorer - AI Service",
    description="AI-powered insights and recommendations for space data",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3002,http://localhost:3003").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])

# Include training endpoints if available
if DATA_INGESTION_AVAILABLE:
    app.include_router(data_ingestion.router, prefix="/api/training", tags=["Training & Data Ingestion"])

if MODEL_TRAINING_AVAILABLE:
    app.include_router(model_training.router, prefix="/api/training", tags=["Model Training"])

@app.get("/")
async def root():
    """Root endpoint with service information."""
    return {
        "service": "AI Space Data Explorer - AI Service",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc"
    }

if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", 8001))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
