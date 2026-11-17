"""Roadmap 3 genuine WebGL2 source-exact ES module candidate gallery.

Runs in supported Linux Xvfb + software OpenGL, without blocked HTTP or file
navigation. Only relative module URLs are rewritten to immutable in-memory data
URIs. This does NOT certify final symbolic block dimensions or physical iPhone.

  LIBGL_ALWAYS_SOFTWARE=1 xvfb-run -a python3 \
    tests/building-pool/roadmap-3/preview-webgl2-inline.py
"""
from __future__ import annotations
import base64
import hashlib
import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[3]
OWNED=ROOT/'tests'/'building-pool'/'roadmap-3'
SRC=ROOT/'src'/'building-pool'/'roadmap-3'
ARTIFACT=ROOT/'artifacts'/'roadmap3-m1-webgl2'
VIEWPORTS=((667,375),(844,390),(932,430))
TYPES=('blacksmith','watchtower')
BIOMES=('temperate','desert','snow','enchanted-forest','mountain')
SIZES=('small','medium','large')
VIEWS=('exterior','cutaway')

_cache={}
_source_digests={}
def data_module(path: Path) -> str:
    path=path.resolve()
    if not (path.is_relative_to(OWNED) or path.is_relative_to(SRC)):
        raise AssertionError('Unexpected external import: '+str(path))
    if path in _cache:return _cache[path]
    raw=path.read_text()
    _source_digests[str(path.relative_to(ROOT))]=hashlib.sha256(raw.encode()).hexdigest()
    def replace(match):
        import_path=match.group(2)
        if not import_path.startswith('.'):
            raise AssertionError('External import not allowed: '+import_path)
        return match.group(1)+data_module(path.parent/import_path)+match.group(3)
    # Rewrite ONLY the quoted module specifier of each static import.
    compiled=re.sub(r'(\bfrom\s+[\'\"])([^\'\"]+)([\'\"])', replace,raw)
    if re.search(r'\bfrom\s+[\'\"]\.',compiled):
        raise AssertionError('Unresolved module imports in '+str(path))
    url='data:text/javascript;base64,'+base64.b64encode(compiled.encode()).decode()
    _cache[path]=url
    return url

def run():
    ARTIFACT.mkdir(parents=True,exist_ok=True)
    script=data_module(OWNED/'preview.mjs')
    original=(OWNED/'preview.html').read_text()
    tag='<script type="module" src="./preview.mjs"></script>'
    if original.count(tag)!=1:raise AssertionError('source HTML changed script tag')
    html=original.replace(tag,f'<script type="module" src="{script}"></script>')
    print('Source module SHA-256',json.dumps(_source_digests,sort_keys=True),flush=True)
    samples=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=False,executable_path='/usr/bin/chromium',args=[
            '--no-sandbox','--disable-dev-shm-usage','--enable-webgl',
            '--ignore-gpu-blocklist','--use-gl=angle','--use-angle=gl'])
        try:
            for w,h in VIEWPORTS:
                page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
                errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
                page.set_content(html,wait_until='load')
                page.wait_for_function("document.querySelector('#details')?.textContent.includes('WebGL2 active')",timeout=15000)
                for typ in TYPES:
                    page.select_option('#type',typ)
                    for biome in BIOMES:
                        page.select_option('#biome',biome)
                        for size in SIZES:
                            page.select_option('#size',size)
                            for view in VIEWS:
                                page.select_option('#view',view)
                                evidence=page.evaluate('''() => {
                                  const canvas=document.querySelector('canvas');
                                  const gl=canvas.getContext('webgl2');
                                  if(!gl)return {webgl2:false};
                                  gl.finish();const W=canvas.width,H=canvas.height;
                                  const px=new Uint8Array(W*H*4);
                                  gl.readPixels(0,0,W,H,gl.RGBA,gl.UNSIGNED_BYTE,px);
                                  let ink=0;let checksum=2166136261>>>0;
                                  for(let i=0;i<px.length;i+=16){
                                    const r=px[i],g=px[i+1],b=px[i+2];
                                    if(Math.abs(r-18)>12||Math.abs(g-28)>12||Math.abs(b-41)>12){
                                      ink++;checksum=Math.imul(checksum^r,16777619)>>>0;
                                      checksum=Math.imul(checksum^g,16777619)>>>0;
                                      checksum=Math.imul(checksum^b,16777619)>>>0;
                                    }
                                  }
                                  const debug=gl.getExtension('WEBGL_debug_renderer_info');
                                  return {webgl2:true,version:gl.getParameter(gl.VERSION),
                                    renderer:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),
                                    gpuError:gl.getError(),contextLost:gl.isContextLost(),
                                    width:W,height:H,ink,checksum:checksum.toString(16),
                                    details:document.getElementById('details').textContent};
                                }''')
                                ident=f'r3:{typ}:{biome}:{size}:1'
                                if errs or not evidence.get('webgl2') or not evidence.get('version','').startswith('WebGL 2.0') or evidence.get('contextLost') or evidence.get('gpuError')!=0 or evidence.get('ink',0)<80 or ident not in evidence.get('details','') or f'WebGL2 active · {view}' not in evidence.get('details',''):
                                    raise AssertionError((ident,w,h,view,errs,evidence))
                                name=f'{typ}-{biome}-{size}-{view}-{w}x{h}.png'
                                page.screenshot(path=str(ARTIFACT/name))
                                samples.append({'file':name,'identity':ident,'viewport':[w,h],
                                    'view':view,'evidence':evidence})
                page.close()
                print('Completed genuine WebGL2',w,h,'images',len(samples),flush=True)
        finally:browser.close()
    if len(samples)!=180:raise AssertionError(f'Only {len(samples)}/180 genuine WebGL2 images')
    for w,h in VIEWPORTS:
        group=[c for c in samples if c['viewport']==[w,h]]
        if len(group)!=60 or len({c['evidence']['checksum'] for c in group})!=60:
            raise AssertionError(f'{w}x{h}: expected 60 distinct visible WebGL2 arrangements')
    result={'images':len(samples),'sourceSHA256':_source_digests,'captures':samples,
        'scope':'Roadmap3 diagnostic cube envelope preview only; not future block mesh nor game renderer nor iPhone hardware'}
    (ARTIFACT/'manifest.json').write_text(json.dumps(result,indent=2))
    print('PASS 180 genuine WebGL2 images, see',ARTIFACT,flush=True)

if __name__=='__main__':run()
