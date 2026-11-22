"""M7 genuine Chromium DOM/layout/read-only eligibility test. Exact feature files.
No live game, network, server, deployment or mobile hardware access.
"""
import base64
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
SRC=ROOT/'src/creative-mode'
HTML=(SRC/'blueprint-preview.html').read_text().replace('<link rel="stylesheet" href="./build-preview.css">','').replace('<link rel="stylesheet" href="./blueprint-preview.css">','').replace('<script type="module" src="./blueprint-preview.mjs"></script>','')
CSS=(SRC/'build-preview.css').read_text()+'\n'+(SRC/'blueprint-preview.css').read_text()
def data(js):return 'data:text/javascript;base64,'+base64.b64encode(js.encode()).decode()
MODEL=data((SRC/'blueprint-browser.mjs').read_text())
FIXTURE=data((SRC/'blueprint-fixture.mjs').read_text().replace("from './blueprint-browser.mjs'",f"from '{MODEL}'"))
UI=(SRC/'blueprint-preview.mjs').read_text().replace("from './blueprint-browser.mjs'",f"from '{MODEL}'").replace("from './blueprint-fixture.mjs'",f"from '{FIXTURE}'")
SIZES=[(568,320),(667,375),(844,390),(932,430),(956,440),(1180,520)]
ART=ROOT/'artifacts/creative-mode';ART.mkdir(parents=True,exist_ok=True)
checks=0
def check(v,msg):
 global checks
 checks+=1
 assert v,msg
def evidence(page,k):
 import re
 attr='data-'+re.sub(r'[A-Z]',lambda m:'-'+m.group().lower(),k)
 return page.locator('#bpEvidence').get_attribute(attr)
def bounds(page,selector):return page.locator(selector).bounding_box()
def load(page):
 page.set_content(HTML,wait_until='domcontentloaded')
 page.add_style_tag(content=CSS)
 page.add_script_tag(type='module',content=UI)
 page.wait_for_function("document.querySelector('#bpEvidence')?.dataset.eligible === '297'")
with sync_playwright() as driver:
 browser=driver.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h in SIZES:
  context=browser.new_context(viewport={'width':w,'height':h},has_touch=True,is_mobile=True,device_scale_factor=1)
  page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  load(page)
  check(evidence(page,'eligible')=='297','Eligible fixture count wrong')
  check(evidence(page,'excluded')=='3','Draft/unapproved/dependency failures not excluded')
  check(evidence(page,'fixture')=='true','Test fixture not marked as synthetic')
  check(evidence(page,'runtimeIntegrated')=='false','False live-integration claim')
  check(evidence(page,'worldWrites')=='0','Unexpected world edit')
  check(evidence(page,'saved')=='false','Unexpected persistent save')
  check(int(evidence(page,'renderedRows'))<=20,'Unbounded DOM result list')
  check(page.locator('.bp-row').count()<=20,'Actual results exceed virtualization cap')
  check(page.locator('[id^="place"], [id^="save"], [id^="import"]').count()==0,'Mutating controls in read-only browser')
  check(page.locator('#portraitWarning').is_hidden(),'Portrait overlay visible landscape')
  check(page.locator('#mapReservation').is_visible(),'Minimap reservation absent')
  check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1&&document.documentElement.scrollHeight<=innerHeight+1'),f'Page overflow {w}x{h}')
  left=bounds(page,'.rail.left');right=bounds(page,'.rail.right');center=bounds(page,'.screen');mini=bounds(page,'#mapReservation');bar=bounds(page,'.filterbar');body=bounds(page,'.catalog-body');list_bounds=bounds(page,'.blueprint-list');detail=bounds(page,'.blueprint-detail')
  check(left['x']+left['width']<=center['x']+2,'Left thumb rail overlaps world')
  check(right['x']>=center['x']+center['width']-2,'Right thumb rail overlaps world')
  check(center['width']>=245,'World width collapsed below 245px')
  check(left['y']+left['height']<=h+1 and right['y']+right['height']<=h+1,'Thumb rail clips screen')
  check(bar['x']+bar['width']<=mini['x']+2,'Search controls overlap map')
  check(body['x']>=center['x'] and body['x']+body['width']<=center['x']+center['width']+1,'Panel escapes center')
  check(list_bounds['x']+list_bounds['width']<=detail['x']+1,'List/details overlap')
  check(mini['x']>=center['x'] and mini['x']+mini['width']<=center['x']+center['width']+1,'Map outside world')
  check(mini['y']+mini['height']<=body['y']+1,'Map overlapped by catalog panel')
  check(page.locator('#bpCanvas').is_visible() and int(evidence(page,'previewCells'))<=96,'No bounded preview')
  # Query on a draft or missing dependency ID must not expose it as eligible.
  page.locator('#bpSearch').fill('structure-0001')
  check(evidence(page,'matchCount')=='0','Draft blueprint leaked via search')
  check(evidence(page,'selectedId')=='','Stale selection leaked when no match')
  page.locator('#bpSearch').fill('structure-0003')
  check(evidence(page,'matchCount')=='0','Unresolved-dependency blueprint leaked via search')
  page.locator('#bpSearch').fill('snow')
  check(int(evidence(page,'matchCount'))>0,'Search did not return snow samples')
  check(int(evidence(page,'renderedRows'))<=20,'Search produced unbounded results')
  page.locator('#bpBiome').select_option('snow')
  check(int(evidence(page,'matchCount'))>0,'Snow biome filter failed')
  check(page.locator('#bpDescription').count()==1,'Missing or duplicate description')
  # Only read-only result buttons and select elements are actionable.
  page.locator('#bpSearch').fill('')
  page.locator('#bpBiome').select_option('all')
  page.locator('#bpKind').select_option('arcane')
  check(int(evidence(page,'matchCount'))>0,'Kind filter failed')
  page.locator('#bpSize').select_option('medium')
  check(int(evidence(page,'matchCount'))>0,'Size filter failed')
  page.locator('#bpKind').select_option('all');page.locator('#bpSize').select_option('all')
  rows=page.locator('.bp-row');check(rows.count()>1,'Expected browsable list rows')
  item=rows.nth(1);item.click()
  check(evidence(page,'selectedId')==item.get_attribute('data-id'),'Row click failed to select thumbnail')
  check(int(evidence(page,'previewCells'))>0,'Selected preview is empty')
  # Genuine Chromium scrolling: only a bounded window of the 297 records remains in the DOM.
  page.locator('#bpListScroller').evaluate('(el)=>el.scrollTop=1300')
  page.wait_for_function("Number(document.querySelector('#bpEvidence').dataset.scrollOffset)>0")
  check(int(evidence(page,'renderedRows'))<=20,'Scrolled results were not virtualized')
  check(int(evidence(page,'scrollOffset'))>0,'List scroll did not advance')
  check(evidence(page,'worldWrites')=='0' and evidence(page,'saved')=='false','Browse caused writes')
  check(not errors,f'Browser errors at {w}x{h}: {errors}')
  if w in (568,956):
   page.locator('#bpListScroller').evaluate('(el)=>el.scrollTop=0')
   page.screenshot(path=str(ART/f'm7-blueprints-{w}x{h}.png'))
  context.close()
 portrait=browser.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
 page=portrait.new_page();load(page)
 check(page.locator('#portraitWarning').is_visible(),'Missing portrait rotation warning')
 portrait.close();browser.close()
print(f'PASS: {checks} genuine Chromium M7 assertions across {len(SIZES)} landscape viewports + portrait')
