# ML Service Architecture

## Tech Stack

- **Language**: Python (>=3.9)
- **Framework**: FastAPI
- **Server**: Uvicorn

## Core Functionality

- **RAG (Retrieval-Augmented Generation)**:
  - **Vector Store**: ChromaDB (`chromadb`)
  - **Embeddings**: Sentence Transformers (`sentence-transformers`)
  - **ML Logic**: PyTorch (`torch`)

## Purpose

Provides specialized ML capabilities, specifically RAG for document querying and context retrieval, likely supporting the main backend's AI features.

## Files

- `main.py`: FastAPI entrypoint and route definitions.
- `rag.py`: Implementation of the RAG logic.
