import os
import glob

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace '100vw' with '100%' in most places.
    # But let's only replace it if it's 'width: 100vw;' or 'max-width: 100vw;'
    if '100vw' in content:
        new_content = content.replace('width: 100vw;', 'width: 100%;')
        new_content = new_content.replace('max-width: 100vw', 'max-width: 100%')
        new_content = new_content.replace('width: 90vw;', 'width: 90%;')
        new_content = new_content.replace('max-width: 90vw;', 'max-width: 90%;')
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {filepath}")

for root, _, files in os.walk('.'):
    for file in files:
        if file.endswith('.vue') or file.endswith('.css'):
            fix_file(os.path.join(root, file))

