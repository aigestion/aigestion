import os
import hashlib
import datetime
import pathspec

MANIFEST_FILE = "INTELLECTUAL_PROPERTY_MANIFEST.md"
IGNORE_FILE = ".gitignore"

def load_gitignore(root_dir):
    gitignore_path = os.path.join(root_dir, IGNORE_FILE)
    if os.path.exists(gitignore_path):
        with open(gitignore_path, 'r') as f:
            return pathspec.PathSpec.from_lines('gitwildmatch', f)
    return pathspec.PathSpec.from_lines('gitwildmatch', [])

def hash_file(filepath):
    """Generate SHA-256 hash of a file."""
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        # Read and update hash string value in blocks of 4K
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def generate_manifest(root_dir):
    spec = load_gitignore(root_dir)
    entries = []

    # Always ignore the manifest itself and .git
    ignore_patterns = [MANIFEST_FILE, ".git", ".gemini", "node_modules", "dist", "coverage"]

    print(f"Scanning directory: {root_dir}")

    for root, dirs, files in os.walk(root_dir):
        # Filter directories in place
        dirs[:] = [d for d in dirs if d not in ignore_patterns and not spec.match_file(os.path.relpath(os.path.join(root, d), root_dir))]

        for file in files:
            if file in ignore_patterns:
                continue

            filepath = os.path.join(root, file)
            relpath = os.path.relpath(filepath, root_dir)

            if spec.match_file(relpath):
                continue

            try:
                file_hash = hash_file(filepath)
                size = os.path.getsize(filepath)
                entries.append((relpath, size, file_hash))
            except Exception as e:
                print(f"Error processing {relpath}: {e}")

    entries.sort(key=lambda x: x[0])

    print(f"Found {len(entries)} files. Generating manifest...")

    with open(os.path.join(root_dir, MANIFEST_FILE), 'w', encoding='utf-8') as f:
        f.write("# INTELLECTUAL PROPERTY MANIFEST\n")
        f.write(f"**Generated:** {datetime.datetime.now().isoformat()}\n")
        f.write("**Notarized by:** Nexus V2 Governance Tool\n\n")
        f.write("| File Path | Size (Bytes) | SHA-256 Hash |\n")
        f.write("|-----------|--------------|--------------|\n")

        for relpath, size, file_hash in entries:
            # Escape pipes in filenames just in case
            safe_path = relpath.replace("|", "\|")
            f.write(f"| {safe_path} | {size} | {file_hash} |\n")

    print(f"Manifest generated at {os.path.join(root_dir, MANIFEST_FILE)}")

if __name__ == "__main__":
    # Assuming script is run from project root or tools/ folder
    # We want to scan the project root.
    # If script is in tools/, root is ..

    current_dir = os.getcwd()
    # Logic to find root: look for package.json
    root_dir = current_dir
    while not os.path.exists(os.path.join(root_dir, 'package.json')):
        parent = os.path.dirname(root_dir)
        if parent == root_dir:
            # Hit root of drive
            root_dir = os.getcwd() # Fallback
            break
        root_dir = parent

    generate_manifest(root_dir)
