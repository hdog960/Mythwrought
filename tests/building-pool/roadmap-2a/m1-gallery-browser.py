"""Builder 2A authentic source-coordinate Chromium WebGL2 test; opaque cube proxies only."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import hashlib,json,os,subprocess,sys,time,urllib.request
root=Path(__file__).resolve().parents[3]
out=root/'artifacts'/'roadmap-2a-cube-proxy'
out.mkdir(parents=True,exist_ok=True)
srv=subprocess.Popen([sys.executable,'-m','http.server','4173','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
records=[];groups=[];errors=[]
try:
 for t in range(100):
  try:
   urllib.request.urlopen('http://127.0.0.1:4173/tests/building-pool/roadmap-2a/m1-gallery.html',timeout=.5)
   break
  except Exception:time.sleep(.2)
 else:raise RuntimeError('Source gallery HTTP server not responding')
 with sync_playwright() as p:
  opts={'headless':True,'args':['--no-proxy-server','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox','--disable-dev-shm-usage']}
  if os.getenv('CHROMIUM_EXECUTABLE'):opts['executable_path']=os.environ['CHROMIUM_EXECUTABLE']
  br=p.chromium.launch(**opts)
  for w,h in [(667,375),(844,390),(932,430)]:
   page=br.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
   page.on('pageerror',lambda e: errors.append(str(e)))
   for view in ['exterior','cutaway']:
    page.goto('http://127.0.0.1:4173/tests/building-pool/roadmap-2a/m1-gallery.html?view='+view)
    page.wait_for_function('window.__MW2A_GALLERY?.ready === true',timeout=45000)
    ids=page.locator('#building option').evaluate_all('(nodes)=>nodes.map(n=>n.value)')
    if len(ids)!=80 or len(set(ids))!=74:raise AssertionError('Invalid actual source ID count')
    for idx,bid in enumerate(ids):
     page.select_option('#building',bid)
     data=page.evaluate('''() => {
      const d=window.__MW2A_GALLERY,canvas=document.getElementById('scene'),gl=canvas.getContext('webgl2');
      gl.finish();const w=canvas.width,h=canvas.height,buf=new Uint8Array(w*h*4);
      gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,buf);
      let ink=0,xmin=w,ymin=h,xmax=-1,ymax=-1;
      for(let y=0;y<h;y+=4)for(let x=0;x<w;x+=4){
       const i=(y*w+x)*4;
       if(Math.abs(buf[i]-18)+Math.abs(buf[i+1]-33)+Math.abs(buf[i+2]-41)>42){
        ink++;xmin=Math.min(xmin,x);xmax=Math.max(xmax,x);ymin=Math.min(ymin,y);ymax=Math.max(ymax,y);
       }
      }
      return {...d,inkSamples:ink,canvasPixels:[w,h],visibleBounds:[xmin,ymin,xmax,ymax],readbackError:gl.getError()};
     }''')
     if not(data['webgl2'] and data['glError']==0 and data['readbackError']==0 and data['id']==bid and data['view']==view and data['designCount']==80 and
       data['viewport']==[w,h] and data['total']>100 and data['drawn']>0 and data['inkSamples']>24 and
       data['canvasPixels'][0]>100 and data['canvasPixels'][1]>100 and not data['productionPhysicalFamilyGeometry'] and not data['realIphone']):
      raise AssertionError({'id':bid,'diagnostic':data})
     if view=='exterior' and data['drawn']!=data['total']:raise AssertionError('Exterior incomplete: '+bid)
     if view=='cutaway' and data['drawn']>=data['total']:raise AssertionError('Roof cutaway incomplete: '+bid)
     fp=out/f'{w}x{h}-{view}-{idx:02d}.png'
     page.screenshot(path=str(fp),full_page=False,animations='disabled')
     blob=fp.read_bytes()
     if len(blob)<3000 or blob[:8]!=b'\x89PNG\r\n\x1a\n':raise AssertionError('Invalid Chromium PNG: '+str(fp))
     records.append({'id':bid,'viewport':[w,h],'view':view,'file':fp.name,
      'sourceCells':data['total'],'drawnCells':data['drawn'],'inkSamples':data['inkSamples'],
      'visibleBounds':data['visibleBounds'],'sha256':hashlib.sha256(blob).hexdigest()})
    groups.append({'viewport':[w,h],'view':view,'captured':len(ids),'renderer':'Chromium WebGL2 actual-source cube proxies'})
    print('BUILDER_2A_WEBGL2 '+json.dumps(groups[-1]),flush=True)
   page.close()
  br.close()
 if errors:raise AssertionError('Browser page errors: '+repr(errors[:10]))
 if len(records)!=480 or len({x['file'] for x in records})!=480 or len({x['id'] for x in records})!=74:
  raise AssertionError('Missing 480 authentic source captures')
 report={'commit':os.environ.get('GITHUB_SHA'),'designs':80,'screenshots':480,'groups':groups,
  'realChromiumWebGL2':True,'actualAuthoredCells':True,'cubeProxiesOnly':True,'realPackFamilyMeshes':False,
  'roofSpanCertified':False,'windowMountCertified':False,'physicalIPhone':False,
  'creatorApproved':False,'integrated':False,'records':records}
 (out/'M1_480_WEBGL2_EVIDENCE.json').write_text(json.dumps(report,indent=2)+'\n')
 print('BUILDER_2A_GALLERY_PASS 480/480 genuine WebGL2 source-driven exterior/cutaway screenshots',flush=True)
finally:
 srv.terminate()
 try:srv.wait(timeout=3)
 except subprocess.TimeoutExpired:srv.kill()
