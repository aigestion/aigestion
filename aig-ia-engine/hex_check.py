import os
from dotenv import load_dotenv

load_dotenv(override=True)
key = os.getenv("GEMINI_API_KEY")

if key:
    print(f"Key: '{key}'")
    print(f"Len: {len(key)}")
    print(f"Hex: {key.encode('utf-8').hex()}")
    # Compare with expected hex
    expected = "AIzaSyBBlqdK-WjbDLVOn9LnSygzWIiZscUb7yk"
    print(f"ExpHex: {expected.encode('utf-8').hex()}")

    if key.encode('utf-8').hex() == expected.encode('utf-8').hex():
        print("MATCH!")
    else:
        print("MISMATCH!")
else:
    print("No key")
