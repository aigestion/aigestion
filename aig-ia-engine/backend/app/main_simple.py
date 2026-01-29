from app.api import routes
from app.api.daniela_routes import router as daniela_router
from app.config import get_settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.APP_DEBUG,
    version="0.1.0",
    description="AIGestion IA Engine - Clowd-Safe Browser Service + Daniela Enhanced",
)

# CORS
origins = settings.ALLOWED_HOSTS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(routes.router)
app.include_router(daniela_router)

# Health endpoint
@app.get("/health")
async def health():
    """Basic health check."""
    return {"status": "ok", "service": "aigestion-ia-engine"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.APP_DEBUG,
    )
