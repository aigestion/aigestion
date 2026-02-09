import os
import sys
import glob
from pathlib import Path

# Add ml-service to path to import RAGEngine
# Assuming we are running from root or scripts/
current_dir = Path(__file__).resolve().parent
root_dir = current_dir.parent
ml_service_path = root_dir / 'ml-service' / 'app'
sys.path.append(str(ml_service_path))

try:
    from rag import RAGEngine
except ImportError as e:
    print(f"Error importing RAGEngine: {e}")
    print(f"sys.path: {sys.path}")
    sys.exit(1)

def main():
    print("Starting RAG Database Update...")

    # Initialize Engine
    # Persist in data/chromadb to be persistent across runs
    persist_dir = root_dir / 'data' / 'chromadb'
    engine = RAGEngine(persist_directory=str(persist_dir))

    # Directories to scan
    scan_dirs = [
        root_dir / 'docs',
        root_dir / 'workspace-config'
    ]

    md_files = []
    for d in scan_dirs:
        if d.exists():
            md_files.extend(list(d.rglob('*.md')))
        else:
            print(f"Warning: Directory {d} does not exist.")

    # Also look for loose .md files in root (ignoring node_modules, etc)
    root_md = list(root_dir.glob('*.md'))
    for f in root_md:
        if f.name.lower() not in ['readme.md', 'license.md']:
            md_files.append(f)

    print(f"Found {len(md_files)} markdown files to process.")

    count = 0
    total_chunks = 0

    for file_path in md_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            if not content.strip():
                continue

            # Create metadata
            rel_path = file_path.relative_to(root_dir)
            metadata = {
                'source': str(rel_path),
                'filename': file_path.name,
                'type': 'documentation'
            }

            # Ingest
            num_chunks = engine.archive(content, metadata=metadata)
            total_chunks += num_chunks
            count += 1

            if count % 10 == 0:
                print(f"Processed {count}/{len(md_files)} files...")

        except Exception as e:
            print(f"Failed to process {file_path}: {e}")

    print(f"Completed! Processed {count} files. Total chunks archived: {total_chunks}")

if __name__ == "__main__":
    main()
