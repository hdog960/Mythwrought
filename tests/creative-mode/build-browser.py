"""Roadmap 9 M4 detached build lab — genuine Chromium DOM and pointer evidence.
Starts a LOCAL static server for the isolated M4 fixture. Never hits production.
"""
import base64
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'src/creative-mode'
HTML=(SOURCE/'build-preview.html').read_text().replace('<link rel="stylesheet" href="./build-preview.css">','').replace('<script type="module" src="./build-preview.mjs"></script>','')
CSS=(SOURCE/'build-preview.css').read_text()
def uri(s):return 'data:text/javascript;base64,'+base64.b64encode(s.encode()).decode()
ADAPTER=uri((SOURCE/'adapter-contract.mjs').read_text())
INVENTORY=uri((SOURCE/'inventory-model.mjs').read_text().replace("from './adapter-contract.mjs'",f"from '{ADAPTER}'"))
BUILD=uri((SOURCE/'build-model.mjs').read_text().replace("from './adapter-contract.mjs'",f"from '{ADAPTER}'").replace("from './inventory-model.mjs'",f"from '{INVENTORY}'"))
JS=(SOURCE/'build-preview.mjs').read_text().replace("from './build-model.mjs'",f"from '{BUILD}'")
def load(page):
 page.set_content(HTML,wait_until='domcontentloaded')
 page.add_style_tag(content=CSS)
 page.add_script_tag(type='module',content=JS)
 page.wait_for_function("document.querySelectorAll('#cellGrid .cell').length===100")
SIZES=[(568,320),(667,375),(844,390),(932,430),(956,440),(1180,520)]
ART=ROOT/'artifacts/creative-mode';ART.mkdir(parents=True,exist_ok=True)
checks=0
def check(v,reason):
 global checks
 checks+=1
 assert v,reason

