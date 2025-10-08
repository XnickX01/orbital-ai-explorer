from fastapi import APIRouter
from datetime import datetime
import os

router = APIRouter()

@router.get("/")
async def health_check():
    """Health check endpoint for the AI service."""
    return {
        "status": "healthy",
        "service": "AI Space Data Explorer - AI Service",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "environment": os.getenv("AI_MODEL_TYPE", "openai"),
        "uptime": "Running"
    }

@router.get("/status")
async def detailed_status():
    """Detailed status information for monitoring."""
    return {
        "status": "operational",
        "components": {
            "api": "healthy",
            "ai_model": "ready",
            "data_processing": "available"
        },
        "configuration": {
            "model_type": os.getenv("AI_MODEL_TYPE", "openai"),
            "port": os.getenv("AI_SERVICE_PORT", "8001")
        },
        "timestamp": datetime.utcnow().isoformat()
    }
