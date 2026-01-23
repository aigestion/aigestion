import os
import hashlib


def get_file_hash(filepath):
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


def generate_ip_manifest():
    print("🛡️ Generando Manifiesto de Propiedad Intelectual AIGestion...")
    manifest_path = "INTELLECTUAL_PROPERTY_MANIFEST.md"

    exclude_dirs = {
        ".git",
        "node_modules",
        ".cache",
        "dist",
        "build",
        "coverage",
        ".gemini",
        ".trunk",
        ".vscode",
        "__pycache__",
    }
    exclude_files = {manifest_path, "LICENSE_PROPRIETARY.md"}

    with open(manifest_path, "w", encoding="utf-8") as m:
        m.write("# 🛡️ AIGestion Intellectual Property Manifest\n")
        m.write(
            f"Generated on: {os.popen('date /t').read().strip()} {os.popen('time /t').read().strip()}\n"
        )
        m.write("Owner: Alejandro Manuel Alfonso Fernández (DNI: 28921591B)\n\n")
        m.write("| File Path | SHA-256 Hash |\n")
        m.write("|-----------|--------------|\n")

        for root, dirs, files in os.walk("."):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file in exclude_files:
                    continue

                filepath = os.path.join(root, file)
                try:
                    rel_path = os.path.relpath(filepath, ".")
                    file_hash = get_file_hash(filepath)
                    m.write(f"| {rel_path} | {file_hash} |\n")
                except Exception as e:
                    print(f"⚠️ Error procesando {filepath}: {e}")

    print(f"✅ Manifiesto generado en: {manifest_path}")


if __name__ == "__main__":
    generate_ip_manifest()
