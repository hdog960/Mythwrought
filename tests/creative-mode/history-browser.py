"""M5 exact feature-source Chromium history, recovery, revision and landscape evidence.
Data-URL modules and DOM served solely in Playwright; no game/site/navigation.
"""
import base64
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'src/creative-mode'
HTML=(SOURCE/'history-preview.html').read_text().replace('<link rel="stylesheet" href="./build-preview.css">','').replace('<link rel="stylesheet" href="./history-preview.css">','').replace('<script type="module" src="./history-preview.mjs"></script>','')
CSS=(SOURCE/'build-preview.css').read_text()+'\n'+(SOURCE/'history-preview.css').read_text()
def uri(s):return 'data:text/javascript;base64,'+base64.b64encode(s.encode()).decode()
ADAPTER=uri((SOURCE/'adapter-contract.mjs').read_text())
INVENTORY=uri((SOURCE/'inventory-model.mjs').read_text().replace("from './adapter-contract.mjs'",f"from '{ADAPTER}'"))
BUILD=uri((SOURCE/'build-model.mjs').read_text().replace("from './adapter-contract.mjs'",f"from '{ADAPTER}'").replace("from './inventory-model.mjs'",f"from '{INVENTORY}'"))
HISTORY=uri((SOURCE/'history-model.mjs').read_text().replace("from './build-model.mjs'",f"from '{BUILD}'"))
SAVE=uri((SOURCE/'save-compat.mjs').read_text().replace("from './build-model.mjs'",f"from '{BUILD}'").replace("from './history-model.mjs'",f"from '{HISTORY}'"))
JS=(SOURCE/'history-preview.mjs').read_text().replace("from './history-model.mjs'",f"from '{HISTORY}'").replace("from './save-compat.mjs'",f"from '{SAVE}'")
SIZES=[(568,320),(667,375),(844,390),(932,430),(956,440),(1180,520)]
ART=ROOT/'artifacts/creative-mode';ART.mkdir(parents=True,exist_ok=True)
checks=0
def check(condition,message):
 global checks
 checks+=1
 assert condition,message

def get(page,sel):return page.locator(sel).bounding_box()
def evidence(page,field):
 import re
 return page.locator('#historyEvidence').get_attribute('data-'+re.sub(r'([A-Z])',lambda m:'-'+m.group(1).lower(),field))
def load(page):
 page.set_content(HTML,wait_until='domcontentloaded')
 page.add_style_tag(content=CSS)
 page.add_script_tag(type='module',content=JS)
 page.wait_for_function("document.querySelectorAll('#cellGrid .cell').length===100")

