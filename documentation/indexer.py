#!/usr/bin/env python3
"""
Documentation Indexer for AIGestion.net
Indexes all documentation files and creates embeddings for RAG system
"""

import json
import os
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional


class DocumentationIndexer:
    """Indexes documentation files for RAG retrieval"""

    def __init__(self, docs_path: str = "./documentation"):
        self.docs_path = Path(docs_path)
        self.index: List[Dict[str, Any]] = []
        self.metadata = {
            "total_files": 0,
            "total_sections": 0,
            "indexed_at": datetime.now().isoformat(),
            "version": "2.0.0"
        }

    def extract_sections(self, content: str, file_name: str) -> List[Dict[str, str]]:
        """Extract sections from markdown content"""
        sections = []

        # Split by headers (## and ###)
        pattern = r'(#{2,3}\s+[^\n]+)'
        parts = re.split(pattern, content)

        current_section = None
        for i, part in enumerate(parts):
            if part.startswith('#'):
                # This is a header
                current_section = part.strip()
            elif current_section and part.strip():
                # This is content under a header
                sections.append({
                    "file": file_name,
                    "section": current_section,
                    "content": part.strip()[:500],  # First 500 chars
                    "type": "section"
                })

        return sections

    def extract_tables(self, content: str, file_name: str) -> List[Dict[str, str]]:
        """Extract tables from markdown"""
        tables = []
        pattern = r'\|[^\n]*\|[^\n]*(?:\n\|[^\n]*\|[^\n]*)*'
        matches = re.finditer(pattern, content)

        for idx, match in enumerate(matches):
            table_content = match.group(0)
            if len(table_content) > 20:  # Only significant tables
                tables.append({
                    "file": file_name,
                    "section": "table",
                    "content": table_content[:300],
                    "type": "table",
                    "table_index": idx
                })

        return tables

    def extract_code_blocks(self, content: str, file_name: str) -> List[Dict[str, str]]:
        """Extract code blocks from markdown"""
        code_blocks = []
        pattern = r'```(\w+)?\n(.*?)```'
        matches = re.finditer(pattern, content, re.DOTALL)

        for idx, match in enumerate(matches):
            language = match.group(1) or "text"
            code = match.group(2).strip()
            if len(code) > 10:
                code_blocks.append({
                    "file": file_name,
                    "section": "code",
                    "language": language,
                    "content": code[:400],
                    "type": "code_block",
                    "index": idx
                })

        return code_blocks

    def extract_links(self, content: str, file_name: str) -> List[Dict[str, str]]:
        """Extract internal links from markdown"""
        links = []
        pattern = r'\[([^\]]+)\]\(([^)]+)\)'
        matches = re.finditer(pattern, content)

        for match in matches:
            text = match.group(1)
            url = match.group(2)
            if url.endswith('.md'):
                links.append({
                    "file": file_name,
                    "link_text": text,
                    "link_url": url,
                    "type": "internal_link"
                })

        return links

    def index_file(self, file_path: Path) -> Optional[Dict[str, Any]]:
        """Index a single markdown file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            file_name = file_path.name

            # Extract metadata
            title_match = re.search(r'^#\s+(.+?)$', content, re.MULTILINE)
            title = title_match.group(1) if title_match else file_name.replace('.md', '')

            # Count words
            word_count = len(content.split())

            # Extract all components
            sections = self.extract_sections(content, file_name)
            tables = self.extract_tables(content, file_name)
            code_blocks = self.extract_code_blocks(content, file_name)
            links = self.extract_links(content, file_name)

            file_index = {
                "file": file_name,
                "title": title,
                "word_count": word_count,
                "sections": len(sections),
                "tables": len(tables),
                "code_blocks": len(code_blocks),
                "internal_links": len(links),
                "sections_data": sections,
                "tables_data": tables,
                "code_data": code_blocks,
                "links_data": links,
                "indexed_at": datetime.now().isoformat(),
                "file_size": len(content)
            }

            return file_index

        except Exception as e:
            print(f"Error indexing {file_path}: {e}")
            return None

    def index_all(self) -> Dict[str, Any]:
        """Index all markdown files in docs folder"""
        if not self.docs_path.exists():
            print(f"Documentation path not found: {self.docs_path}")
            return {}

        print(f"\n📚 Starting documentation indexing...")
        print(f"📁 Path: {self.docs_path}")

        md_files = list(self.docs_path.glob("*.md"))
        print(f"📄 Found {len(md_files)} markdown files\n")

        self.index = []
        total_sections = 0

        for file_path in sorted(md_files):
            print(f"  Indexing: {file_path.name}...", end=" ")
            file_index = self.index_file(file_path)

            if file_index:
                self.index.append(file_index)
                total_sections += file_index['sections']
                print(f"✓ ({file_index['word_count']} words, {file_index['sections']} sections)")
            else:
                print("✗ Failed")

        self.metadata['total_files'] = len(self.index)
        self.metadata['total_sections'] = total_sections

        return {
            "metadata": self.metadata,
            "files": self.index
        }

    def save_index(self, output_path: str = "./docs_index.json") -> str:
        """Save index to JSON file"""
        output_file = Path(output_path)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                "metadata": self.metadata,
                "files": self.index
            }, f, indent=2, ensure_ascii=False)

        print(f"\n✅ Index saved to: {output_file}")
        return str(output_file)

    def get_summary(self) -> str:
        """Get a summary of the index"""
        if not self.index:
            return "No files indexed"

        summary = f"""
╔════════════════════════════════════════╗
║  📊 DOCUMENTATION INDEX SUMMARY        ║
╚════════════════════════════════════════╝

📈 Statistics:
  • Total Files: {self.metadata['total_files']}
  • Total Sections: {self.metadata['total_sections']}
  • Total Words: {sum(f['word_count'] for f in self.index):,}
  • Total Tables: {sum(f['tables'] for f in self.index)}
  • Total Code Blocks: {sum(f['code_blocks'] for f in self.index)}
  • Internal Links: {sum(f['internal_links'] for f in self.index)}

📄 Top Files by Content:
"""
        sorted_by_words = sorted(self.index, key=lambda x: x['word_count'], reverse=True)
        for f in sorted_by_words[:5]:
            summary += f"  • {f['title']}: {f['word_count']} words\n"

        summary += f"\n⏰ Indexed at: {self.metadata['indexed_at']}\n"
        return summary


def main():
    """Main entry point"""
    indexer = DocumentationIndexer("./documentation")

    # Index all documentation
    result = indexer.index_all()

    # Print summary
    print(indexer.get_summary())

    # Save index
    indexer.save_index("./tmp_rag/docs_index.json")

    return result


if __name__ == "__main__":
    main()
