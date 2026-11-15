"""Real, fail-closed Chromium WebGL2 review for Roadmap 4's 30 theoretical M1 buildings.

Run from repo root on a Linux software-OpenGL QA machine:
    xvfb-run -a env LIBGL_ALWAYS_SOFTWARE=1 python3 \
      tests/building-pool/roadmap-4/webgl2-preview-browser.py
No HTTP/file navigation is used. Browser admin URL restrictions cannot be
misreported as missing WebGL2. This is not real-iPhone or game integration QA.
"""
import asyncio
import hashlib
import json
import os
from pathlib import Path
import re
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[3]
SRC=ROOT/'src'/'building-pool'/'roadmap-4'
TESTS=ROOT/'tests'/'building-pool'/'roadmap-4'
OUT=ROOT/'artifacts'/'r4-webgl2-genuine'
BIOMES=('temperate','desert','snow','enchanted-forest','mountain')
SIZES=('small','medium','large')
VIEWPORTS=((667,375),(844,390),(932,430))
SAMPLES=[(t,b,s) for t in ('civic-hall','castle-palace') for b in BIOMES for s in SIZES]

def source_bundle():
    schema=(SRC/'schema.mjs').read_text()
    builder=(SRC/'m1-blueprints.mjs').read_text()
    shapes=(SRC/'m1-preview-shapes.mjs').read_text()
    render=(TESTS/'webgl2-preview.mjs').read_text()
    assert "import {SCHEMA,validateBlueprint,validateCollection} from './schema.mjs';" in builder
    assert "import {buildM1} from '../../../src/building-pool/roadmap-4/m1-blueprints.mjs';" in render
    assert "import {candidatePreviewShape,candidateBatchedPreviewBudget} from '../../../src/building-pool/roadmap-4/m1-preview-shapes.mjs';" in render
    schema=re.sub(r'\bexport (const|function) ',r'\1 ',schema)
    builder=builder.replace("import {SCHEMA,validateBlueprint,validateCollection} from './schema.mjs';",'')
    builder=builder.replace('export function ','function ')
    shapes=shapes.replace('export function ','function ')
    render=re.sub(r'^import .*?;\n','',render,flags=re.M)
    render=render.replace('new URLSearchParams(location.search)',
                          'new URLSearchParams(window.__roadmap4Query)')
    compiled='\n'.join((schema,builder,shapes,render))
    if re.search(r'^\s*(import|export)\s',compiled,re.M):
        raise RuntimeError('Unexpected module syntax in source-only loader')
    html=(TESTS/'webgl2-preview.html').read_text().replace(
      '<script type="module" src="./webgl2-preview.mjs"></script>','')
    return html,compiled,hashlib.sha256(compiled.encode()).hexdigest()

async def run():
    OUT.mkdir(parents=True,exist_ok=True)
    html,compiled,digest=source_bundle()
    selected_width=os.getenv('R4_ONLY_WIDTH','')
    views=[(w,h,t,b,s,cut) for w,h in VIEWPORTS
      if not selected_width or str(w)==selected_width
      for t,b,s in SAMPLES for cut in (False,True)]
    views=views[int(os.getenv('R4_SKIP_VIEWS','0')):]
    views=views[:int(os.getenv('R4_MAX_VIEWS',len(views)))]
    results=[]
    failures=[]
    async with async_playwright() as p:
        browser=await p.chromium.launch(
          headless=False,executable_path=os.getenv('R4_CHROMIUM','/usr/bin/chromium'),
          args=['--no-sandbox','--disable-dev-shm-usage','--enable-webgl',
                '--ignore-gpu-blocklist','--use-gl=angle','--use-angle=gl'])
        try:
            for width,height in VIEWPORTS:
                batch=[v for v in views if v[0]==width]
                if not batch:continue
                context=await browser.new_context(
                  viewport={'width':width,'height':height},
                  device_scale_factor=1,is_mobile=True,has_touch=True)
                for w,h,t,b,s,cut in batch:
                    page=await context.new_page()
                    errors=[]
                    page.on('pageerror',lambda err:errors.append(str(err)))
                    floor=2 if s=='large' else (1 if t=='castle-palace' or s=='medium' else 0)
                    query=f'type={t}&biome={b}&size={s}&cutaway={int(cut)}&floor={floor}'
                    try:
                        await page.set_content(html)
                        await page.evaluate('(q)=>window.__roadmap4Query=q',query)
                        await page.add_script_tag(content=compiled)
                        data=await page.evaluate('window.__roadmap4Webgl2 || null')
                        if not data or not data.get('webgl2') or data.get('lost') or data.get('error')!=0:
                            raise RuntimeError(f'No valid WebGL2 draw: {data}')
                        if data.get('drawnTriangles',0)<=100 or data.get('drawCalls',0)<1:
                            raise RuntimeError(f'No meaningful WebGL2 mesh: {data}')
                        if data['canvasSize'] != [w,h] or data['id'] != f'r4:{t}:{b}:{s}:01':
                            raise RuntimeError(f'Wrong actual viewport/blueprint: {data}')
                        if errors:raise RuntimeError('Page exceptions: '+repr(errors))
                        proof=await page.evaluate("""() => {
                            const gl=document.querySelector('canvas').getContext('webgl2');
                            gl.finish();
                            const info=gl.getExtension('WEBGL_debug_renderer_info');
                            return {version:gl.getParameter(gl.VERSION),
                                renderer:info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL)
                                    : gl.getParameter(gl.RENDERER),
                                error:gl.getError(),lost:gl.isContextLost()};
                        }""")
                        if not proof['version'].startswith('WebGL 2.0') or proof['error'] or proof['lost']:
                            raise RuntimeError('GPU synchronization failed: '+repr(proof))
                        name=f'{t}-{b}-{s}-{w}x{h}-'+('section' if cut else 'complete')+'.png'
                        await page.screenshot(path=str(OUT/name))
                        results.append({'file':name,'data':data,'proof':proof})
                        print(f'{len(results)}/{len(views)} WebGL2 {name} '
                              f"draws={data['drawCalls']} triangles={data['drawnTriangles']} "
                              f"bytes={data['submittedBufferBytes']}",flush=True)
                    except Exception as e:
                        failures.append({'query':query,'viewport':[w,h],'error':str(e)})
                        print('FAIL WebGL2',failures[-1],flush=True)
                        break
                    finally:
                        await page.close()
                await context.close()
                if failures:break
        finally:
            await browser.close()
    evidence={'renderer':'genuine Chromium WebGL2; virtual-display software OpenGL',
      'sourceBundleSha256':digest,'requestedViews':len(views),
      'completedViews':len(results),'failures':failures,'results':results,
      'realIPhoneTested':False,'creatorVisualApproved':False,
      'liveAssetsRegistered':False,'physicalCollisionCertified':False}
    fname='results-'+selected_width+'.json' if selected_width else 'results-all.json'
    (OUT/fname).write_text(json.dumps(evidence,indent=2))
    if failures or len(results)!=len(views):
        raise RuntimeError(f'WebGL2 QA failed: {len(results)}/{len(views)}')
    print(f'PASS {len(results)}/{len(views)} genuine WebGL2 screenshots',flush=True)

if __name__=='__main__':
    asyncio.run(run())
