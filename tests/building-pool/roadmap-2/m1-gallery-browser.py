#!/usr/bin/env python3
"""Real Chromium Canvas2D coverage for all 30 M1 candidates at three mobile sizes.
No HTTP navigation; reads and executes the identical authored source in Chromium.
"""
from pathlib import Path
import hashlib, json, os, re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[3]
SRC=ROOT/'src/building-pool/roadmap-2'
VIEW=ROOT/'tests/building-pool/roadmap-2'
OUT=Path(os.environ.get('MYTHWROUGHT_R2_M1_SHOTS',ROOT/'m1-screenshots'))
OUT.mkdir(parents=True,exist_ok=True)
SOURCE_NAMES=['catalog.mjs','schema.mjs','temperate-store.mjs','m1-representatives.mjs']
js=[]
for fn in SOURCE_NAMES:
 source=(SRC/fn).read_text()
 source=re.sub(r'^import[^\n]+\n','',source,flags=re.M)
 source=re.sub(r'^export ','',source,flags=re.M)
 js.append(source)
viewer=(VIEW/'m1-gallery.mjs').read_text()
viewer=re.sub(r'^import[^\n]+\n','',viewer,flags=re.M)
js.append(viewer)
bundle='\n'.join(js)
html=(VIEW/'m1-gallery.html').read_text().replace('<script type="module" src="./m1-gallery.mjs"></script>','')
report=[]
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.getenv('CHROMIUM_BIN','/usr/bin/chromium'),args=['--no-sandbox','--disable-dev-shm-usage','--use-gl=swiftshader'])
  try:
    for width,height in [(667,375),(844,390),(932,430)]:
      page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
      errors=[]
      page.on('pageerror',lambda err:errors.append(str(err)))
      page.set_content(html)
      page.add_script_tag(content=bundle)
      for category in ['general-store','temple']:
       page.select_option('#category',category)
       for biome in ['temperate','desert','snow','enchanted-forest','mountain']:
        page.select_option('#biome',biome)
        for size in ['small','medium','large']:
          page.select_option('#size',size)
          expected=f'r2:{category}:{biome}:{size}:01'
          page.wait_for_function('(id) => document.documentElement.dataset.ready===id',arg=expected,timeout=10000)
          status=page.locator('#status').inner_text()
          assert expected in status and 'actual coordinate cells' in status
          # The gallery footer must report TRUE authored functional-space count.
          expected_rooms=2 if size=='small' else (4 if category=='temple' and size=='large' else 3)
          assert f'{expected_rooms} rooms' in status, f'gallery stale room count: {expected}, {status}'
          assert page.locator('canvas').count()==2
          for cid in ('external','interior'):
           assert page.locator('#'+cid).evaluate('(el)=>el.width>20&&el.height>20')
          f=OUT/f'{category}__{biome}__{size}__{width}x{height}.png'
          page.screenshot(path=str(f))
          body=f.read_bytes();assert body[:8]==bytes.fromhex('89504e470d0a1a0a') and len(body)>1000
          report.append({'blueprint':expected,'width':width,'height':height,'sha256':hashlib.sha256(body).hexdigest(),'bytes':len(body)})
      page.close()
  finally: browser.close()
(OUT/'index.json').write_text(json.dumps(report,indent=2))
print('GENUINE_CHROMIUM_PREVIEWS',len(report),'unique candidates',len(set(r['blueprint'] for r in report)))
print('DIMENSIONS',sorted(set((r['width'],r['height']) for r in report)))
print('Total bytes',sum(r['bytes'] for r in report))
