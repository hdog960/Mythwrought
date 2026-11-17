#!/usr/bin/env python3
"""Source-authored Chromium screenshot runner. Requires playwright Python + Chromium locally.
Note: this environment blocks file and localhost navigation, so it bundles exact source
modules into about:blank. WebGL2 is not claimable when context creation is unavailable.
"""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[3]
SRC=ROOT/'src/building-pool/roadmap-1'
TEST=ROOT/'tests/building-pool/roadmap-1'
OUT=Path(os.environ.get('R1_ARTIFACT_DIR','/mnt/data/mythwrought-roadmap1-review'))
OUT.mkdir(parents=True,exist_ok=True)
SIZES=[(667,375),(844,390),(932,430)]
IDS=['r1:house:temperate:small:001','r1:tavern:desert:medium:002','r1:stable:snow:large:003',
     'r1:house:enchanted-forest:large:003','r1:tavern:mountain:small:001','r1:stable:desert:medium:002',
     'r1:house:mountain:large:003','r1:tavern:mountain:large:003','r1:stable:enchanted-forest:large:003']
def bundled_html():
 sources=[(SRC/p).read_text() for p in ['schema.mjs','m1-designs.mjs','m1-candidate-footprints.mjs','m1-buildings.mjs']]
 sources=['\n'.join(line for line in s.splitlines() if not line.startswith('import ')).replace('export ','') for s in sources]
 gallery=(TEST/'m1-canvas-gallery.html').read_text()
 gallery=gallery.replace("import {getM1Blueprints} from '../../../src/building-pool/roadmap-1/m1-buildings.mjs';",'')
 return gallery.replace('<script type="module">','<script>\n'+'\n'.join(sources)+'\n')
out=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for w,h in SIZES:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(bundled_html(),wait_until='load',timeout=60000)
  page.wait_for_function('window.__REVIEW__?.rendered===true',timeout=60000)
  for ident in IDS:
   page.select_option('#pick',ident)
   for cut in [False,True]:
    r=page.evaluate('window.__REVIEW__')
    assert r['viewport']==[w,h] and r['id']==ident and r['placements']>=200,r
    assert r['canvas2d'] and r['faces']>0 and r['cutaway']==cut,r
    assert r['reservedFootprintCells']==(1 if ':house:' in ident else 0),r
    assert not errs,errs
    file=ident.replace(':','-')+'-'+str(w)+'x'+str(h)+'-'+('interior' if cut else 'exterior')+'.png'
    page.screenshot(path=str(OUT/file))
    out.append({'id':ident,'viewport':[w,h],'cutaway':cut,'image':file,'renderer':'genuine Chromium Canvas2D schematic, NOT WebGL2'})
    if not cut:page.click('#cut')
   page.click('#cut')
  page.close()
 browser.close()
(OUT/'results.json').write_text(json.dumps(out,indent=2))
print(json.dumps({'screenshots':len(out),'viewports':SIZES,'renderer':'Chromium Canvas2D schematic; WebGL2 NOT certified'},indent=2))
