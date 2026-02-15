import os
from typing import Dict, List, Optional

import uvicorn
from app.rag import RAGEngine
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="AIGestion NeuroCore", description="Neural Engine for RAG and Deep Learning")

# Security Configuration
API_KEY = os.getenv("ML_SERVICE_API_KEY", "LOCAL_DEV_SECRET_KEY_REPLACE_ME")
ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    os.getenv("BACKEND_URL", "http://localhost:5000"),
]

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Authentication Dependency
async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid or missing API Key")
    return x_api_key


# Initialize RAG Engine
rag_engine = None

@app.on_event("startup")
async def startup_event():
    global rag_engine
    # Use the shared data directory for persistence
    # Default is the shared assets repo, but configurable via env
    persist_dir = os.getenv("CHROMA_PERSIST_DIR", "../assets/data/chromadb")
    rag_engine = RAGEngine(persist_directory=persist_dir)

class ArchiveRequest(BaseModel):
    content: str
    source: str = "user-input"
    tags: List[str] = []

class SearchRequest(BaseModel):
    query: str
    limit: int = 3

class SearchResponse(BaseModel):
    query: str
    results: List[Dict]

@app.get("/")
def read_root():
    return {"status": "online", "service": "AIGestion NeuroCore (RAG)"}


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "rag_engine": "ready" if rag_engine else "initializing",
    }


@app.post("/archive")
async def archive_knowledge(
    request: ArchiveRequest, api_key: str = Depends(verify_api_key)
):
    """
    Memorize information (archive).
    """
    if not request.content:
        raise HTTPException(status_code=400, detail="Content cannot be empty")

    metadata = {
        "source": request.source,
        "tags": ",".join(request.tags)
    }

    chunks_count = rag_engine.archive(request.content, metadata)
    return {"status": "archived", "chunks_added": chunks_count, "size": len(request.content)}


@app.post("/recall")
async def recall_knowledge(
    request: SearchRequest, api_key: str = Depends(verify_api_key)
):
    """
    Retrieve information (recall).
    """
    results = rag_engine.retrieve(request.query, n_results=request.limit)
    return SearchResponse(query=request.query, results=results)


@app.post("/forget")
async def forget_all(api_key: str = Depends(verify_api_key)):
    """
    Wipe memory. DANGEROUS.
    """
    rag_engine.wipe_memory()
    return {"status": "memory_wiped"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5000, reload=True)
