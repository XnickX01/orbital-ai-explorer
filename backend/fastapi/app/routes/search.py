from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.schemas import SearchQuery, SearchResult, Launch, Rocket, Mission
from app.config.database import get_db
from app.services.vector_search import vector_search_service
from typing import List

router = APIRouter()

@router.post("/", response_model=SearchResult)
async def search_space_data(query: SearchQuery, db: Session = Depends(get_db)):
    """
    AI-powered natural language search for space data.
    Searches across launches, rockets, and missions using semantic similarity.
    """
    try:
        # Use raw SQL for now - would use vector embeddings in production
        search_term = f"%{query.query.lower()}%"
        
        # Search launches
        launch_results = db.execute(
            """SELECT * FROM launches 
               WHERE LOWER(name) LIKE :term 
               OR LOWER(details) LIKE :term 
               ORDER BY date DESC LIMIT 20""",
            {"term": search_term}
        ).fetchall()
        
        launches = [
            Launch(
                id=row[0],
                name=row[1],
                date=row[2],
                rocket=row[3],
                success=row[4],
                details=row[5],
                launchpad=row[6],
                crew=row[7] if row[7] else []
            )
            for row in launch_results
        ]
        
        # Search rockets
        rocket_results = db.execute(
            """SELECT * FROM rockets 
               WHERE LOWER(name) LIKE :term 
               OR LOWER(description) LIKE :term 
               OR LOWER(company) LIKE :term 
               LIMIT 20""",
            {"term": search_term}
        ).fetchall()
        
        rockets = [
            Rocket(
                id=row[0],
                name=row[1],
                type=row[2],
                active=row[3],
                stages=row[4],
                boosters=row[5],
                cost_per_launch=row[6],
                success_rate_pct=row[7],
                first_flight=row[8],
                country=row[9],
                company=row[10],
                height=row[11],
                diameter=row[12],
                mass=row[13],
                description=row[14]
            )
            for row in rocket_results
        ]
        
        # Search missions
        mission_results = db.execute(
            """SELECT * FROM missions 
               WHERE LOWER(name) LIKE :term 
               OR LOWER(description) LIKE :term 
               LIMIT 20""",
            {"term": search_term}
        ).fetchall()
        
        missions = [
            Mission(
                id=row[0],
                name=row[1],
                description=row[2],
                start_date=row[3],
                end_date=row[4],
                spacecraft=row[5],
                objectives=row[6] if row[6] else []
            )
            for row in mission_results
        ]
        
        total_results = len(launches) + len(rockets) + len(missions)
        
        return SearchResult(
            launches=launches,
            rockets=rockets,
            missions=missions,
            totalResults=total_results
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
