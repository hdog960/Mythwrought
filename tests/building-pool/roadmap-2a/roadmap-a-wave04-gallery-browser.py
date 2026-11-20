"""Roadmap A authentic 12 new-commerce source-coordinate Chromium WebGL2 test; opaque cube proxies only."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import hashlib,json,os,subprocess,sys,time,urllib.request,struct
root=Path(__file__).resolve().parents[3]
out=root/'artifacts'/'roadmap-a-wave04-cube-proxy'
out.mkdir(parents=True,exist_ok=True)
srv=subprocess.Popen([sys.executable,'-m','http.server','4173','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
records=[];groups=[];errors=[]
expected_source_ids=set(["r2:general-store:temperate:medium:05","r2:general-store:mountain:large:05","r2:pet-shop:desert:small:05","r2:pet-shop:snow:large:05","r2:magic-shop:mountain:small:05","r2:magic-shop:snow:large:05","r2:potion-shop:enchanted-forest:large:05","r2:potion-shop:temperate:medium:05","r2:bakery:temperate:medium:05","r2:bakery:mountain:large:05","r2:bank:enchanted-forest:small:03","r2:bank:mountain:large:02"])
source_file=root/'src'/'building-pool'/'roadmap-2a'/'roadmap-a-wave04.mjs'
renderer_file=root/'tests'/'building-pool'/'roadmap-2a'/'roadmap-a-wave04-gallery.mjs'
source_sha256=hashlib.sha256(source_file.read_bytes()).hexdigest()
renderer_sha256=hashlib.sha256(renderer_file.read_bytes()).hexdigest()
event_file=Path(os.environ.get('GITHUB_EVENT_PATH',''))
try:
 github_event=json.loads(event_file.read_text()) if event_file.is_file() else {}
except (OSError,ValueError):
 github_event={}
branch_head=github_event.get('pull_request',{}).get('head',{}).get('sha')

try:
 for t in range(100):
  try:
   urllib.request.urlopen('http://127.0.0.1:4173/tests/building-pool/roadmap-2a/roadmap-a-wave04-gallery.html',timeout=.5)
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
    page.goto('http://127.0.0.1:4173/tests/building-pool/roadmap-2a/roadmap-a-wave04-gallery.html?view='+view)
    page.wait_for_function('window.__MW2A_GALLERY?.ready === true',timeout=45000)
    ids=page.locator('#building option').evaluate_all('(nodes)=>nodes.map(n=>n.value)')
    if len(ids)!=12 or set(ids)!=expected_source_ids:raise AssertionError('Source ID mismatch against exact Wave04 canonical source ledger: '+repr(ids))
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
     if not(data['webgl2'] and data['glError']==0 and data['readbackError']==0 and data['id']==bid and data['view']==view and data['designCount']==12 and
       data['viewport']==[w,h] and data['total']>100 and data['drawn']>0 and data['inkSamples']>24 and
       data['canvasPixels'][0]>100 and data['canvasPixels'][1]>100 and not data['productionPhysicalFamilyGeometry'] and not data['realIphone']):
      raise AssertionError({'id':bid,'diagnostic':data})
     xmin,ymin,xmax,ymax=data['visibleBounds']
     cw,ch=data['canvasPixels']
     if not(2<xmin<=xmax<cw-3 and 2<ymin<=ymax<ch-3):
      raise AssertionError('Rendered source/camera not fully within canvas: '+repr({'id':bid,'bounds':data['visibleBounds'],'canvas':[cw,ch]}))
     if view=='exterior' and data['drawn']!=data['total']:raise AssertionError('Exterior incomplete: '+bid)
     if view=='cutaway' and data['drawn']>=data['total']:raise AssertionError('Roof cutaway incomplete: '+bid)
     fp=out/f'{w}x{h}-{view}-{idx:02d}.png'
     page.screenshot(path=str(fp),full_page=False,animations='disabled')
     blob=fp.read_bytes()
     if len(blob)<3000 or blob[:8]!=b'\\x89PNG\\r\\n\\x1a\\n':raise AssertionError('Invalid Chromium PNG: '+str(fp))
     pw,ph=struct.unpack('>II',blob[16:24])
     if (pw,ph)!=(w,h):raise AssertionError('Chromium PNG dimensions mismatch: '+repr((bid,pw,ph,w,h)))
     records.append({'id':bid,'viewport':[w,h],'view':view,'file':fp.name,
      'sourceCells':data['total'],'drawnCells':data['drawn'],'inkSamples':data['inkSamples'],
      'visibleBounds':data['visibleBounds'],'sha256':hashlib.sha256(blob).hexdigest()})
    groups.append({'viewport':[w,h],'view':view,'captured':len(ids),'renderer':'Chromium WebGL2 actual-source cube proxies'})
    print('BUILDER_2A_WEBGL2 '+json.dumps(groups[-1]),flush=True)
   page.close()
  br.close()
 if errors:raise AssertionError('Browser page errors: '+repr(errors[:10]))
 if len(records)!=72 or len({x['file'] for x in records})!=72 or len({x['id'] for x in records})!=12 or len({x['sha256'] for x in records})!=72:
  raise AssertionError('Missing 72 authentic source captures')
 report={'commit':os.environ.get('GITHUB_SHA'),'branchHeadFromEvent':branch_head,
  'sourceSHA256':source_sha256,'rendererSHA256':renderer_sha256,
  'sourceFile':str(source_file.relative_to(root)),
  'designs':12,'screenshots':72,'groups':groups,
  'realChromiumWebGL2':True,'actualAuthoredCells':True,'cubeProxiesOnly':True,'realPackFamilyMeshes':False,
  'roofSpanCertified':False,'windowMountCertified':False,'physicalIPhone':False,
  'creatorApproved':False,'integrated':False,'records':records}
 (out/'M1_72_WEBGL2_EVIDENCE.json').write_text(json.dumps(report,indent=2)+'\n')
 print('BUILDER_2A_GALLERY_PASS 72/72 genuine WebGL2 source-driven exterior/cutaway screenshots',flush=True)
finally:
 srv.terminate()
 try:srv.wait(timeout=3)
 except subprocess.TimeoutExpired:srv.kill()
