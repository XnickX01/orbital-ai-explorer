from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter()

class UserProfile(BaseModel):
    interests: List[str]
    experience_level: str
    preferred_topics: List[str]

class MissionRecommendationRequest(BaseModel):
    user_profile: UserProfile
    current_missions: Optional[List[Dict[str, Any]]] = []

class DatasetRecommendationRequest(BaseModel):
    user_profile: UserProfile
    current_datasets: Optional[List[str]] = []

class RecommendationResponse(BaseModel):
    recommendations: List[Dict[str, Any]]
    reasoning: str
    confidence: float

@router.post("/missions", response_model=RecommendationResponse)
async def recommend_missions(request: MissionRecommendationRequest):
    """Generate personalized mission recommendations based on user profile."""
    try:
        # Placeholder recommendations
        recommendations = [
            {
                "name": "Artemis Program",
                "type": "Lunar Exploration",
                "description": "NASA's program to return humans to the Moon",
                "relevance_score": 0.92,
                "reason": "Matches your interest in lunar exploration"
            },
            {
                "name": "Mars Sample Return",
                "type": "Mars Exploration", 
                "description": "Joint NASA-ESA mission to return samples from Mars",
                "relevance_score": 0.88,
                "reason": "Aligns with your planetary science interests"
            },
            {
                "name": "James Webb Space Telescope",
                "type": "Space Observatory",
                "description": "Advanced space telescope for deep space observations",
                "relevance_score": 0.85,
                "reason": "Perfect for your astronomy focus"
            }
        ]
        
        reasoning = f"Based on your interests in {', '.join(request.user_profile.interests)} and {request.user_profile.experience_level} experience level, these missions align with your profile."
        
        return RecommendationResponse(
            recommendations=recommendations,
            reasoning=reasoning,
            confidence=0.87
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mission recommendation failed: {str(e)}")

@router.post("/datasets", response_model=RecommendationResponse)
async def recommend_datasets(request: DatasetRecommendationRequest):
    """Recommend relevant datasets based on user interests."""
    try:
        # Placeholder dataset recommendations
        recommendations = [
            {
                "name": "NASA Exoplanet Archive",
                "type": "Astronomical Data",
                "description": "Comprehensive database of confirmed exoplanets",
                "size": "~5,000 confirmed exoplanets",
                "relevance_score": 0.90,
                "access_url": "https://exoplanetarchive.ipac.caltech.edu/"
            },
            {
                "name": "SpaceX Launch Data",
                "type": "Launch Records",
                "description": "Historical data on SpaceX missions and outcomes",
                "size": "200+ launches",
                "relevance_score": 0.85,
                "access_url": "https://api.spacexdata.com/"
            },
            {
                "name": "Solar Wind Data",
                "type": "Space Weather",
                "description": "Real-time and historical solar wind measurements",
                "size": "Continuous data since 1995",
                "relevance_score": 0.78,
                "access_url": "https://omniweb.gsfc.nasa.gov/"
            }
        ]
        
        reasoning = f"These datasets complement your interests in {', '.join(request.user_profile.preferred_topics)} and provide rich data for analysis."
        
        return RecommendationResponse(
            recommendations=recommendations,
            reasoning=reasoning,
            confidence=0.82
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dataset recommendation failed: {str(e)}")

@router.get("/trending")
async def get_trending_topics():
    """Get currently trending space topics and discoveries."""
    try:
        trending = {
            "topics": [
                {
                    "name": "Artemis Moon Mission Updates",
                    "category": "Space Exploration",
                    "trend_score": 0.95,
                    "description": "Latest developments in NASA's lunar program"
                },
                {
                    "name": "Mars Helicopter Achievements",
                    "category": "Mars Exploration",
                    "trend_score": 0.88,
                    "description": "Ingenuity helicopter's continued success on Mars"
                },
                {
                    "name": "James Webb Telescope Discoveries",
                    "category": "Astronomy",
                    "trend_score": 0.92,
                    "description": "New cosmic discoveries and stunning images"
                },
                {
                    "name": "Commercial Space Tourism",
                    "category": "Commercial Space",
                    "trend_score": 0.76,
                    "description": "Growth in civilian space travel opportunities"
                }
            ],
            "updated_at": "2025-10-07T00:00:00Z",
            "data_sources": ["NASA News", "SpaceX Updates", "ESA Publications"]
        }
        
        return trending
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch trending topics: {str(e)}")
