from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.services.ai_insights import ai_insights_service

router = APIRouter()

@router.get("/{data_type}/{id}")
async def get_insights(data_type: str, id: str, db: Session = Depends(get_db)):
    """
    Get AI-powered insights for a specific launch, rocket, or mission.
    """
    try:
        if data_type == "launch":
            result = db.execute(
                "SELECT * FROM launches WHERE id = :id",
                {"id": id}
            ).fetchone()
            
            if not result:
                raise HTTPException(status_code=404, detail="Launch not found")
            
            launch_data = {
                "id": result[0],
                "name": result[1],
                "date": result[2],
                "rocket": result[3],
                "success": result[4],
                "details": result[5]
            }
            
            return ai_insights_service.generate_launch_insights(launch_data)
        
        elif data_type == "rocket":
            result = db.execute(
                "SELECT * FROM rockets WHERE id = :id",
                {"id": id}
            ).fetchone()
            
            if not result:
                raise HTTPException(status_code=404, detail="Rocket not found")
            
            rocket_data = {
                "id": result[0],
                "name": result[1],
                "type": result[2],
                "company": result[10],
                "success_rate_pct": result[7],
                "description": result[14]
            }
            
            return ai_insights_service.generate_rocket_insights(rocket_data)
        
        elif data_type == "mission":
            result = db.execute(
                "SELECT * FROM missions WHERE id = :id",
                {"id": id}
            ).fetchone()
            
            if not result:
                raise HTTPException(status_code=404, detail="Mission not found")
            
            mission_data = {
                "id": result[0],
                "name": result[1],
                "description": result[2],
                "start_date": result[3],
                "objectives": result[6] if result[6] else []
            }
            
            return ai_insights_service.generate_mission_insights(mission_data)
        
        else:
            raise HTTPException(status_code=400, detail="Invalid data type")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")
