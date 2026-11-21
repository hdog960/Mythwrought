"""36 real Chromium WebGL2 frames of the genuine six physical Pack5 producer variants, not building placements."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
import hashlib,json,os,struct,time,urllib.request
root=Path(__file__).resolve().parents[3]
out=root/'artifacts'/'roadmap-a-pack5-physical-producer'
out.mkdir(parents=True,exist_ok=True)
producer=root/'src'/'block-packs'/'pack-5'/'architectural-surfaces.mjs'
renderer=root/'tests'/'building-pool'/'roadmap-2a'/'roadmap-a-pack5-producer-witness.mjs'
sha=lambda b:hashlib.sha256(b).hexdigest()
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(root)))
server.daemon_threads=True
thread=Thread(target=server.serve_forever,daemon=True)
thread.start()
url=f'http://127.0.0.1:{server.server_port}/tests/building-pool/roadmap-2a/roadmap-a-pack5-producer-witness.html'
expected={'pack5:079/chalk-lime','pack5:079/hand-troweled','pack5:080/hearth-running-bond','pack5:080/kiln-soldier-course','pack5:081/sunburst-encaustic','pack5:081/moonwoven-glaze'}
records=[];groups=[];errors=[]
try:
 for attempt in range(80):
  try:urllib.request.urlopen(url,timeout=.5);break
  except OSError:time.sleep(.2)
 else:raise RuntimeError('True physical producer gallery HTTP endpoint unavailable')
 with sync_playwright() as p:
  launch={'headless':True,'args':['--no-proxy-server','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox','--disable-dev-shm-usage']}
  if os.getenv('CHROMIUM_EXECUTABLE'):launch['executable_path']=os.environ['CHROMIUM_EXECUTABLE']
  browser=p.chromium.launch(**launch)
  for w,h in [(667,375),(844,390),(932,430)]:
   page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
   page.on('pageerror',lambda e:errors.append(str(e)))
   for view in ['front','side']:
    page.goto(url+'?view='+view)
    page.wait_for_function('window.__MW2A_PACK5_WITNESS?.ready === true',timeout=45000)
    ids=page.locator('#asset option').evaluate_all('(xs)=>xs.map(x=>x.value)')
    if len(ids)!=6 or set(ids)!=expected:raise AssertionError('Physical six source variants differ from actual producer '+repr(ids))
    for i,ident in enumerate(ids):
     page.select_option('#asset',ident)
     d=page.evaluate("""() => {
       const a=window.__MW2A_PACK5_WITNESS,c=document.getElementById('scene'),g=c.getContext('webgl2');
       g.finish();const w=c.width,h=c.height,buf=new Uint8Array(w*h*4);g.readPixels(0,0,w,h,g.RGBA,g.UNSIGNED_BYTE,buf);
       let ink=0,xmin=w,ymin=h,xmax=-1,ymax=-1;
       for(let y=0;y<h;y+=3)for(let x=0;x<w;x+=3){const n=(y*w+x)*4;
        if(Math.abs(buf[n]-15)+Math.abs(buf[n+1]-27)+Math.abs(buf[n+2]-34)>45){
         ink++;xmin=Math.min(xmin,x);xmax=Math.max(xmax,x);ymin=Math.min(ymin,y);ymax=Math.max(ymax,y);
        }}
       return {...a,inkSamples:ink,canvasPixels:[w,h],visibleBounds:[xmin,ymin,xmax,ymax],readbackError:g.getError()};
      }""")
     if not(d['ready'] and d['webgl2'] and d['producerMesh'] and d['actualSourcePalette'] and d['glError']==0 and d['readbackError']==0
        and d['id']==ident and d['view']==view and d['designCount']==6 and d['viewport']==[w,h]
        and d['physicalBoxCount']>0 and d['triangleCount']==12*d['physicalBoxCount'] and d['vertexCount']==24*d['physicalBoxCount']
        and d['inkSamples']>20 and d['canvasPixels'][0]>100 and d['canvasPixels'][1]>100
        and not d['assignsVariantToRoadmapABuilding'] and not d['actualPlacedGameBuilding'] and not d['realIPhone'] and not d['creatorArtApproved']):
      raise AssertionError('Original source physical AABB/palette browser proof invalid '+repr(d))
     x0,y0,x1,y1=d['visibleBounds'];cw,ch=d['canvasPixels']
     if not(3<x0<=x1<cw-4 and 3<y0<=y1<ch-4):raise AssertionError('Source-authentic material AABB clipped '+repr(d))
     filename=f'{w}x{h}-{view}-{i:02d}.png'
     fp=out/filename
     page.screenshot(path=str(fp),full_page=False,animations='disabled')
     raw=fp.read_bytes()
     if raw[:8]!=b'\x89PNG\r\n\x1a\n' or struct.unpack('>II',raw[16:24])!=(w,h) or len(raw)<2600:raise AssertionError('Invalid real Chromium physical mesh PNG '+filename)
     records.append({'id':ident,'viewport':[w,h],'view':view,'file':filename,'sha256':sha(raw),
                     'physicalBoxes':d['physicalBoxCount'],'triangles':d['triangleCount'],
                     'materials':d['materialKeys'],'attachment':d['attachment'],
                     'visibleBounds':d['visibleBounds'],'inkSamples':d['inkSamples']})
    groups.append({'viewport':[w,h],'view':view,'captures':len(ids),'truePhysicalProducerMesh':True})
   page.close()
  browser.close()
 if errors:raise AssertionError('Physical producer browser JS errors '+repr(errors[:5]))
 if len(records)!=36 or len(set(x['file'] for x in records))!=36 or len(set(x['sha256'] for x in records))!=36 or set(x['id'] for x in records)!=expected:
  raise AssertionError('Missing unique actual physical producer mesh screenshot evidence')
 report={'schema':'mythwrought.roadmap-a.2a-real-pack5-producer-chromium.v1',
  'commit':os.environ.get('GITHUB_SHA'),'sourceFile':str(producer.relative_to(root)),
  'sourceSHA256':sha(producer.read_bytes()),'rendererFile':str(renderer.relative_to(root)),
  'rendererSHA256':sha(renderer.read_bytes()),'variants':6,'screenshots':36,'groups':groups,
  'realChromiumWebGL2':True,'actualUnmodifiedManualPack5ProducerMesh':True,'actualSourceMaterialPalette':True,
  'sourceCubeProxiesOnly':False,'assignedVariantToCommerceBuilding':False,
  'sourceBuildingRooftopEngineeringApproved':False,'realIPhone':False,
  'realInstalledPackGameScreenshot':False,'creatorArtApproved':False,
  'runtimePerformanceMeasured':False,'worldChanged':False,'registeredBuildings':False,'records':records}
 (out/'ROADMAP_A_PACK5_ACTUAL_PRODUCER_36_WEBGL2_EVIDENCE.json').write_text(json.dumps(report,indent=2)+'\n')
 print('ROADMAP_A_REAL_PACK5_36_WEBGL2_PRODUCER_WITNESS '+json.dumps({'frames':len(records),'variants':6,'sourceOnly':True,'actualProducerMeshes':True,'realIPhone':False}),flush=True)
finally:
 server.shutdown()
 server.server_close()
 thread.join(timeout=5)
