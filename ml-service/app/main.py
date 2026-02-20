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
API_KEY = os.getenv("ML_SERVICE_API_KEY", "LOCAL_DEV_SECRET_KEY_REPLACE_ME").strip()
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


# Initialize RAG Engine and Whisper Model
rag_engine = None
whisper_model = None

@app.on_event("startup")
async def startup_event():
    global rag_engine, whisper_model
    # Use the shared data directory for persistence
    persist_dir = os.getenv("CHROMA_PERSIST_DIR", "../assets/data/chromadb")
    rag_engine = RAGEngine(persist_directory=persist_dir)

    # Initialize Faster Whisper (lazy loading could be better, but eager is fine for now)
    try:
        from faster_whisper import WhisperModel

        model_size = os.getenv("WHISPER_MODEL_SIZE", "tiny")
        # Run on CPU by default for compatibility, change to "cuda" if GPU available
        whisper_model = WhisperModel(model_size, device="cpu", compute_type="int8")
        print(f"Whisper Model ({model_size}) initialized on CPU.")
    except Exception as e:
        print(f"Failed to initialize Whisper: {e}")

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
    return {"status": "online", "service": "AIGestion NeuroCore (RAG + Whisper)"}


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "rag_engine": "ready" if rag_engine else "initializing",
        "whisper": "ready" if whisper_model else "offline",
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

# --- Whisper Endpoint ---
from fastapi import UploadFile, File
import shutil
import tempfile


@app.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...), api_key: str = Depends(verify_api_key)
):
    """
    Transcribe audio file using Faster Whisper.
    """
    if not whisper_model:
        raise HTTPException(status_code=503, detail="Whisper model not initialized")

    # Save temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        segments, info = whisper_model.transcribe(tmp_path, beam_size=5)
        text = " ".join([segment.text for segment in segments])

        return {
            "transcription": text.strip(),
            "language": info.language,
            "probability": info.language_probability,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
