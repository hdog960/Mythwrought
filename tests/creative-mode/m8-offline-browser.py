"""M8 DETACHED offline/read-only evidence under genuine Chromium (NOT PWA/iPhone test).

All modules and styles are loaded from feature-owned source into an isolated
about:blank document. Browser network is explicitly disabled, and every HTTP
request is aborted. This proves only this lab's network independence; it does
NOT prove live Mythwrought service-worker behavior or cache recovery.
"""
import base64
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[2]
SRC=ROOT/'src/creative-mode'
ART=ROOT/'artifacts/creative-mode'; ART.mkdir(parents=True,exist_ok=True)
SIZES=[(568,320),(667,375),(844,390),(932,430),(956,440),(1180,520)]
checks=0

def check(value,message):
 global checks
 checks+=1
 assert value,message

def uri(code):
 return 'data:text/javascript;base64,'+base64.b64encode(code.encode()).decode()

def source(name):
 return (SRC/name).read_text()

def blueprint_assets():
 html=source('blueprint-preview.html').replace('<link rel="stylesheet" href="./build-preview.css">','').replace('<link rel="stylesheet" href="./blueprint-preview.css">','').replace('<script type="module" src="./blueprint-preview.mjs"></script>','')
 css=source('build-preview.css')+'\n'+source('blueprint-preview.css')
 model=uri(source('blueprint-browser.mjs'))
 fixture=uri(source('blueprint-fixture.mjs').replace("from './blueprint-browser.mjs'",f"from '{model}'"))
 js=source('blueprint-preview.mjs').replace("from './blueprint-browser.mjs'",f"from '{model}'").replace("from './blueprint-fixture.mjs'",f"from '{fixture}'")
 return html,css,js

def history_assets():
 html=source('history-preview.html').replace('<link rel="stylesheet" href="./build-preview.css">','').replace('<link rel="stylesheet" href="./history-preview.css">','').replace('<script type="module" src="./history-preview.mjs"></script>','')
 css=source('build-preview.css')+'\n'+source('history-preview.css')
 adapter=uri(source('adapter-contract.mjs'))
 inventory=uri(source('inventory-model.mjs').replace("from './adapter-contract.mjs'",f"from '{adapter}'"))
 build=uri(source('build-model.mjs').replace("from './adapter-contract.mjs'",f"from '{adapter}'").replace("from './inventory-model.mjs'",f"from '{inventory}'"))
 history=uri(source('history-model.mjs').replace("from './build-model.mjs'",f"from '{build}'"))
 save=uri(source('save-compat.mjs').replace("from './build-model.mjs'",f"from '{build}'").replace("from './history-model.mjs'",f"from '{history}'"))
 js=source('history-preview.mjs').replace("from './history-model.mjs'",f"from '{history}'").replace("from './save-compat.mjs'",f"from '{save}'")
 return html,css,js

def bounds(page,sel):
 return page.locator(sel).bounding_box()

def load(page,assets,ready):
 html,css,js=assets
 page.set_content(html,wait_until='domcontentloaded')
 page.add_style_tag(content=css)
 page.add_script_tag(type='module',content=js)
 page.wait_for_function(ready)

