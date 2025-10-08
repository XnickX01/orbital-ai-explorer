from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.services.vector_search import vector_search_service

router = APIRouter()

@router.get("/{data_type}/{id}")
async def find_similar(data_type: str, id: str, db: Session = Depends(get_db)):
    """
    Find similar launches, rockets, or missions using vector similarity search.
    """
    try:
        if data_type == "launch":
            # Verify the launch exists
            result = db.execute(
                "SELECT id FROM launches WHERE id = :id",
                {"id": id}
            ).fetchone()
            
            if not result:
                raise HTTPException(status_code=404, detail="Launch not found")
            
            similar = vector_search_service.find_similar_launches(id)
            return {"similar_launches": similar}
        
        elif data_type == "rocket":
            # Verify the rocket exists
            result = db.execute(
                "SELECT id FROM rockets WHERE id = :id",
                {"id": id}
            ).fetchone()
            
            if not result:
                raise HTTPException(status_code=404, detail="Rocket not found")
            
            similar = vector_search_service.find_similar_rockets(id)
            return {"similar_rockets": similar}
        
        elif data_type == "mission":
            # Verify the mission exists
            result = db.execute(
                "SELECT id FROM missions WHERE id = :id",
                {"id": id}
            ).fetchone()
            
            if not result:
                raise HTTPException(status_code=404, detail="Mission not found")
            
            # For now, return empty list - would implement vector search in production
            return {"similar_missions": []}
        
        else:
            raise HTTPException(status_code=400, detail="Invalid data type")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to find similar items: {str(e)}")
