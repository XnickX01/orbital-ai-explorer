from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import search, insights, similar
import uvicorn

app = FastAPI(
    title="Orbital AI Explorer - FastAPI",
    description="AI-powered search and vector similarity for space data",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Orbital AI Explorer - FastAPI AI Service",
        "version": "1.0.0",
        "endpoints": {
            "search": "/search",
            "insights": "/insights/{data_type}/{id}",
            "similar": "/similar/{data_type}/{id}"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers
app.include_router(search.router, prefix="/search", tags=["search"])
app.include_router(insights.router, prefix="/insights", tags=["insights"])
app.include_router(similar.router, prefix="/similar", tags=["similar"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
