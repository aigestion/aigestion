import os
import sys
from pinecone import Pinecone
from dotenv import load_dotenv

# Set encoding for Windows
if sys.platform == "win32":
    import io

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

# Load .env
load_dotenv()


def verify_pinecone():
    api_key = os.getenv("PINECONE_API_KEY")
    if not api_key:
        print("Error: PINECONE_API_KEY not found in .env")
        return

    print("Initializing Pinecone God Mode...")
    pc = Pinecone(api_key=api_key)

    index_name = "aigestion-docs"

    try:
        print(f"Connecting to index: {index_name}")
        index = pc.Index(index_name)

        stats = index.describe_index_stats()
        print(f"Connection successful!")
        print(f"Index Stats: {stats}")

    except Exception as e:
        print(f"Failed to connect to Pinecone: {e}")


if __name__ == "__main__":
    verify_pinecone()
