from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Launch(BaseModel):
    id: str
    name: str
    date: datetime
    rocket: str
    success: bool
    details: Optional[str] = None
    launchpad: Optional[str] = None
    crew: Optional[List[str]] = None

class Rocket(BaseModel):
    id: str
    name: str
    type: str
    active: bool
    stages: int
    boosters: int
    cost_per_launch: float
    success_rate_pct: float
    first_flight: str
    country: str
    company: str
    height: float
    diameter: float
    mass: float
    description: Optional[str] = None

class Mission(BaseModel):
    id: str
    name: str
    description: str
    start_date: datetime
    end_date: Optional[datetime] = None
    spacecraft: Optional[str] = None
    objectives: Optional[List[str]] = None

class SearchFilters(BaseModel):
    dateFrom: Optional[str] = None
    dateTo: Optional[str] = None
    rocketType: Optional[str] = None
    successOnly: Optional[bool] = None

class SearchQuery(BaseModel):
    query: str
    filters: Optional[SearchFilters] = None

class SearchResult(BaseModel):
    launches: List[Launch] = []
    rockets: List[Rocket] = []
    missions: List[Mission] = []
    totalResults: int
