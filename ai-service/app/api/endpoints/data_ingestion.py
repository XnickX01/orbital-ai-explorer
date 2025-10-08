from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import asyncio
import aiohttp
import pandas as pd
from datetime import datetime
import json

router = APIRouter()

# NASA API Configuration
NASA_API_KEY = "DEMO_KEY"  # Use DEMO_KEY for testing, get real key from https://api.nasa.gov/
NASA_BASE_URL = "https://api.nasa.gov"

# SpaceX API Configuration  
SPACEX_BASE_URL = "https://api.spacexdata.com/v4"

class DataIngestionRequest(BaseModel):
    sources: List[str]  # ["nasa", "spacex", "faa"]
    date_range: Optional[Dict[str, str]] = None
    data_types: Optional[List[str]] = None

class TrainingDataResponse(BaseModel):
    total_records: int
    sources_processed: List[str]
    data_quality_score: float
    ready_for_training: bool
    sample_data: List[Dict[str, Any]]

@router.post("/ingest-nasa-data", response_model=TrainingDataResponse)
async def ingest_nasa_data(request: DataIngestionRequest):
    """
    Ingest comprehensive NASA data for model training.
    Sources: APOD, NEO, Mars photos, exoplanets, missions, patents
    """
    try:
        collected_data = []
        
        # NASA Astronomy Picture of the Day
        if "apod" in request.data_types or not request.data_types:
            apod_data = await fetch_nasa_apod()
            collected_data.extend(apod_data)
        
        # NASA Near-Earth Objects
        if "neo" in request.data_types or not request.data_types:
            neo_data = await fetch_nasa_neo()
            collected_data.extend(neo_data)
            
        # NASA Mars Rover Photos & Data
        if "mars" in request.data_types or not request.data_types:
            mars_data = await fetch_nasa_mars_data()
            collected_data.extend(mars_data)
            
        # NASA Exoplanet Archive
        if "exoplanets" in request.data_types or not request.data_types:
            exoplanet_data = await fetch_nasa_exoplanets()
            collected_data.extend(exoplanet_data)
            
        # NASA TechPort (Technology Portfolio)
        if "technology" in request.data_types or not request.data_types:
            tech_data = await fetch_nasa_techport()
            collected_data.extend(tech_data)
        
        # Process and structure data for training
        processed_data = await process_nasa_data(collected_data)
        
        return TrainingDataResponse(
            total_records=len(processed_data),
            sources_processed=["NASA APOD", "NASA NEO", "NASA Mars", "NASA Exoplanets", "NASA TechPort"],
            data_quality_score=calculate_data_quality(processed_data),
            ready_for_training=len(processed_data) > 100,
            sample_data=processed_data[:5]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NASA data ingestion failed: {str(e)}")

@router.post("/ingest-spacex-data", response_model=TrainingDataResponse)
async def ingest_spacex_data(request: DataIngestionRequest):
    """
    Ingest comprehensive SpaceX data for model training.
    Sources: Launches, rockets, capsules, crew, payloads, Starlink
    """
    try:
        collected_data = []
        
        # SpaceX Launches (historical and upcoming)
        launches_data = await fetch_spacex_launches()
        collected_data.extend(launches_data)
        
        # SpaceX Rockets and Specifications
        rockets_data = await fetch_spacex_rockets()
        collected_data.extend(rockets_data)
        
        # SpaceX Capsules and Missions
        capsules_data = await fetch_spacex_capsules()
        collected_data.extend(capsules_data)
        
        # SpaceX Crew Information
        crew_data = await fetch_spacex_crew()
        collected_data.extend(crew_data)
        
        # SpaceX Payloads and Customers
        payloads_data = await fetch_spacex_payloads()
        collected_data.extend(payloads_data)
        
        # SpaceX Starlink Satellites
        starlink_data = await fetch_spacex_starlink()
        collected_data.extend(starlink_data)
        
        # Process data for training
        processed_data = await process_spacex_data(collected_data)
        
        return TrainingDataResponse(
            total_records=len(processed_data),
            sources_processed=["SpaceX Launches", "SpaceX Rockets", "SpaceX Capsules", "SpaceX Crew", "SpaceX Payloads", "SpaceX Starlink"],
            data_quality_score=calculate_data_quality(processed_data),
            ready_for_training=len(processed_data) > 50,
            sample_data=processed_data[:5]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SpaceX data ingestion failed: {str(e)}")

@router.get("/training-datasets")
async def get_available_training_datasets():
    """Get information about available training datasets."""
    return {
        "nasa_datasets": {
            "apod": "Astronomy Picture of the Day with descriptions",
            "neo": "Near-Earth Objects database", 
            "mars": "Mars rover photos and mission data",
            "exoplanets": "Confirmed exoplanet discoveries",
            "techport": "NASA technology portfolio",
            "patents": "NASA patents and innovations"
        },
        "spacex_datasets": {
            "launches": "Historical and upcoming launch data",
            "rockets": "Rocket specifications and capabilities",
            "capsules": "Dragon capsule mission history",
            "crew": "Astronaut and crew information",
            "payloads": "Satellite and payload data",
            "starlink": "Starlink constellation status"
        },
        "faa_datasets": {
            "licenses": "Commercial space flight licenses",
            "safety": "Space flight safety reports",
            "environmental": "Environmental impact assessments"
        },
        "recommended_training_pipeline": [
            "1. Ingest NASA and SpaceX data",
            "2. Create vector embeddings for semantic search",
            "3. Fine-tune model on space industry corpus",
            "4. Implement real-time learning from new data"
        ]
    }

# Helper functions for data fetching
async def fetch_nasa_apod(limit: int = 100) -> List[Dict]:
    """Fetch NASA Astronomy Picture of the Day data."""
    async with aiohttp.ClientSession() as session:
        url = f"{NASA_BASE_URL}/planetary/apod"
        params = {"api_key": NASA_API_KEY, "count": limit}
        
        async with session.get(url, params=params) as response:
            if response.status == 200:
                data = await response.json()
                return [
                    {
                        "type": "apod",
                        "title": item.get("title"),
                        "explanation": item.get("explanation"),
                        "date": item.get("date"),
                        "url": item.get("url"),
                        "media_type": item.get("media_type"),
                        "source": "NASA APOD"
                    }
                    for item in data
                ]
            return []

async def fetch_nasa_neo() -> List[Dict]:
    """Fetch NASA Near-Earth Objects data."""
    async with aiohttp.ClientSession() as session:
        url = f"{NASA_BASE_URL}/neo/rest/v1/neo/browse"
        params = {"api_key": NASA_API_KEY}
        
        async with session.get(url, params=params) as response:
            if response.status == 200:
                data = await response.json()
                neo_objects = data.get("near_earth_objects", [])
                return [
                    {
                        "type": "neo",
                        "name": obj.get("name"),
                        "nasa_jpl_url": obj.get("nasa_jpl_url"),
                        "absolute_magnitude": obj.get("absolute_magnitude_h"),
                        "estimated_diameter": obj.get("estimated_diameter"),
                        "potentially_hazardous": obj.get("is_potentially_hazardous_asteroid"),
                        "orbital_data": obj.get("orbital_data"),
                        "source": "NASA NEO"
                    }
                    for obj in neo_objects
                ]
            return []

async def fetch_spacex_launches() -> List[Dict]:
    """Fetch SpaceX launch data."""
    async with aiohttp.ClientSession() as session:
        url = f"{SPACEX_BASE_URL}/launches"
        
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return [
                    {
                        "type": "launch",
                        "name": launch.get("name"),
                        "date_utc": launch.get("date_utc"),
                        "success": launch.get("success"),
                        "details": launch.get("details"),
                        "rocket": launch.get("rocket"),
                        "payloads": launch.get("payloads"),
                        "launchpad": launch.get("launchpad"),
                        "flight_number": launch.get("flight_number"),
                        "links": launch.get("links"),
                        "source": "SpaceX API"
                    }
                    for launch in data
                ]
            return []

async def fetch_spacex_rockets() -> List[Dict]:
    """Fetch SpaceX rocket specifications."""
    async with aiohttp.ClientSession() as session:
        url = f"{SPACEX_BASE_URL}/rockets"
        
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return [
                    {
                        "type": "rocket",
                        "name": rocket.get("name"),
                        "description": rocket.get("description"),
                        "height": rocket.get("height"),
                        "diameter": rocket.get("diameter"),
                        "mass": rocket.get("mass"),
                        "payload_weights": rocket.get("payload_weights"),
                        "first_stage": rocket.get("first_stage"),
                        "second_stage": rocket.get("second_stage"),
                        "engines": rocket.get("engines"),
                        "cost_per_launch": rocket.get("cost_per_launch"),
                        "success_rate_pct": rocket.get("success_rate_pct"),
                        "source": "SpaceX API"
                    }
                    for rocket in data
                ]
            return []

# Additional helper functions
async def fetch_nasa_mars_data() -> List[Dict]:
    """Fetch NASA Mars rover photo data."""
    async with aiohttp.ClientSession() as session:
        url = f"{NASA_BASE_URL}/mars-photos/api/v1/rovers/curiosity/photos"
        params = {
            "api_key": NASA_API_KEY,
            "sol": 1000,  # Martian day
            "page": 1
        }
        
        async with session.get(url, params=params) as response:
            if response.status == 200:
                data = await response.json()
                photos = data.get("photos", [])
                return [
                    {
                        "type": "mars_photo",
                        "id": photo.get("id"),
                        "sol": photo.get("sol"),
                        "camera": photo.get("camera", {}).get("full_name"),
                        "img_src": photo.get("img_src"),
                        "earth_date": photo.get("earth_date"),
                        "rover": photo.get("rover", {}).get("name"),
                        "rover_status": photo.get("rover", {}).get("status"),
                        "landing_date": photo.get("rover", {}).get("landing_date"),
                        "source": "NASA Mars Photos"
                    }
                    for photo in photos[:20]  # Limit to 20 photos
                ]
            return []

async def fetch_nasa_exoplanets() -> List[Dict]:
    """Fetch NASA Exoplanet Archive data."""
    async with aiohttp.ClientSession() as session:
        # Using the NASA Exoplanet Archive API
        url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
        params = {
            "query": "select top 50 pl_name,hostname,disc_year,pl_orbper,pl_rade,pl_masse,st_dist from ps where default_flag=1",
            "format": "json"
        }
        
        async with session.get(url, params=params) as response:
            if response.status == 200:
                data = await response.json()
                return [
                    {
                        "type": "exoplanet",
                        "planet_name": planet.get("pl_name"),
                        "host_star": planet.get("hostname"),
                        "discovery_year": planet.get("disc_year"),
                        "orbital_period": planet.get("pl_orbper"),
                        "planet_radius": planet.get("pl_rade"),
                        "planet_mass": planet.get("pl_masse"),
                        "stellar_distance": planet.get("st_dist"),
                        "source": "NASA Exoplanet Archive"
                    }
                    for planet in data
                ]
            return []

async def fetch_nasa_techport() -> List[Dict]:
    """Fetch NASA TechPort technology data."""
    async with aiohttp.ClientSession() as session:
        url = f"{NASA_BASE_URL}/techport/api/projects"
        params = {"api_key": NASA_API_KEY}
        
        async with session.get(url, params=params) as response:
            if response.status == 200:
                data = await response.json()
                projects = data.get("projects", [])
                
                # Get detailed info for first 10 projects
                detailed_projects = []
                for project in projects[:10]:
                    project_id = project.get("projectId")
                    if project_id:
                        detail_url = f"{NASA_BASE_URL}/techport/api/projects/{project_id}"
                        async with session.get(detail_url, params=params) as detail_response:
                            if detail_response.status == 200:
                                project_detail = await detail_response.json()
                                project_data = project_detail.get("project", {})
                                detailed_projects.append({
                                    "type": "technology",
                                    "project_id": project_data.get("projectId"),
                                    "title": project_data.get("title"),
                                    "description": project_data.get("description"),
                                    "benefits": project_data.get("benefits"),
                                    "status": project_data.get("statusDescription"),
                                    "start_date": project_data.get("startDateString"),
                                    "end_date": project_data.get("endDateString"),
                                    "program": project_data.get("program"),
                                    "source": "NASA TechPort"
                                })
                
                return detailed_projects
            return []

async def fetch_spacex_capsules() -> List[Dict]:
    """Fetch SpaceX Dragon capsule data."""
    async with aiohttp.ClientSession() as session:
        url = f"{SPACEX_BASE_URL}/capsules"
        
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return [
                    {
                        "type": "capsule",
                        "serial": capsule.get("serial"),
                        "status": capsule.get("status"),
                        "type": capsule.get("type"),
                        "reuse_count": capsule.get("reuse_count"),
                        "water_landings": capsule.get("water_landings"),
                        "land_landings": capsule.get("land_landings"),
                        "last_update": capsule.get("last_update"),
                        "launches": capsule.get("launches"),
                        "source": "SpaceX API"
                    }
                    for capsule in data
                ]
            return []

async def fetch_spacex_crew() -> List[Dict]:
    """Fetch SpaceX crew member data."""
    async with aiohttp.ClientSession() as session:
        url = f"{SPACEX_BASE_URL}/crew"
        
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return [
                    {
                        "type": "crew",
                        "name": crew.get("name"),
                        "agency": crew.get("agency"),
                        "image": crew.get("image"),
                        "wikipedia": crew.get("wikipedia"),
                        "launches": crew.get("launches"),
                        "status": crew.get("status"),
                        "source": "SpaceX API"
                    }
                    for crew in data
                ]
            return []

async def fetch_spacex_payloads() -> List[Dict]:
    """Fetch SpaceX payload data."""
    async with aiohttp.ClientSession() as session:
        url = f"{SPACEX_BASE_URL}/payloads"
        
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return [
                    {
                        "type": "payload",
                        "name": payload.get("name"),
                        "type": payload.get("type"),
                        "mass_kg": payload.get("mass_kg"),
                        "mass_lbs": payload.get("mass_lbs"),
                        "orbit": payload.get("orbit"),
                        "reference_system": payload.get("reference_system"),
                        "regime": payload.get("regime"),
                        "longitude": payload.get("longitude"),
                        "semi_major_axis_km": payload.get("semi_major_axis_km"),
                        "eccentricity": payload.get("eccentricity"),
                        "periapsis_km": payload.get("periapsis_km"),
                        "apoapsis_km": payload.get("apoapsis_km"),
                        "inclination_deg": payload.get("inclination_deg"),
                        "period_min": payload.get("period_min"),
                        "lifespan_years": payload.get("lifespan_years"),
                        "epoch": payload.get("epoch"),
                        "mean_motion": payload.get("mean_motion"),
                        "raan": payload.get("raan"),
                        "arg_of_pericenter": payload.get("arg_of_pericenter"),
                        "mean_anomaly": payload.get("mean_anomaly"),
                        "customers": payload.get("customers"),
                        "nationalities": payload.get("nationalities"),
                        "manufacturers": payload.get("manufacturers"),
                        "norad_ids": payload.get("norad_ids"),
                        "launch": payload.get("launch"),
                        "source": "SpaceX API"
                    }
                    for payload in data[:50]  # Limit to 50 payloads
                ]
            return []

async def fetch_spacex_starlink() -> List[Dict]:
    """Fetch SpaceX Starlink satellite data."""
    async with aiohttp.ClientSession() as session:
        url = f"{SPACEX_BASE_URL}/starlink"
        
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return [
                    {
                        "type": "starlink",
                        "spacetrack_id": satellite.get("spaceTrack", {}).get("OBJECT_ID"),
                        "object_name": satellite.get("spaceTrack", {}).get("OBJECT_NAME"),
                        "launch_date": satellite.get("spaceTrack", {}).get("LAUNCH_DATE"),
                        "decay_date": satellite.get("spaceTrack", {}).get("DECAY_DATE"),
                        "object_type": satellite.get("spaceTrack", {}).get("OBJECT_TYPE"),
                        "classification_type": satellite.get("spaceTrack", {}).get("CLASSIFICATION_TYPE"),
                        "norad_cat_id": satellite.get("spaceTrack", {}).get("NORAD_CAT_ID"),
                        "element_set_no": satellite.get("spaceTrack", {}).get("ELEMENT_SET_NO"),
                        "rev_at_epoch": satellite.get("spaceTrack", {}).get("REV_AT_EPOCH"),
                        "bstar": satellite.get("spaceTrack", {}).get("BSTAR"),
                        "mean_motion": satellite.get("spaceTrack", {}).get("MEAN_MOTION"),
                        "eccentricity": satellite.get("spaceTrack", {}).get("ECCENTRICITY"),
                        "inclination": satellite.get("spaceTrack", {}).get("INCLINATION"),
                        "ra_of_asc_node": satellite.get("spaceTrack", {}).get("RA_OF_ASC_NODE"),
                        "arg_of_pericenter": satellite.get("spaceTrack", {}).get("ARG_OF_PERICENTER"),
                        "mean_anomaly": satellite.get("spaceTrack", {}).get("MEAN_ANOMALY"),
                        "ephemeris_type": satellite.get("spaceTrack", {}).get("EPHEMERIS_TYPE"),
                        "launch": satellite.get("launch"),
                        "longitude": satellite.get("longitude"),
                        "latitude": satellite.get("latitude"),
                        "height_km": satellite.get("height_km"),
                        "velocity_kms": satellite.get("velocity_kms"),
                        "source": "SpaceX API"
                    }
                    for satellite in data[:100]  # Limit to 100 satellites for performance
                ]
            return []

async def process_nasa_data(raw_data: List[Dict]) -> List[Dict]:
    """Process and clean NASA data for training."""
    processed = []
    
    for record in raw_data:
        # Clean and standardize data
        cleaned_record = {
            "id": record.get("id") or f"{record.get('type')}_{hash(str(record))}",
            "type": record.get("type"),
            "source": record.get("source"),
            "timestamp": datetime.now().isoformat(),
            "data": {}
        }
        
        # Type-specific processing
        if record.get("type") == "apod":
            cleaned_record["data"] = {
                "title": record.get("title"),
                "description": record.get("explanation"),
                "date": record.get("date"),
                "media_url": record.get("url"),
                "media_type": record.get("media_type")
            }
            cleaned_record["text_content"] = f"NASA Astronomy Picture: {record.get('title')}. {record.get('explanation')}"
            
        elif record.get("type") == "neo":
            cleaned_record["data"] = {
                "name": record.get("name"),
                "hazardous": record.get("potentially_hazardous"),
                "magnitude": record.get("absolute_magnitude"),
                "diameter": record.get("estimated_diameter"),
                "orbital_info": record.get("orbital_data")
            }
            cleaned_record["text_content"] = f"Near-Earth Object: {record.get('name')}. Potentially hazardous: {record.get('potentially_hazardous')}. Magnitude: {record.get('absolute_magnitude')}"
            
        elif record.get("type") == "mars_photo":
            cleaned_record["data"] = {
                "sol": record.get("sol"),
                "camera": record.get("camera"),
                "rover": record.get("rover"),
                "earth_date": record.get("earth_date"),
                "image_url": record.get("img_src")
            }
            cleaned_record["text_content"] = f"Mars photo from {record.get('rover')} rover on sol {record.get('sol')} using {record.get('camera')} camera"
            
        elif record.get("type") == "exoplanet":
            cleaned_record["data"] = {
                "planet_name": record.get("planet_name"),
                "host_star": record.get("host_star"),
                "discovery_year": record.get("discovery_year"),
                "orbital_period": record.get("orbital_period"),
                "radius": record.get("planet_radius"),
                "mass": record.get("planet_mass"),
                "distance": record.get("stellar_distance")
            }
            cleaned_record["text_content"] = f"Exoplanet {record.get('planet_name')} orbiting {record.get('host_star')}, discovered in {record.get('discovery_year')}"
            
        elif record.get("type") == "technology":
            cleaned_record["data"] = {
                "title": record.get("title"),
                "description": record.get("description"),
                "benefits": record.get("benefits"),
                "status": record.get("status"),
                "program": record.get("program")
            }
            cleaned_record["text_content"] = f"NASA Technology: {record.get('title')}. {record.get('description')} Benefits: {record.get('benefits')}"
        
        if cleaned_record["text_content"]:  # Only add if we have meaningful text content
            processed.append(cleaned_record)
    
    return processed

async def process_spacex_data(raw_data: List[Dict]) -> List[Dict]:
    """Process and clean SpaceX data for training."""
    processed = []
    
    for record in raw_data:
        # Clean and standardize data
        cleaned_record = {
            "id": record.get("id") or f"{record.get('type')}_{hash(str(record))}",
            "type": record.get("type"),
            "source": record.get("source"),
            "timestamp": datetime.now().isoformat(),
            "data": {},
            "text_content": ""
        }
        
        # Type-specific processing
        if record.get("type") == "launch":
            cleaned_record["data"] = {
                "name": record.get("name"),
                "date": record.get("date_utc"),
                "success": record.get("success"),
                "details": record.get("details"),
                "flight_number": record.get("flight_number"),
                "rocket": record.get("rocket"),
                "payloads": record.get("payloads")
            }
            success_text = "successful" if record.get("success") else "unsuccessful" if record.get("success") is False else "pending"
            cleaned_record["text_content"] = f"SpaceX Launch: {record.get('name')} - Flight #{record.get('flight_number')} was {success_text}. {record.get('details') or ''}"
            
        elif record.get("type") == "rocket":
            cleaned_record["data"] = {
                "name": record.get("name"),
                "description": record.get("description"),
                "height": record.get("height"),
                "diameter": record.get("diameter"),
                "mass": record.get("mass"),
                "cost_per_launch": record.get("cost_per_launch"),
                "success_rate": record.get("success_rate_pct")
            }
            cleaned_record["text_content"] = f"SpaceX Rocket: {record.get('name')}. {record.get('description')} Success rate: {record.get('success_rate_pct')}%"
            
        elif record.get("type") == "capsule":
            cleaned_record["data"] = {
                "serial": record.get("serial"),
                "status": record.get("status"),
                "type": record.get("type"),
                "reuse_count": record.get("reuse_count"),
                "water_landings": record.get("water_landings"),
                "land_landings": record.get("land_landings")
            }
            cleaned_record["text_content"] = f"SpaceX Capsule {record.get('serial')} ({record.get('type')}) - Status: {record.get('status')}, Reused {record.get('reuse_count')} times"
            
        elif record.get("type") == "crew":
            cleaned_record["data"] = {
                "name": record.get("name"),
                "agency": record.get("agency"),
                "status": record.get("status"),
                "launches": record.get("launches")
            }
            cleaned_record["text_content"] = f"SpaceX Crew Member: {record.get('name')} from {record.get('agency')} - Status: {record.get('status')}"
            
        elif record.get("type") == "payload":
            cleaned_record["data"] = {
                "name": record.get("name"),
                "type": record.get("type"),
                "mass_kg": record.get("mass_kg"),
                "orbit": record.get("orbit"),
                "customers": record.get("customers"),
                "manufacturers": record.get("manufacturers")
            }
            customers = ", ".join(record.get("customers", [])) if record.get("customers") else "Unknown"
            cleaned_record["text_content"] = f"SpaceX Payload: {record.get('name')} ({record.get('type')}) - Mass: {record.get('mass_kg')}kg, Customers: {customers}"
            
        elif record.get("type") == "starlink":
            cleaned_record["data"] = {
                "object_name": record.get("object_name"),
                "launch_date": record.get("launch_date"),
                "height_km": record.get("height_km"),
                "velocity_kms": record.get("velocity_kms"),
                "longitude": record.get("longitude"),
                "latitude": record.get("latitude")
            }
            cleaned_record["text_content"] = f"Starlink Satellite: {record.get('object_name')} at {record.get('height_km')}km altitude, velocity {record.get('velocity_kms')}km/s"
        
        if cleaned_record["text_content"]:  # Only add if we have meaningful text content
            processed.append(cleaned_record)
    
    return processed

def calculate_data_quality(data: List[Dict]) -> float:
    """Calculate data quality score based on completeness and consistency."""
    if not data:
        return 0.0
    
    total_score = 0.0
    for record in data:
        score = 0.0
        
        # Check required fields
        if record.get("id"):
            score += 0.2
        if record.get("type"):
            score += 0.2
        if record.get("source"):
            score += 0.2
        if record.get("text_content"):
            score += 0.2
        if record.get("data") and isinstance(record["data"], dict) and record["data"]:
            score += 0.2
        
        total_score += score
    
    return total_score / len(data) if data else 0.0
