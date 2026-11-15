"""Real Chromium DOM/layout acceptance for detached Roadmap 9 M1 source.
Sources are injected into about:blank because localhost navigation is restricted in
the test environment. The original module import is remapped to a data URI; the
HTML, CSS and JS under test otherwise come from the exact feature files.
This does NOT test the production WebGL2 game or a physical iPhone.
"""
from pathlib import Path
import base64
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]/"src"/"creative-mode"
HTML=(ROOT/"preview.html").read_text().replace('<link rel="stylesheet" href="./preview.css">','').replace('<script type="module" src="./preview.mjs"></script>','')
CSS=(ROOT/"preview.css").read_text()
STATE_URL="data:text/javascript;base64,"+base64.b64encode((ROOT/"ux-state.mjs").read_bytes()).decode()
FLIGHT_URL="data:text/javascript;base64,"+base64.b64encode((ROOT/"flight-model.mjs").read_bytes()).decode()
JS=((ROOT/"preview.mjs").read_text()
    .replace("from './ux-state.mjs'",f"from '{STATE_URL}'")
    .replace("from './flight-model.mjs'",f"from '{FLIGHT_URL}'"))
def load_preview(page):
    page.set_content(HTML,wait_until="domcontentloaded")
    page.add_style_tag(content=CSS)
    page.add_script_tag(type="module",content=JS)
    page.wait_for_function("document.querySelectorAll('.slot').length===6")
SIZES=[(568,320),(667,375),(844,390),(932,430),(956,440),(1180,520)]
ART=Path('artifacts/creative-mode');ART.mkdir(parents=True,exist_ok=True)
checks=0
def check(condition,reason):
    global checks
    checks+=1
    assert condition,reason
def bounds(page,selector):
    return page.locator(selector).bounding_box()
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    for width,height in SIZES:
        context=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,is_mobile=True,has_touch=True)
        page=context.new_page();errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        load_preview(page)
        check(page.locator('.slot').count()==6,f'preview script not initialized at {width}')
        check(page.locator('#exploreMode').get_attribute('aria-pressed')=='true','starts explore')
        check(page.locator('#inventoryButton').is_disabled(),'inventory disabled in explore')
        check(page.locator('#inventoryPanel').is_hidden(),'no modal in explore')
        check(page.locator('.portrait-warning').is_hidden(),'landscape warning visible')
        screen=bounds(page,'.screen');left=bounds(page,'.rail.left');right=bounds(page,'.rail.right');world=bounds(page,'.world');maparea=bounds(page,'#miniMapReservation')
        check(left['x']+left['width']<=screen['x']+2,'left rail overlaps game')
        check(right['x']>=screen['x']+screen['width']-2,'right rail overlaps game')
        check(world['width']>=275,f'world too narrow: {width} {world}')
        check(maparea['x']>=world['x'] and maparea['x']+maparea['width']<=world['x']+world['width']+1,'map extends outside game')
        check(maparea['y']>=world['y'] and maparea['y']+maparea['height']<=world['y']+world['height']+1,'map clipped')
        check(page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1 && document.documentElement.scrollHeight<=window.innerHeight+1'),'screen scrolls unexpectedly')
        for selector,rail in [('#movePad',left),('#lookPad',right)]:
            b=bounds(page,selector)
            check(b['x']>=rail['x']-1 and b['x']+b['width']<=rail['x']+rail['width']+1,'pad outside thumb rail')
            check(b['width']>=55 and b['height']>=55,'pad too small')
        page.locator('#creativeMode').click()
        check(page.locator('#creativeMode').get_attribute('aria-pressed')=='true','creative switch failed')
        check(page.locator('#inventoryButton').is_enabled(),'creative inventory not activated')
        check(page.locator('.slot').count()==6,'hotbar count incorrect')
        check(page.locator('.slot[aria-pressed="true"]').count()==1,'hotbar selection missing')
        page.locator('.slot[data-slot="2"]').click()
        check(page.locator('.slot[data-slot="2"]').get_attribute('aria-pressed')=='true','hotbar select fails')
        page.locator('#inventoryButton').click()
        check(page.locator('#inventoryPanel').is_visible(),'inventory failed to open')
        check(page.locator('#inventorySearch').evaluate('(el)=>document.activeElement===el'),'inventory search not focused')
        panel=bounds(page,'#inventoryPanel');maparea=bounds(page,'#miniMapReservation')
        check(panel['x']+panel['width']<=maparea['x']-2,'inventory obscures upper-right minimap reservation')
        check(page.locator('.sample-item').count()==4,'preview sample grid incorrect')
        page.locator('#inventorySearch').fill('Tile C')
        check(page.locator('.sample-item').count()==1,'inventory search filtering broken')
        page.locator('#categories button[data-category="blocks"]').click()
        check(page.locator('.sample-item').count()==0,'category filter not applied')
        page.locator('#categories button[data-category="objects"]').click()
        check(page.locator('.sample-item').count()==1,'category filter not restored')
        page.locator('.sample-item').click()
        check('Sample tile C' in page.locator('.slot[data-slot="2"]').get_attribute('aria-label'),'hotbar assignment failed')
        check('Not placeable' in page.locator('#announcement').inner_text(),'safety label missing')
        page.locator('#clearHotbar').click()
        check('Sample tile C' not in page.locator('.slot[data-slot="2"]').get_attribute('aria-label'),'clear hotbar failed')
        page.keyboard.press('Escape')
        check(page.locator('#inventoryPanel').is_hidden(),'Escape failed to close modal')
        check(page.locator('#miniMapReservation').is_visible(),'map reservation disappeared')
        page.locator('#inventoryButton').click();page.locator('#closeInventory').click()
        check(page.locator('#inventoryPanel').is_hidden(),'close button failed')
        if width in (568,956):page.screenshot(path=str(ART/f'm1-creative-{width}x{height}.png'))
        page.locator('#exploreMode').click()
        check(page.locator('#inventoryButton').is_disabled(),'explore must disable inventory')
        check(page.locator('#inventoryPanel').is_hidden(),'explore failed to restore UI')
        check(not errors,f'page JS errors at {width}: {errors}')
        context.close()
    context=browser.new_context(viewport={'width':956,'height':440},device_scale_factor=1,is_mobile=True,has_touch=True)
    page=context.new_page();load_preview(page)
    pad=bounds(page,'#movePad');cx=pad['x']+pad['width']/2;cy=pad['y']+pad['height']/2
    page.mouse.move(cx,cy);page.mouse.down();page.mouse.move(cx+20,cy,steps=5)
    check('RIGHT' in page.locator('#moveReadout').inner_text(),'movement preview does not track drag')
    page.mouse.up()
    check(page.locator('#moveReadout').inner_text()=='IDLE','pointer release did not reset pad')
    check(page.locator('.thumb-pad.active').count()==0,'pad kept active after release')
    page.set_viewport_size({'width':390,'height':844})
    check(page.locator('.portrait-warning').is_visible(),'portrait warning missing')
    context.close();browser.close()
print(f'PASS: {checks} genuine Chromium M1 browser assertions across {len(SIZES)} landscape sizes + drag/portrait')
