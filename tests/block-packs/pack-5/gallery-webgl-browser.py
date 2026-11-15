"""Real Chromium WebGL2 opt-in gallery acceptance; source-exact inline modules.

Run: LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=x11 xvfb-run -a python \
  tests/block-packs/pack-5/gallery-webgl-browser.py /tmp/pack5-webgl-screens
The browser's administrator policy may block localhost navigation. Accordingly this
loads the exact repository JS module bodies into about:blank without altering their
substantive logic, and renders with genuine WebGL2. This is NOT served module-loader
verification, production gameplay, GPU hardware profiling, or physical iPhone testing.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re,sys
base=Path(__file__).resolve().parents[3]
out=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else base/'pack5-webgl-previews'
out.mkdir(parents=True,exist_ok=True)
paths=['src/block-packs/pack-5/fixture.mjs',
       'src/block-packs/pack-5/architectural-surfaces.mjs',
       'tests/block-packs/pack-5/architectural-gallery.mjs']
chunks=[]
for path in paths:
    body=(base/path).read_text()
    body=re.sub(r'^import .*?;\s*$', '',body,flags=re.MULTILINE)
    body=re.sub(r'(?m)^export ', '',body)
    chunks.append(body)
bundle='\n'.join(chunks)
html=(base/'tests/block-packs/pack-5/architectural-gallery.html').read_text().replace('<script type="module" src="./architectural-gallery.mjs"></script>','')
hashes={}
with sync_playwright() as p:
    browser=p.chromium.launch(headless=False,executable_path='/usr/bin/chromium',
        args=['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=gl',
              '--ignore-gpu-blocklist','--disable-gpu-sandbox','--disable-dev-shm-usage'])
    for width,height in [(667,375),(844,390),(932,430)]:
        for rotation in [0,1]:
            page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
            page.goto('about:blank')
            page.set_content(html)
            page.evaluate('(r)=>{window.PACK5_PREVIEW_ROTATION=r}', rotation)
            page.add_script_tag(content=bundle)
            status=page.locator('#result').get_attribute('data-status')
            if status!='pass':raise AssertionError(f'WebGL2 failed {width}x{height} rotation {rotation}: {page.locator("#result").inner_text()}')
            details=page.evaluate('''()=>{
                const g=document.getElementById('gl').getContext('webgl2');
                g.finish();
                const w=g.drawingBufferWidth,h=g.drawingBufferHeight,raw=new Uint8Array(w*h*4);
                g.readPixels(0,0,w,h,g.RGBA,g.UNSIGNED_BYTE,raw);
                if(g.getError()!==g.NO_ERROR)throw Error('WebGL2 readPixels error');
                const labels=[...document.querySelectorAll('#labels span')].map(x=>x.textContent);
                const out=[];
                for(let r=0;r<2;r++)for(let c=0;c<3;c++){
                    const x0=Math.floor(c*w/3),x1=Math.floor((c+1)*w/3);
                    const y0=Math.floor((1-r)*h/2),y1=Math.floor((2-r)*h/2);
                    let fingerprint=2166136261>>>0,ink=0;
                    for(let y=y0+3;y<y1-3;y+=2)for(let x=x0+3;x<x1-3;x+=2){
                        const o=(y*w+x)*4,rr=raw[o],gg=raw[o+1],bb=raw[o+2];
                        if(rr>72||gg>100||bb>118){ink++;for(const v of [rr,gg,bb])fingerprint=Math.imul(fingerprint^v,16777619)>>>0;}
                    }
                    out.push({hash:fingerprint.toString(16).padStart(8,'0'),ink});
                }
                return {version:g.getParameter(g.VERSION),labels,panels:out,canvas:[w,h]};
            }''')
            if 'WebGL 2.0' not in details['version']:raise AssertionError('No real WebGL2')
            if len(details['labels'])!=6 or len(set(x['hash'] for x in details['panels']))!=6:
                raise AssertionError('Blank or duplicate six-panel WebGL2 visual fingerprints')
            if min(x['ink'] for x in details['panels'])<35:
                raise AssertionError('A WebGL2 candidate is not visibly rendered')
            filename=out/f'pack5-m1-webgl2-{width}x{height}-rot{rotation}.png'
            page.screenshot(path=str(filename))
            hashes[(width,height,rotation)]=[x['hash'] for x in details['panels']]
            print(filename.name,details,flush=True)
            page.close()
    for width,height in [(667,375),(844,390),(932,430)]:
        a=hashes[(width,height,0)];b=hashes[(width,height,1)]
        if sum(x!=y for x,y in zip(a,b))<3:raise AssertionError(f'Insufficient rotation visual difference {width}x{height}')
    browser.close()
print('PASS: 6 genuine Chromium WebGL2 source-exact inline previews, 6 rendered candidate panels each, and rotation differences. NOT served-gallery or game acceptance.',flush=True)
