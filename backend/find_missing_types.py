
import re

# Read types.ts to get existing keys
with open(r'C:\Users\Alejandro\AIGestion\backend\src\types.ts', 'r', encoding='utf-8') as f:
    types_content = f.read()

existing_keys = set(re.findall(r'(\w+): Symbol\.for', types_content))

# Read inversify.config.ts to get redundant keys
with open(r'C:\Users\Alejandro\AIGestion\backend\src\config\inversify.config.ts', 'r', encoding='utf-8') as f:
    config_content = f.read()

# Extract the block between export const TYPES = { and };
match = re.search(r'export const TYPES = \{(.*?)\};', config_content, re.DOTALL)
if match:
    block = match.group(1)
    redundant_keys = re.findall(r'(\w+): Symbol\.for', block)

    missing = [k for k in redundant_keys if k not in existing_keys]
    print(f"Missing keys in types.ts: {missing}")
else:
    print("Could not find TYPES block in inversify.config.ts")
