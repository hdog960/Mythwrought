"""Run from full repo root: python3 tests/building-pool/roadmap-2a/m1-gallery-browser.py
Produces genuine Chromium WebGL2 *cube-proxy* screenshots, not physical-family meshes.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os,subprocess,sys,time,urllib.request
root=Path(__file__).resolve().parents[3]
out=root/'artifacts'/'roadmap-2a-cube-proxy'
out.mkdir(parents=True,exist_ok=True)
srv=subprocess.Popen([sys.executable,'-m','http.server','4173','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
 for t in range(40):
  try:urllib.request.urlopen('http://127.0.0.1:4173/',timeout=.5);break
  except Exception:time.sleep(.2)
 else:raise RuntimeError('Missing HTTP listener')
 with sync_playwright() as p:
  opt={'headless':True,'args':['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox','--disable-dev-shm-usage']}
  if os.getenv('CHROMIUM_EXECUTABLE'):opt['executable_path']=os.environ['CHROMIUM_EXECUTABLE']
  br=p.chromium.launch(**opt)
  for w,h in [(667,375),(844,390),(932,430)]:
   page=br.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
   for view in ['exterior','cutaway']:
    page.goto('http://127.0.0.1:4173/tests/building-pool/roadmap-2a/m1-gallery.html?view='+view)
    page.wait_for_function("window.__MW2A_GALLERY?.ready===true",timeout=30000)
    ids=page.locator('#building option').evaluate_all('(nodes)=>nodes.map(n=>n.value)')
    if len(ids)!=50:raise AssertionError('Source building count')
    for idx,bid in enumerate(ids):
     page.select_option('#building',bid)
     data=page.evaluate('window.__MW2A_GALLERY')
     if not(data['webgl2'] and data['glError']==0 and data['id']==bid and data['view']==view and data['total']>100 and data['drawn']>0):raise AssertionError(data)
     fp=out/f'{w}x{h}-{view}-{idx:02d}.png'
     page.screenshot(path=str(fp),full_page=True)
     if fp.read_bytes()[:8]!=b'\x89PNG\r\n\x1a\n':raise AssertionError('Invalid screenshot file')
    print(json.dumps({'viewport':[w,h],'view':view,'count':len(ids),'renderer':'actual WebGL2 diagnostic cube proxies'}),flush=True)
   page.close()
  br.close()
finally:
 srv.terminate()
 try:srv.wait(timeout=3)
 except subprocess.TimeoutExpired:srv.kill()
