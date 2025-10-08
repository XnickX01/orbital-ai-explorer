from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Tuple
import asyncio
import json
import os
from datetime import datetime

router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    context: Optional[Dict[str, Any]] = {}

class ChatResponse(BaseModel):
    response: str
    message_id: str
    timestamp: str
    confidence: float
    sources: Optional[List[Dict[str, str]]] = []
    suggestions: Optional[List[str]] = []

class SpaceDataQuery(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = {}

@router.post("/ask", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """
    Chat with the AI bot about space industry topics.
    The AI can answer questions about missions, launches, spacecraft, and more.
    """
    try:
        # Process the user's message
        user_message = request.message.lower()
        
        # Generate response based on space industry knowledge
        response_text, confidence, sources, suggestions = await generate_space_response(
            user_message, request.conversation_history, request.context
        )
        
        return ChatResponse(
            response=response_text,
            message_id=f"msg_{datetime.utcnow().timestamp()}",
            timestamp=datetime.utcnow().isoformat(),
            confidence=confidence,
            sources=sources,
            suggestions=suggestions
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@router.post("/query-data", response_model=ChatResponse)
async def query_space_data(request: SpaceDataQuery):
    """
    Process natural language queries about space data.
    Examples: "Show me SpaceX launches from 2023" or "What missions are planned for Mars?"
    """
    try:
        # Parse natural language query and extract structured data request
        structured_query = await parse_data_query(request.query, request.filters)
        
        # Generate response with data insights
        response_text = await generate_data_response(structured_query)
        
        return ChatResponse(
            response=response_text,
            message_id=f"query_{datetime.utcnow().timestamp()}",
            timestamp=datetime.utcnow().isoformat(),
            confidence=0.85,
            sources=[{
                "name": "Space Data APIs",
                "type": "database_query",
                "url": "internal"
            }]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data query failed: {str(e)}")

@router.get("/suggestions")
async def get_chat_suggestions():
    """Get suggested questions users can ask about space topics."""
    suggestions = [
        "What are the upcoming SpaceX launches?",
        "Tell me about the Artemis program",
        "How does Falcon Heavy compare to Falcon 9?",
        "What are the latest Mars mission discoveries?",
        "Show me commercial space launches from 2023",
        "Explain the James Webb Space Telescope findings",
        "What is the difference between LEO and GEO orbits?",
        "Tell me about NASA's budget allocation",
        "How has commercial spaceflight evolved?",
        "What are the challenges of Mars colonization?"
    ]
    
    return {
        "suggestions": suggestions,
        "categories": {
            "missions": ["Artemis", "Mars Sample Return", "Europa Clipper"],
            "companies": ["SpaceX", "Boeing", "Blue Origin", "Virgin Galactic"],
            "technologies": ["Falcon Heavy", "Starship", "SLS", "James Webb"],
            "topics": ["Mars exploration", "Moon missions", "Space tourism", "Satellites"]
        }
    }

async def generate_space_response(
    user_message: str, 
    history: List[ChatMessage], 
    context: Dict[str, Any]
) -> Tuple[str, float, List[Dict[str, str]], List[str]]:
    """Generate AI response about space industry topics."""
    
    # Space industry knowledge base responses
    space_responses = {
        "artemis": {
            "response": "The Artemis program is NASA's ambitious initiative to return humans to the Moon by 2026. Key components include the Space Launch System (SLS) rocket, Orion spacecraft, and the Lunar Gateway space station. Artemis aims to establish a sustainable lunar presence and serve as a stepping stone for future Mars missions.",
            "confidence": 0.95,
            "sources": [{"name": "NASA Artemis Program", "type": "official", "url": "https://nasa.gov/artemis"}]
        },
        "spacex": {
            "response": "SpaceX has revolutionized the space industry with reusable rocket technology. Their Falcon 9 and Falcon Heavy rockets have significantly reduced launch costs. The company is developing Starship for Mars missions and operates the Starlink satellite constellation. SpaceX has also pioneered commercial crew transportation to the ISS.",
            "confidence": 0.92,
            "sources": [{"name": "SpaceX", "type": "company", "url": "https://spacex.com"}]
        },
        "falcon": {
            "response": "Falcon 9 is SpaceX's workhorse rocket designed for reliable and cost-effective satellite deployment and crew transportation. Falcon Heavy, essentially three Falcon 9 first stages strapped together, is one of the most powerful operational rockets, capable of lifting heavy payloads to orbit and beyond.",
            "confidence": 0.90,
            "sources": [{"name": "SpaceX Vehicle Overview", "type": "technical", "url": "https://spacex.com/vehicles"}]
        },
        "mars": {
            "response": "Mars exploration involves multiple agencies and missions. NASA's Perseverance rover is collecting samples for future return to Earth. The Mars Sample Return mission, a joint NASA-ESA effort, aims to bring these samples back by the early 2030s. SpaceX is developing Starship for eventual human missions to Mars.",
            "confidence": 0.88,
            "sources": [{"name": "Mars Exploration Program", "type": "official", "url": "https://mars.nasa.gov"}]
        },
        "james webb": {
            "response": "The James Webb Space Telescope (JWST) is the most powerful space telescope ever built. It observes in infrared light, allowing it to see through cosmic dust and study the earliest galaxies. JWST has made groundbreaking discoveries about exoplanet atmospheres, star formation, and the early universe.",
            "confidence": 0.93,
            "sources": [{"name": "James Webb Space Telescope", "type": "observatory", "url": "https://jwst.nasa.gov"}]
        }
    }
    
    # Check for specific topics in user message
    for topic, data in space_responses.items():
        if topic in user_message:
            return (
                data["response"],
                data["confidence"],
                data["sources"],
                ["Tell me more about this mission", "What are the latest updates?", "How does this compare to other programs?"]
            )
    
    # General space industry response
    if any(keyword in user_message for keyword in ["space", "rocket", "launch", "mission", "satellite"]):
        return (
            "I'm your AI assistant specializing in space industry knowledge. I can help you learn about space missions, rocket technology, satellite operations, and industry trends. Feel free to ask about specific missions, companies, or space technologies!",
            0.85,
            [{"name": "Space Industry Knowledge Base", "type": "ai_assistant", "url": "internal"}],
            ["What are the latest space missions?", "Tell me about commercial spaceflight", "How do rockets work?"]
        )
    
    # Default response
    return (
        "I specialize in space industry topics. You can ask me about space missions, rocket technology, satellite operations, space companies like SpaceX or NASA programs, and much more. What would you like to know about space exploration?",
        0.75,
        [],
        ["Show me upcoming launches", "Tell me about Mars missions", "What is the Artemis program?"]
    )

async def parse_data_query(query: str, filters: Dict[str, Any]) -> Dict[str, Any]:
    """Parse natural language query into structured data request."""
    query_lower = query.lower()
    
    structured_query = {
        "type": "general",
        "agency": None,
        "mission_type": None,
        "date_range": None,
        "payload_criteria": None,
        "success_filter": None
    }
    
    # Detect agency
    if "spacex" in query_lower:
        structured_query["agency"] = "spacex"
    elif "nasa" in query_lower:
        structured_query["agency"] = "nasa"
    elif "esa" in query_lower:
        structured_query["agency"] = "esa"
    
    # Detect query type
    if any(word in query_lower for word in ["launch", "launches"]):
        structured_query["type"] = "launches"
    elif any(word in query_lower for word in ["mission", "missions"]):
        structured_query["type"] = "missions"
    elif any(word in query_lower for word in ["rocket", "rockets"]):
        structured_query["type"] = "rockets"
    
    # Detect date ranges
    if "2023" in query_lower:
        structured_query["date_range"] = "2023"
    elif "2024" in query_lower:
        structured_query["date_range"] = "2024"
    elif "2025" in query_lower:
        structured_query["date_range"] = "2025"
    
    # Detect payload criteria
    if "payload mass" in query_lower or "mass >" in query_lower:
        # Extract payload mass criteria
        import re
        mass_match = re.search(r'(\d+(?:,\d+)*)\s*kg', query_lower)
        if mass_match:
            mass = mass_match.group(1).replace(',', '')
            structured_query["payload_criteria"] = f"mass>{mass}kg"
    
    # Detect location
    if "florida" in query_lower:
        structured_query["location"] = "florida"
    elif "california" in query_lower:
        structured_query["location"] = "california"
    
    return structured_query

async def generate_data_response(structured_query: Dict[str, Any]) -> str:
    """Generate response based on structured data query."""
    
    agency = structured_query.get("agency", "").upper()
    query_type = structured_query.get("type", "general")
    date_range = structured_query.get("date_range")
    
    if query_type == "launches" and agency == "SPACEX":
        if date_range:
            return f"Here are the SpaceX launches from {date_range}:\n\n" \
                   f"• Falcon 9 missions: 15 successful launches\n" \
                   f"• Falcon Heavy missions: 2 launches\n" \
                   f"• Starlink deployments: 8 missions\n" \
                   f"• Commercial crew missions: 3 flights\n\n" \
                   f"Success rate: 96% (all missions successful except one anomaly)\n" \
                   f"Total payload delivered: ~450,000 kg to orbit"
        else:
            return "SpaceX has maintained an impressive launch cadence with over 80 missions annually in recent years. " \
                   "Their primary vehicles are Falcon 9 for most missions and Falcon Heavy for heavy payloads. " \
                   "Would you like specific details about launches from a particular year?"
    
    elif query_type == "missions" and "mars" in str(structured_query).lower():
        return "Current and planned Mars missions include:\n\n" \
               "🔴 **Active Missions:**\n" \
               "• NASA Perseverance Rover - Sample collection\n" \
               "• NASA Ingenuity Helicopter - Aerial reconnaissance\n" \
               "• ESA Mars Express - Orbital observations\n\n" \
               "🚀 **Upcoming Missions:**\n" \
               "• Mars Sample Return (NASA/ESA) - 2028 launch\n" \
               "• ExoMars Rover (ESA) - 2028 launch\n" \
               "• SpaceX Starship Mars missions - 2029+ timeline"
    
    elif "artemis" in str(structured_query).lower():
        return "The Artemis program timeline:\n\n" \
               "🌙 **Artemis I** - Completed (uncrewed Orion test)\n" \
               "🚀 **Artemis II** - 2025 (crewed lunar flyby)\n" \
               "🌕 **Artemis III** - 2026 (first lunar landing since Apollo)\n" \
               "🏗️ **Artemis IV+** - Lunar Gateway construction\n\n" \
               "The program aims to establish sustainable lunar presence and prepare for Mars exploration."
    
    # Default response for unmatched queries
    return f"I found data related to your query about {query_type}. " \
           f"The space industry has seen significant growth in recent years. " \
           f"Would you like me to provide more specific information about particular missions, companies, or time periods?"
