"""Actual system Chromium DOM, input and layout tests of detached M2 sources.
ESM source is loaded from original feature files into about:blank; this is NOT
production game, real WebGL2, live chunk streaming, Safari or physical iPhone.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64
ROOT=Path(__file__).resolve().parents[2]/'src'/'creative-mode'
HTML=(ROOT/'preview.html').read_text().replace('<link rel="stylesheet" href="./preview.css">','').replace('<script type="module" src="./preview.mjs"></script>','')
CSS=(ROOT/'preview.css').read_text()
def uri(path):return 'data:text/javascript;base64,'+base64.b64encode((ROOT/path).read_bytes()).decode()
JS=((ROOT/'preview.mjs').read_text().replace("from './ux-state.mjs'",f"from '{uri('ux-state.mjs')}'")
    .replace("from './flight-model.mjs'",f"from '{uri('flight-model.mjs')}'"))
def load(page):
 page.set_content(HTML,wait_until='domcontentloaded');page.add_style_tag(content=CSS)
 page.add_script_tag(type='module',content=JS)
 page.wait_for_function("document.querySelectorAll('.slot').length===6 && document.querySelector('#flightTelemetry').dataset.x !== undefined")
def pos(page):return page.locator('#flightTelemetry').evaluate('(e)=>({x:+e.dataset.x,y:+e.dataset.y,z:+e.dataset.z,active:e.dataset.active,blocked:e.dataset.blocked,pending:+e.dataset.pending})')
def b(page,sel):return page.locator(sel).bounding_box()
SIZES=[(568,320),(667,375),(844,390),(932,430),(956,440),(1180,520)]
count=0
def check(value,why):
 global count;count+=1
 assert value,why
ART=Path('artifacts/creative-mode');ART.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in SIZES:
  context=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,is_mobile=True,has_touch=True)
  page=context.new_page();errors=[];page.on('pageerror',lambda err: errors.append(str(err)));load(page)
  check(page.locator('#flightToggle').is_disabled(),'Explore should disable flight')
  check(not page.locator('#flightDashboard').is_visible(),'Explore should hide flight dashboard')
  rail=b(page,'.rail.right');screen=b(page,'.world');maparea=b(page,'#miniMapReservation')
  for sel in ['#ascend','#descend','#flightToggle','#landButton']:
   x=b(page,sel)
   check(x['x']>=rail['x']-1 and x['x']+x['width']<=rail['x']+rail['width']+1 and x['y']>=rail['y']-1 and x['y']+x['height']<=rail['y']+rail['height']+1,f'{sel} outside right rail at {width}')
  page.locator('#creativeMode').click()
  check(page.locator('#flightToggle').is_enabled(),'Creative did not enable flight toggle')
  d=b(page,'#flightDashboard')
  check(d['x']>=screen['x'] and d['x']+d['width']<=screen['x']+screen['width']+1,'speed controls outside screen')
  check(d['y']>=maparea['y']+maparea['height']-1,'speed controls overlap minimap region')
  check(d['y']+d['height']<=b(page,'#hotbar')['y']+1,f"speed controls overlap hotbar {width}: dashboard={d}, hotbar={b(page,'#hotbar')}")
  page.locator('#flightProfiles button[data-speed="fast"]').click()
  check(page.locator('#flightProfiles button[data-speed="fast"]').get_attribute('aria-pressed')=='true','fast profile did not select')
  page.locator('#flightToggle').click()
  check(pos(page)['active']=='true','flight did not activate')
  check(page.locator('#flightToggle').get_attribute('aria-pressed')=='true','fly button not pressed')
  y0=pos(page)['y'];r=b(page,'#ascend');page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.wait_for_timeout(200);page.mouse.up()
  check(pos(page)['y']>y0+0.1,'ascent hold did not raise player')
  y1=pos(page)['y'];r=b(page,'#descend');page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.wait_for_timeout(130);page.mouse.up()
  check(pos(page)['y']<y1-0.1,'descent hold did not lower player')
  page.locator('#flightProfiles button[data-speed="precision"]').click()
  check(page.locator('#flightProfiles button[data-speed="precision"]').get_attribute('aria-pressed')=='true','precision profile failed')
  page.keyboard.down('w');page.wait_for_timeout(160);page.keyboard.up('w')
  check(pos(page)['z']>0.05,'keyboard directional flight did not advance')
  page.locator('#inventoryButton').click()
  check(page.locator('#ascend').is_disabled(),'drawer should lock flight controls')
  frozen=pos(page);page.keyboard.down('w');page.wait_for_timeout(90);page.keyboard.up('w')
  check(pos(page)==frozen,'flight moved while inventory drawer open')
  panel=b(page,'#inventoryPanel')
  check(panel['x']+panel['width']<=maparea['x']-2,'inventory overlay covered map')
  page.keyboard.press('Escape')
  check(page.locator('#ascend').is_enabled(),'closing drawer failed to restore flight controls')
  page.locator('#landButton').click()
  check(pos(page)['active']=='false' and pos(page)['y']==4,'safe landing did not stop flight at fixture floor')
  page.locator('#flightToggle').click()
  check(pos(page)['active']=='true','flight could not restart after landing')
  page.locator('#exploreMode').click()
  check(pos(page)['active']=='false' and page.locator('#flightToggle').is_disabled(),'return to Explore left flight enabled')
  check(page.locator('#miniMapReservation').is_visible(),'minimap reservation disappeared')
  check(not errors,f'JS page exception {width}: {errors}')
  if width in (568,956):
   page.locator('#creativeMode').click();page.locator('#flightToggle').click()
   page.screenshot(path=str(ART/f'm2-flight-{width}x{height}.png'))
  context.close()
 context=browser.new_context(viewport={'width':956,'height':440},has_touch=True,is_mobile=True)
 page=context.new_page();load(page);page.locator('#creativeMode').click();page.locator('#flightToggle').click()
 pad=b(page,'#movePad');cx=pad['x']+pad['width']/2;cy=pad['y']+pad['height']/2
 page.mouse.move(cx,cy);page.mouse.down();page.mouse.move(cx,cy-20,steps=4);page.wait_for_timeout(180)
 check(pos(page)['z']>0.05,'dragged left-pad did not fly forward')
 page.mouse.up();frozen=pos(page);page.wait_for_timeout(80)
 check(abs(pos(page)['z']-frozen['z'])<0.03,'left-pad input stuck after release')
 look=b(page,'#lookPad');cx=look['x']+look['width']/2;cy=look['y']+look['height']/2
 page.mouse.move(cx,cy);page.mouse.down();page.mouse.move(cx+20,cy,steps=4);page.wait_for_timeout(100);page.mouse.up()
 check(not page.locator('.thumb-pad.active').count(),'active pointer remains after release')
 page.set_viewport_size({'width':390,'height':844})
 check(page.locator('.portrait-warning').is_visible(),'portrait guard not visible')
 context.close();browser.close()
print(f'PASS: {count} actual Chromium M2 browser assertions across {len(SIZES)} landscape sizes, pointer controls and portrait')
