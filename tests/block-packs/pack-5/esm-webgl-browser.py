"""Genuine WebGL2 + native ES module smoke for Pack 5 candidate M1 and M2.

LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python \
  tests/block-packs/pack-5/esm-webgl-browser.py m2 /tmp/pack5-m2-screens

Chromium blocks localhost navigation in this sandbox; this runs unchanged module
bodies through actual data-URL ES module imports, with only relative import URLs
rewritten to absolute data URLs. This is NOT source-served HTTP/production/iPhone QA.
"""
import base64,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[3]
mode=sys.argv[1] if len(sys.argv)>1 else 'm1'
if mode not in ('m1','m2'):raise ValueError('Choose m1 or m2')
out=Path(sys.argv[2]).resolve() if len(sys.argv)>2 else root/f'pack5-{mode}-webgl-previews'
out.mkdir(parents=True,exist_ok=True)
src='architectural-surfaces.mjs' if mode=='m1' else 'residential-furnishings.mjs'
gallery='architectural-gallery' if mode=='m1' else 'residential-gallery'
count,cols=(6,3) if mode=='m1' else (8,4)
def uri(s):return 'data:text/javascript;base64,'+base64.b64encode(s.encode()).decode()
fixture=uri((root/'src/block-packs/pack-5/fixture.mjs').read_text())
asset=(root/'src/block-packs/pack-5'/src).read_text()
a="from './fixture.mjs'"
if asset.count(a)!=1:raise AssertionError('Unexpected fixture import')
asset=uri(asset.replace(a,f"from '{fixture}'"))
gallery_js=(root/'tests/block-packs/pack-5'/f'{gallery}.mjs').read_text()
a=f"from '../../../src/block-packs/pack-5/{src}'"
if gallery_js.count(a)!=1:raise AssertionError('Unexpected asset import')
gallery_js=uri(gallery_js.replace(a,f"from '{asset}'"))
html=(root/'tests/block-packs/pack-5'/f'{gallery}.html').read_text()
a=f'<script type="module" src="./{gallery}.mjs"></script>'
if html.count(a)!=1:raise AssertionError('Unexpected HTML module script')
html=html.replace(a,f'<script type="module" src="{gallery_js}"></script>')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=False,executable_path='/usr/bin/chromium',args=[
  '--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=gl',
  '--ignore-gpu-blocklist','--disable-gpu-sandbox','--disable-dev-shm-usage'])
 fingerprints={}
 for width,height in ((667,375),(844,390),(932,430)):
  for rotation in (0,1):
   page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto('about:blank');page.evaluate('(r)=>window.PACK5_PREVIEW_ROTATION=r',rotation)
   page.set_content(html)
   page.wait_for_function("document.querySelector('#result')?.dataset.status!=='pending'",timeout=10000)
   if page.locator('#result').get_attribute('data-status')!='pass' or errors:raise AssertionError((errors,page.locator('#result').inner_text()))
   d=page.evaluate('''(cols)=>{
    const g=document.getElementById('gl').getContext('webgl2');g.finish();
    const w=g.drawingBufferWidth,h=g.drawingBufferHeight,p=new Uint8Array(w*h*4);
    g.readPixels(0,0,w,h,g.RGBA,g.UNSIGNED_BYTE,p);
    if(g.getError()!==g.NO_ERROR)throw Error('GPU readback failure');
    const hashes=[];for(let row=0;row<2;row++)for(let col=0;col<cols;col++){
      const x0=Math.floor(col*w/cols),x1=Math.floor((col+1)*w/cols);
      const y0=Math.floor((1-row)*h/2),y1=Math.floor((2-row)*h/2);
      let hash=2166136261>>>0,ink=0;
      for(let y=y0+3;y<y1-3;y+=2)for(let x=x0+3;x<x1-3;x+=2){
        const i=(y*w+x)*4,r=p[i],g=p[i+1],b=p[i+2];
        if(r>72||g>100||b>118){ink++;for(const v of [r,g,b])hash=Math.imul(hash^v,16777619)>>>0;}
      }hashes.push([hash.toString(16),ink]);
    }
    return {version:g.getParameter(g.VERSION),labels:document.querySelectorAll('#labels span').length,hashes};
   }''',cols)
   if 'WebGL 2.0' not in d['version'] or d['labels']!=count or len({h for h,n in d['hashes']})!=count or min(n for h,n in d['hashes'])<35:raise AssertionError(d)
   fingerprints[(width,height,rotation)]=[h for h,n in d['hashes']]
   f=out/f'pack5-{mode}-webgl2-{width}x{height}-rot{rotation}.png'
   page.screenshot(path=str(f));print(f.name,'PASS',count,'visible variants',flush=True)
   page.close()
 for width,height in ((667,375),(844,390),(932,430)):
  if sum(a!=b for a,b in zip(fingerprints[(width,height,0)],fingerprints[(width,height,1)]))<3:raise AssertionError('Rotation not visually different')
 browser.close()
print(f'PASS: {mode}, 6 native ES-module/WebGL2 screenshots, {count} distinct candidates in every frame. HTTP-served gallery not checked.')
