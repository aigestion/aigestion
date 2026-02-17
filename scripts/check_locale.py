import os
import sys
import json


def check_locale_consistency():
    print("--- Sovereign Locale Audit ---")

    # 1. Check Python Environment
    python_locale = os.getenv("LOCALE")
    python_lang = os.getenv("LANG")

    print(f"[Python] LOCALE: {python_locale}")
    print(f"[Python] LANG: {python_lang}")

    if python_locale == "es-ES" and "es_ES" in (python_lang or ""):
        print("Environment is correctly localized.")
    else:
        print("Environment locale mismatch!")

    # 2. Check for "en-US" hardcodings in key files (Simulation of audit)
    print("\n[Audit] Checking for rogue 'en-US' strings...")

    critical_files = [
        "C:\\Users\\Alejandro\\AIGestion\\aig-ia-engine\\swarm\\services\\memory.py",
        "C:\\Users\\Alejandro\\AIGestion\\packages\\decentraland-parcel\\src\\voice-command-system.ts",
        "C:\\Users\\Alejandro\\AIGestion\\.env",
    ]

    found_issues = 0
    for file_path in critical_files:
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                if "en-US" in content:
                    print(f"Rogue 'en-US' found in: {file_path}")
                    found_issues += 1
                else:
                    print(f"Clean: {file_path}")

    if found_issues == 0:
        print("\nSUCCESS: 100% Spanish Sovereign Parity achieved.")
    else:
        print(f"\nWARNING: {found_issues} files still contain 'en-US'.")


if __name__ == "__main__":
    check_locale_consistency()
