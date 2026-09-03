import glob
import re

files = glob.glob('src/views/services/*.vue')

for file in files:
    with open(file, 'r') as f:
        content = f.read()
        
    if 'class="content-box"' not in content:
        continue
        
    # Check if already has BannerSideOverlay
    if 'BannerSideOverlay' in content:
        continue

    # Add import
    content = re.sub(
        r'(</script>)',
        r"import BannerSideOverlay from '@/components/BannerSideOverlay.vue'\n\1",
        content
    )
    
    # Wrap content-box
    # We replace `<div class="content-box">` with `<div style="display: flex; gap: 20px; flex: 1; min-height: 0;"><div class="content-box" style="flex: 1; overflow-y: auto;">`
    # and we need to close it right after the closing `</div>` of `content-box` which is before `</main>`.
    
    # Wait, using regex for HTML matching is tricky. Let's do it manually or simply append right before `</main>` and prepend right before `content-box`.
    
    # Find `<div class="content-box"`
    content = re.sub(
        r'(<div class="content-box".*?>)',
        r'<div style="display: flex; gap: 20px; flex: 1; height: 100%;">\n        \1',
        content,
        count=1
    )
    
    # We need to add the sidebar and close the flex container right before `</main>`
    # assuming `<div class="content-box">...</div>` is the last element in `<main>` before `</main>` or `<TheFooter />`
    
    replacement = r'''
        <div style="width: 160px; position: relative; flex-shrink: 0; height: 600px;">
          <BannerSideOverlay />
        </div>
      </div>
    </main>'''
    
    content = re.sub(r'</main>', replacement, content)
    
    with open(file, 'w') as f:
        f.write(content)

print("Done")
