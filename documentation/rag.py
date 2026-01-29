#!/usr/bin/env python3
"""
AIGestion Documentation RAG System
Retrieval-Augmented Generation for project documentation
"""

import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime


class DocumentationRAG:
    """RAG system for documentation retrieval"""

    def __init__(self, index_path: str = "./tmp_rag/docs_index.json"):
        self.index_path = Path(index_path)
        self.index: Dict[str, Any] = {}
        self.docs_path = Path("./documentation")
        self.load_index()

    def load_index(self) -> bool:
        """Load the documentation index"""
        if self.index_path.exists():
            with open(self.index_path, "r", encoding="utf-8") as f:
                self.index = json.load(f)
            print(f"✓ Index loaded: {len(self.index.get('files', []))} files")
            return True
        print(f"✗ Index not found at {self.index_path}")
        return False

    def keyword_search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Keyword-based search in documentation"""
        results = []
        query_terms = query.lower().split()

        for file_data in self.index.get("files", []):
            # Search in sections
            for section in file_data.get("sections_data", []):
                match_score = sum(
                    query_term in section["content"].lower()
                    for query_term in query_terms
                )

                if match_score > 0:
                    results.append(
                        {
                            "type": "section",
                            "file": file_data["file"],
                            "title": file_data["title"],
                            "section": section["section"],
                            "content": section["content"][:200],
                            "score": match_score / len(query_terms),
                            "source": "section",
                        }
                    )

            # Search in tables
            for table in file_data.get("tables_data", []):
                if any(term in table["content"].lower() for term in query_terms):
                    results.append(
                        {
                            "type": "table",
                            "file": file_data["file"],
                            "title": file_data["title"],
                            "content": table["content"][:150],
                            "score": 0.7,
                            "source": "table",
                        }
                    )

            # Search in code blocks
            for code in file_data.get("code_data", []):
                if any(term in code["content"].lower() for term in query_terms):
                    results.append(
                        {
                            "type": "code",
                            "file": file_data["file"],
                            "title": file_data["title"],
                            "language": code.get("language", "text"),
                            "content": code["content"][:150],
                            "score": 0.6,
                            "source": "code_block",
                        }
                    )

        # Sort by score and return top_k
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def semantic_search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Semantic search based on title and content similarity"""
        results = []

        # Create a simple semantic score based on keyword overlap with titles
        for file_data in self.index.get("files", []):
            title_similarity = self._calculate_similarity(query, file_data["title"])

            if title_similarity > 0.3:
                results.append(
                    {
                        "type": "file",
                        "file": file_data["file"],
                        "title": file_data["title"],
                        "word_count": file_data["word_count"],
                        "sections": file_data["sections"],
                        "score": title_similarity,
                        "source": "document",
                    }
                )

        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def _calculate_similarity(self, query: str, text: str) -> float:
        """Calculate simple similarity between query and text"""
        query_terms = set(query.lower().split())
        text_terms = set(text.lower().split())

        if not query_terms:
            return 0.0

        overlap = query_terms & text_terms
        return len(overlap) / len(query_terms)

    def retrieve(
        self, query: str, search_type: str = "hybrid", top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Retrieve relevant documentation

        Args:
            query: Search query
            search_type: "keyword", "semantic", or "hybrid"
            top_k: Number of results to return

        Returns:
            List of relevant documents/sections
        """
        results = []

        if search_type in ["keyword", "hybrid"]:
            results.extend(self.keyword_search(query, top_k))

        if search_type in ["semantic", "hybrid"]:
            semantic_results = self.semantic_search(query, top_k)
            # Add semantic results that aren't already in results
            existing_files = {r.get("file") for r in results}
            for result in semantic_results:
                if result["file"] not in existing_files:
                    results.append(result)

        # Sort by score and return top_k
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def get_file_content(self, filename: str) -> Optional[str]:
        """Get full content of a documentation file"""
        file_path = self.docs_path / filename
        if file_path.exists():
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        return None

    def get_file_metadata(self, filename: str) -> Optional[Dict[str, Any]]:
        """Get metadata about a documentation file"""
        for file_data in self.index.get("files", []):
            if file_data["file"] == filename:
                return file_data
        return None

    def get_statistics(self) -> Dict[str, Any]:
        """Get statistics about the documentation index"""
        files = self.index.get("files", [])

        return {
            "total_files": len(files),
            "total_sections": sum(f.get("sections", 0) for f in files),
            "total_words": sum(f.get("word_count", 0) for f in files),
            "total_tables": sum(f.get("tables", 0) for f in files),
            "total_code_blocks": sum(f.get("code_blocks", 0) for f in files),
            "total_links": sum(f.get("internal_links", 0) for f in files),
            "indexed_at": self.index.get("metadata", {}).get("indexed_at"),
        }

    def print_stats(self) -> None:
        """Print statistics"""
        stats = self.get_statistics()

        print(
            f"""
╔═══════════════════════════════════════════╗
║  📚 DOCUMENTATION RAG STATISTICS          ║
╚═══════════════════════════════════════════╝

📊 Index Overview:
  • Total Documents: {stats['total_files']}
  • Total Sections: {stats['total_sections']}
  • Total Words: {stats['total_words']:,}
  • Tables: {stats['total_tables']}
  • Code Blocks: {stats['total_code_blocks']}
  • Internal Links: {stats['total_links']}

⏰ Last Indexed: {stats['indexed_at']}
"""
        )


class RAGQueryEngine:
    """Query engine for RAG retrieval"""

    def __init__(self):
        self.rag = DocumentationRAG()
        self.query_history: List[Dict[str, Any]] = []

    def query(
        self, query: str, search_type: str = "hybrid", top_k: int = 5
    ) -> Dict[str, Any]:
        """Execute a RAG query"""

        if not self.rag.index:
            return {"error": "Index not loaded"}

        results = self.rag.retrieve(query, search_type=search_type, top_k=top_k)

        query_result = {
            "query": query,
            "search_type": search_type,
            "timestamp": datetime.now().isoformat(),
            "results_count": len(results),
            "results": results,
        }

        self.query_history.append(query_result)
        return query_result

    def interactive_mode(self) -> None:
        """Run interactive query mode"""
        print("\n" + "=" * 50)
        print("  📚 AIGestion Documentation RAG Query Engine")
        print("=" * 50)

        self.rag.print_stats()

        print("\nCommands:")
        print("  quit/exit   - Exit the program")
        print("  stats       - Show statistics")
        print("  help        - Show this help")
        print("\n")

        while True:
            try:
                query = input("\n🔍 Query: ").strip()

                if query.lower() in ["quit", "exit"]:
                    print("\n👋 Goodbye!")
                    break

                if query.lower() == "stats":
                    self.rag.print_stats()
                    continue

                if query.lower() == "help":
                    print("\nAvailable commands: quit, stats, help")
                    continue

                if not query:
                    continue

                print("\n📡 Searching...\n")
                result = self.query(query, search_type="hybrid", top_k=5)

                if result.get("error"):
                    print(f"Error: {result['error']}")
                    continue

                print(f"Found {result['results_count']} results:\n")

                for idx, item in enumerate(result["results"], 1):
                    item_type = item.get("type", "unknown").upper()
                    title = item.get("title", "N/A")
                    print(f"  {idx}. [{item_type}] {title}")
                    print(f"     File: {item.get('file', 'N/A')}")
                    print(f"     Score: {item.get('score', 0):.2f}")
                    content = item.get("content", "N/A")[:100]
                    print(f"     Content: {content}...")
                    print()

            except KeyboardInterrupt:
                print("\n\n👋 Interrupted. Goodbye!")
                break
            except (ValueError, KeyError, TypeError) as e:
                print(f"\n❌ Error: {e}")


def main():
    """Main entry point"""
    print("\n🚀 AIGestion Documentation RAG System")
    print("=" * 50)

    # Initialize RAG
    engine = RAGQueryEngine()

    # Show statistics
    engine.rag.print_stats()

    # Example queries
    print("\n📝 Example Queries:")
    example_queries = [
        "How do I deploy the application?",
        "What are the configuration requirements?",
        "Tell me about testing",
        "SSL HTTPS setup",
        "Kubernetes deployment",
    ]

    for query in example_queries:
        print(f'\n  • Query: "{query}"')
        result = engine.query(query, search_type="hybrid", top_k=3)

        if result.get("results"):
            for item in result["results"][:2]:
                print(
                    f"    ✓ {item.get('title', 'N/A')} (Score: {item.get('score', 0):.2f})"
                )
        else:
            print("    No results found")

    # Start interactive mode
    print("\n" + "=" * 50)
    start_interactive = input("\n🔍 Start interactive mode? (y/n): ").strip().lower()
    if start_interactive == "y":
        engine.interactive_mode()


if __name__ == "__main__":
    main()
