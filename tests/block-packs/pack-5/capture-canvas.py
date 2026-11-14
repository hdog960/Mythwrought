"""Optional genuine Chromium Canvas2D screenshot runner, NOT a WebGL2 or served-page test.

Requires Python Playwright and a local Chromium. Runs exact authored module bodies in
an offline about:blank browser context because local navigation may be blocked.
No production app is loaded, and no files outside the requested artifact dir change.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re
base=Path(__file__).resolve().parents[3]
import sys
out=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else base/'pack5-preview-screenshots'
out.mkdir(parents=True, exist_ok=True)
paths=['src/block-packs/pack-5/fixture.mjs','src/block-packs/pack-5/architectural-surfaces.mjs','tests/block-packs/pack-5/canvas-gallery.mjs']
parts=[]
for path in paths:
 s=(base/path).read_text()
 s=re.sub(r'^import .*?;\s*$', '',s,flags=re.MULTILINE)
 s=re.sub(r'(?m)^export ', '',s)
 parts.append(s)
bundle='\n'.join(parts)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(667,375),(844,390),(932,430)]:
  for rotation in [0,1]:
   page=b.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
   page.set_content(f'''<!doctype html><html><head><style>html,body{{margin:0;background:#15222c;color:#f5e9d3;font:12px system-ui,sans-serif}}h1{{font-size:15px;margin:3px 8px}}p{{margin:2px 8px}}canvas{{display:block;width:100%;height:calc(100dvh - 48px)}} #status{{position:fixed;bottom:0;left:0;padding:3px 8px;background:#253039}}</style></head><body><h1>PACK 5 · M1 Physical Candidates · not playable</h1><p>Authored voxel source, genuine Chromium Canvas2D (NOT WebGL2) · {width}×{height}</p><canvas id="surface" width="{width}" height="{height-48}"></canvas><div id="status">Preview</div></body></html>''')
   page.add_script_tag(content=bundle)
   result=page.evaluate(f"drawPack5CanvasGallery(document.getElementById('surface'),{{rotation:{rotation}}})")
   pixels=page.evaluate("(()=>{const c=document.getElementById('surface');const p=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let unique=new Set();for(let i=0;i<p.length;i+=256)unique.add([p[i],p[i+1],p[i+2]].join(','));return unique.size})()")
   filename=out/f'pack5-m1-canvas-{width}x{height}-rot{rotation}.png'
   page.screenshot(path=str(filename));print(filename.name,'assets',len(result),'colorsampled',pixels,flush=True)
   page.close()
 b.close()