with sync_playwright() as engine:
 browser=engine.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 bp=blueprint_assets()
 for w,h in SIZES:
  context=browser.new_context(viewport={'width':w,'height':h},has_touch=True,is_mobile=True,device_scale_factor=1,offline=True)
  context.route('**/*',lambda route:route.abort())
  page=context.new_page();requests=[];errors=[]
  page.on('request',lambda r:requests.append(r.url) if r.url.startswith(('http://','https://')) else None)
  page.on('pageerror',lambda e:errors.append(str(e)))
  load(page,bp,"document.querySelector('#bpEvidence')?.dataset.eligible === '297'")
  check(page.evaluate('navigator.onLine') is False,f'Chromium did not enter offline mode at {w}x{h}')
  check(page.locator('#bpEvidence').get_attribute('data-excluded')=='3','Excluded fixture candidates leaked')
  check(page.locator('#bpEvidence').get_attribute('data-runtime-integrated')=='false','Mock mistaken for integrated world')
  check(page.locator('#bpEvidence').get_attribute('data-world-writes')=='0','Offline browsing wrote to game')
  check(page.locator('#bpEvidence').get_attribute('data-saved')=='false','Offline browser claims a saved world')
  check(int(page.locator('#bpEvidence').get_attribute('data-rendered-rows'))<=20,'Virtualized rows exceeded cap')
  check(page.locator('[id^="place"], [id^="import"], [id^="save"]').count()==0,'Mutation controls present')
  check(not requests,'A network request occurred while network was blocked')
  bar=bounds(page,'.filterbar');mapbox=bounds(page,'#mapReservation');left=bounds(page,'.rail.left');right=bounds(page,'.rail.right');world=bounds(page,'.screen')
  check(left['x']+left['width']<=world['x']+2,'Left thumb rail overlaps screen')
  check(right['x']>=world['x']+world['width']-2,'Right thumb rail overlaps screen')
  check(bar['x']+bar['width']<=mapbox['x']+2,'Search bar obscures reserved minimap')
  check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1&&document.documentElement.scrollHeight<=innerHeight+1'),'Viewport overflow')
  page.locator('#bpSearch').fill('structure-0001')
  check(page.locator('#bpEvidence').get_attribute('data-match-count')=='0','Draft blueprint appeared offline')
  page.locator('#bpSearch').fill('structure-0003')
  check(page.locator('#bpEvidence').get_attribute('data-match-count')=='0','Missing-dependency blueprint appeared offline')
  page.locator('#bpSearch').fill('snow')
  check(int(page.locator('#bpEvidence').get_attribute('data-match-count'))>0,'Offline search broke')
  check(not errors,f'JavaScript errors at {w}x{h}: {errors}')
  if w in (568,956):
   page.locator('#bpSearch').fill('')
   page.screenshot(path=str(ART/f'm8-offline-blueprints-{w}x{h}.png'))
  context.close()

 # Detached checkpoint / undo / reload proof with Chromium network disabled.
 history=history_assets()
 for w,h in [(568,320),(956,440)]:
  context=browser.new_context(viewport={'width':w,'height':h},has_touch=True,is_mobile=True,offline=True)
  context.route('**/*',lambda route:route.abort())
  page=context.new_page();requests=[];errors=[]
  page.on('request',lambda r:requests.append(r.url) if r.url.startswith(('http://','https://')) else None)
  page.on('pageerror',lambda e:errors.append(str(e)))
  load(page,history,"document.querySelectorAll('#cellGrid .cell').length===100")
  check(page.evaluate('navigator.onLine') is False,'History lab not offline')
  page.locator('#place').click()
  check(page.locator('#historyEvidence').get_attribute('data-revision')=='1','Offline detached edit failed')
  page.locator('#saveHistory').click()
  check(page.locator('#historyEvidence').get_attribute('data-last-result')=='saved','Memory-only checkpoint save failed offline')
  page.locator('#undoHistory').click()
  check(page.locator('#historyEvidence').get_attribute('data-placements')=='0','Detached undo failed offline')
  page.locator('#redoHistory').click()
  check(page.locator('#historyEvidence').get_attribute('data-placements')=='1','Detached redo failed offline')
  page.locator('#saveHistory').click()
  check(page.locator('#historyEvidence').get_attribute('data-last-result')=='saved','Second checkpoint failed offline')
  page.locator('#corruptPrimary').click()
  page.locator('#reloadHistory').click()
  check(page.locator('#historyEvidence').get_attribute('data-last-result')=='loaded','Detached recovery failed offline')
  check(page.locator('#historyEvidence').get_attribute('data-save-source') in ('primary','backup'),'Recovery source invalid')
  check(not requests,'History requested external network')
  check(not errors,f'History JavaScript error offline: {errors}')
  if w==956:page.screenshot(path=str(ART/f'm8-offline-history-{w}x{h}.png'))
  context.close()
 browser.close()
print(f'PASS: {checks} M8 genuine offline Chromium assertions, {len(SIZES)} landscape blueprint layouts and 2 memory-history layouts; NO PWA/device claim')