def bounds(page,sel):return page.locator(sel).bounding_box()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  for w,h in SIZES:
   context=browser.new_context(viewport={'width':w,'height':h},has_touch=True,is_mobile=True,device_scale_factor=1)
   page=context.new_page();errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
   load(page)
   check(page.locator('#buildEvidence').get_attribute('data-revision')=='0','Initial revision not zero')
   check(page.locator('#buildEvidence').get_attribute('data-placements')=='0','Initial placements not empty')
   check(page.locator('#cellGrid .cell').count()==100,'Grid missing 100 cells')
   check(page.locator('#chooseBlock').get_attribute('aria-pressed')=='true','Initial fixture is not stone')
   check(page.locator('#mapReservation').is_visible(),'Minimap reservation missing')
   check(page.locator('.portrait-warning').is_hidden(),'Landscape showed rotate warning')
   left,right,world,mapbox,grid=(bounds(page,sel) for sel in ['.rail.left','.rail.right','#world','#mapReservation','#cellGrid'])
   check(left['x']>=-1 and left['x']+left['width']<=world['x']+2,'Left thumb rail overlaps world')
   check(right['x']>=world['x']+world['width']-2 and right['x']+right['width']<=w+1,'Right thumb rail overlaps world')
   check(world['width']>=250,'World collapsed in compact landscape')
   check(mapbox['x']>=world['x']+world['width']-mapbox['width']-15,'Map reservation not in upper right')
   check(mapbox['y']>=world['y'] and mapbox['y']+mapbox['height']<=world['y']+world['height'],'Map escapes world vertically')
   check(mapbox['x']>=grid['x']+grid['width']-1 or mapbox['y']+mapbox['height']<=grid['y']+1,'Map covers edit grid')
   toolbar=bounds(page,'.toolbar');cmd=bounds(page,'.commands')
   check(toolbar['x']+toolbar['width']<=mapbox['x']-1,'Tools cover reserved map')
   check(cmd['y']>=grid['y']+grid['height']-2,'Commands cover grid')
   check(cmd['x']>=world['x']-2 and cmd['x']+cmd['width']<=world['x']+world['width']+2,'Commands leave world')
   check(cmd['y']+cmd['height']<=world['y']+world['height']+2,'Commands clip beneath viewport')
   check(page.locator('#buildStatus').inner_text().startswith('M4 isolated'),'Incorrect demo provenance')
   check('NO LIVE WORLD' in page.locator('.status').inner_text(),'Preview not labeled as detached')
   page.locator('#place').click()
   check(page.locator('#buildEvidence').get_attribute('data-revision')=='1','Stone place failed')
   check(page.locator('#buildEvidence').get_attribute('data-placements')=='1','Stone placement not represented')
   check(page.locator('.cell[data-x="0"][data-z="0"]').get_attribute('data-occupied')=='true','Grid placement not rendered')
   page.locator('#place').click()
   check(page.locator('#buildEvidence').get_attribute('data-revision')=='1','Collision incorrectly mutated state')
   check('occupied' in page.locator('#buildStatus').inner_text(),'Occupied rejection missing')
   page.locator('#remove').click()
   check(page.locator('#buildEvidence').get_attribute('data-placements')=='0','Removal failed')
   check(page.locator('#buildEvidence').get_attribute('data-revision')=='2','Remove not revisioned')
   page.locator('#chooseObject').click()
   check(page.locator('#chooseObject').get_attribute('aria-pressed')=='true','Object selection failed')
   page.locator('#rotateShape').click()
   check(page.locator('#rotation').inner_text()=='90°','Shape rotation failed')
   page.locator('#place').click()
   check(page.locator('#buildEvidence').get_attribute('data-cells')=='4','Four-cell object not planned')
   check(page.locator('#buildEvidence').get_attribute('data-placements')=='1','Object placement failed')
   page.locator('#undoCandidate').click()
   check('UNDO CANDIDATE' in page.locator('#buildStatus').inner_text(),'Undo candidate not reported')
   check(page.locator('#buildEvidence').get_attribute('data-placements')=='1','Undo candidate improperly applied')
   page.locator('#targetX').fill('0');page.locator('#targetY').fill('1');page.locator('#targetZ').fill('1')
   page.locator('#remove').click()
   check(page.locator('#buildEvidence').get_attribute('data-placements')=='0','Removal from object cell failed')
   page.locator('#chooseBlock').click();page.locator('#targetX').fill('3');page.locator('#targetY').fill('1');page.locator('#targetZ').fill('3')
   page.locator('#place').click()
   check('unsupported' in page.locator('#buildStatus').inner_text(),'Floating block was accepted')
   page.locator('#targetY').fill('0');page.locator('#batch').click()
   check(page.locator('#buildEvidence').get_attribute('data-placements')=='3','Bounded batch not applied')
   check('3 edit(s)' in page.locator('#buildStatus').inner_text(),'Batch count missing')
   page.locator('#resetLab').click()
   check(page.locator('#buildEvidence').get_attribute('data-revision')=='0','Reset failed')
   check(page.locator('#buildEvidence').get_attribute('data-placements')=='0','Reset retained placements')
   page.locator('#targetX').fill('7');page.locator('#targetY').fill('0');page.locator('#targetZ').fill('0');page.locator('#batch').click()
   check('unloaded-region' in page.locator('#buildStatus').inner_text(),'Batch region readiness not guarded')
   check(page.locator('#buildEvidence').get_attribute('data-placements')=='0','Failed batch changed state')
   page.locator('.cell[data-x="-2"][data-z="2"]').click()
   check(page.locator('#targetX').input_value()=='-2' and page.locator('#targetZ').input_value()=='2','Grid target selection failed')
   check(page.locator('.cell[data-x="-2"][data-z="2"]').get_attribute('data-target')=='true','Grid target visual not synchronized')
   check(len(errors)==0,f'Browser JS errors at {w}x{h}: {errors}')
   if w in (568,956):
    page.locator('#resetLab').click();page.locator('#chooseObject').click();page.locator('#targetX').fill('0');page.locator('#targetY').fill('0');page.locator('#targetZ').fill('0');page.locator('#place').click()
    page.screenshot(path=str(ART/f'm4-building-{w}x{h}.png'))
   context.close()
  portrait=browser.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
  pp=portrait.new_page();load(pp);check(pp.locator('#portraitWarning').is_visible(),'Portrait warning missing');portrait.close()
  browser.close()
 print(f'PASS: {checks} genuine Chromium M4 assertions over {len(SIZES)} landscape viewports and portrait')
finally:
 pass
