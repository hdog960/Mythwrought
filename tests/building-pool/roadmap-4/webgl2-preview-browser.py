"""Native WebGL2-only mobile architecture gallery; fails closed if context/screenshot fails.
Run from repository root: python3 tests/building-pool/roadmap-4/webgl2-preview-browser.py
Requires Playwright + Chromium. Does not modify the game or commit screenshots.
"""
import asyncio, json, pathlib, subprocess, time, urllib.parse
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).parents[3]
OUT=ROOT/'artifacts'/'r4-webgl2'
URL='http://127.0.0.1:4173/tests/building-pool/roadmap-4/webgl2-preview.html'
SAMPLES=[(t,b,s) for t in ('civic-hall','castle-palace') for b in ('temperate','desert','snow','enchanted-forest','mountain') for s in ('small','medium','large')]
VIEWPORTS=[(667,375),(844,390),(932,430)]
async def main():
 OUT.mkdir(parents=True,exist_ok=True)
 webserver=subprocess.Popen(['python3','-m','http.server','4173','--directory',str(ROOT)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 results=[]
 try:
  await asyncio.sleep(.4)
  async with async_playwright() as p:
   browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
   try:
    for width,height in VIEWPORTS:
     context=await browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,is_mobile=True,has_touch=True)
     for t,b,s in SAMPLES:
      for cutaway in (False,True):
       page=await context.new_page();errors=[]
       page.on('pageerror',lambda err:errors.append(str(err)))
       floor=2 if s=='large' else (1 if t=='castle-palace' or s=='medium' else 0)
       q=urllib.parse.urlencode({'type':t,'biome':b,'size':s,'cutaway':int(cutaway),'floor':floor})
       await page.goto(URL+'?'+q,wait_until='load',timeout=30000)
       await page.wait_for_function('Boolean(window.__roadmap4Webgl2)',timeout=20000)
       data=await page.evaluate('window.__roadmap4Webgl2')
       if not data or not data['webgl2'] or data['lost'] or data['triangles']<100 or errors:
        raise RuntimeError(f'WebGL2 acceptance FAILED {t}/{b}/{s}: {data} / {errors}')
       name=f'{t}-{b}-{s}-{width}x{height}-'+('section' if cutaway else 'complete')+'.png'
       await page.screenshot(path=str(OUT/name));results.append({'file':name,'data':data,'errors':errors})
       await page.close()
     await context.close()
   finally: await browser.close()
 finally:
  webserver.terminate();webserver.wait(timeout=5)
 (OUT/'results.json').write_text(json.dumps(results,indent=2))
 assert len(results)==180 and all(x['data']['webgl2'] for x in results)
 print('PASS authentic WebGL2-only preview: 30 buildings × 2 views × 3 sizes')
if __name__=='__main__':asyncio.run(main())
