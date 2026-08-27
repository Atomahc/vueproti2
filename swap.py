import re

filepath = "src/views/services/GovServiceView.vue"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Find the block for 招商引资服务
zhaoshang_match = re.search(r'( *<!-- 招商引资服务 -->\s*<div class="big-card yellow-tint".*?</div>\s*</div>\s*</div>)', content, re.DOTALL)
if zhaoshang_match:
    zhaoshang_block = zhaoshang_match.group(1)
else:
    print("zhaoshang_block not found")
    exit(1)

# Find the block for 营商环境监测
yingshang_match = re.search(r'( *<!-- 营商环境监测 -->\s*<div class="fw-card border-blue">.*?</ul>\s*</div>)', content, re.DOTALL)
if yingshang_match:
    yingshang_block = yingshang_match.group(1)
else:
    print("yingshang_block not found")
    exit(1)

# Now, we replace zhaoshang_block with modified yingshang_block
# And replace yingshang_block with modified zhaoshang_block

mod_yingshang = yingshang_block.replace('fw-card border-blue', 'big-card blue-tint').replace('<h3>', '<h2>').replace('</h3>', '</h2>')
mod_zhaoshang = zhaoshang_block.replace('big-card yellow-tint', 'fw-card border-orange').replace('<h2>', '<h3>').replace('</h2>', '</h3>')

content = content.replace(zhaoshang_block, 'INSERT_YINGSHANG_HERE')
content = content.replace(yingshang_block, 'INSERT_ZHAOSHANG_HERE')

content = content.replace('INSERT_YINGSHANG_HERE', mod_yingshang)
content = content.replace('INSERT_ZHAOSHANG_HERE', mod_zhaoshang)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