with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h in SIZES:
  context=browser.new_context(viewport={'width':w,'height':h},has_touch=True,is_mobile=True,device_scale_factor=1)
  page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  load(page)
  check(evidence(page,'revision')=='0',f'Initial revision incorrect at {w}x{h}')
  check(evidence(page,'placements')=='0','Default world not empty')
  check(evidence(page,'undo')=='0' and evidence(page,'redo')=='0','Initial history not empty')
  check('NO LIVE SAVE' in page.locator('.status').inner_text(),'Detached label missing')
  check(page.locator('#mapReservation').is_visible(),'Minimap reservation missing')
  check(page.locator('#portraitWarning').is_hidden(),'Portrait warning shown in landscape')
  left=get(page,'.rail.left');right=get(page,'.rail.right');world=get(page,'.screen');mapbox=get(page,'#mapReservation')
  check(left['x']+left['width']<=world['x']+2,'Left rail covers center screen')
  check(right['x']>=world['x']+world['width']-2,'Right rail covers center screen')
  check(mapbox['x']>=world['x'] and mapbox['x']+mapbox['width']<=world['x']+world['width']+1,'Map escapes viewport')
  check(mapbox['y']>=world['y'] and mapbox['y']+mapbox['height']<=world['y']+world['height'],'Map spills beyond screen')
  check(left['height']<=h+1 and right['height']<=h+1,'Rail height exceeds landscape screen')
  check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1 && document.documentElement.scrollHeight<=innerHeight+1'),'Page scroll overflow')
  selectors_left=['#saveHistory','#reloadHistory','#simulateQuota','#corruptPrimary']
  selectors_right=['#undoHistory','#redoHistory','#staleRevision','#resetLab']
  for sel in selectors_left+selectors_right:
   b=get(page,sel);side=left if sel in selectors_left else right
   check(b['width']>=27 and b['height']>=20,f'Touch control undersized {sel}: {b} at {w}x{h}')
   check(b['x']>=side['x']-1 and b['x']+b['width']<=side['x']+side['width']+1,f'Tool crosses rail boundary {sel}')
   check(b['y']>=side['y']-1 and b['y']+b['height']<=side['y']+side['height']+1,f'Tool crosses vertical rail {sel}')
  commands=get(page,'.commands');check(commands['y']+commands['height']<=h-14,'Command bar spills into bottom bezel')
  check(mapbox['y']+mapbox['height']<=commands['y'],'Map overlaps edit toolbar')
  check(evidence(page,'lastResult') is None,'Preview performed an edit on load')
  page.locator('#place').click()
  check(evidence(page,'revision')=='1' and evidence(page,'placements')=='1','Placed transaction did not execute')
  check(evidence(page,'undo')=='1' and evidence(page,'redo')=='0','Undo history not created')
  page.locator('#undoHistory').click()
  check(evidence(page,'revision')=='2' and evidence(page,'placements')=='0','Executable undo failed')
  check(evidence(page,'undo')=='0' and evidence(page,'redo')=='1','Undo failed to expose redo')
  page.locator('#redoHistory').click()
  check(evidence(page,'revision')=='3' and evidence(page,'placements')=='1','Executable redo failed')
  page.locator('#staleRevision').click()
  check(evidence(page,'lastResult')=='revision-conflict','Stale version conflict was accepted')
  check(evidence(page,'revision')=='3','Stale conflict changed revision')
  page.locator('#saveHistory').click()
  check(evidence(page,'lastResult')=='saved','Memory-only checkpoint save failed')
  check('MEMORY ONLY' in page.locator('#historyStatus').inner_text(),'Save did not disclose memory-only storage')
  page.locator('#targetX').fill('3');page.locator('#targetZ').fill('3');page.locator('#place').click()
  check(evidence(page,'revision')=='4' and evidence(page,'placements')=='2','Additional edit failed')
  page.locator('#saveHistory').click();check(evidence(page,'lastResult')=='saved','Second checkpoint failed')
  page.locator('#corruptPrimary').click();check(evidence(page,'lastResult')=='corrupt','Corruption simulation failed')
  page.locator('#reloadHistory').click()
  check(evidence(page,'lastResult')=='loaded','Backup reload failed after corruption')
  check(evidence(page,'saveSource')=='backup','Verified backup was not used')
  check(evidence(page,'revision')=='3' and evidence(page,'placements')=='1','Backup revision not restored')
  page.locator('#targetX').fill('4');page.locator('#targetZ').fill('4');page.locator('#place').click()
  check(evidence(page,'revision')=='4','Post-recovery editing failed')
  page.locator('#simulateQuota').click();check(evidence(page,'lastResult')=='quota','Quota error not simulated')
  page.locator('#reloadHistory').click()
  check(evidence(page,'revision')=='3' and evidence(page,'placements')=='1','Quota error damaged committed backup')
  page.locator('#resetLab').click();check(evidence(page,'revision')=='0' and evidence(page,'placements')=='0','Reset failed')
  page.locator('#reloadHistory').click();check(evidence(page,'revision')=='3','Reset lost the checkpoint')
  page.locator('#chooseObject').click();page.locator('#rotateShape').click()
  check(page.locator('#rotation').inner_text()=='90°','Object rotation control failed')
  page.locator('#targetX').fill('0');page.locator('#targetZ').fill('2');page.locator('#place').click()
  check(evidence(page,'placements')=='2','Shaped object placement failed after recovery')
  page.locator('#undoHistory').click();check(evidence(page,'placements')=='1','Object undo failed')
  page.locator('#redoHistory').click();check(evidence(page,'placements')=='2','Object redo failed')
  check(len(errors)==0,f'Browser errors at {w}x{h}: {errors}')
  if w in (568,956):
   page.screenshot(path=str(ART/f'm5-history-{w}x{h}.png'))
  context.close()
 portrait=browser.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
 pp=portrait.new_page();load(pp);check(pp.locator('#portraitWarning').is_visible(),'Portrait warning missing')
 portrait.close();browser.close()
print(f'PASS: {checks} genuine Chromium M5 assertions across {len(SIZES)} landscape sizes and portrait')
