"""Real software-WebGL2 transport preflight; never candidate-asset proof."""
import hashlib
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
results = []
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False, executable_path='/usr/bin/chromium',
      args=['--no-sandbox', '--disable-dev-shm-usage', '--enable-webgl',
            '--use-gl=angle', '--use-angle=gl', '--ignore-gpu-blocklist'])
    try:
        for w,h in ((667,375),(844,390),(932,430)):
            page = browser.new_page(viewport={'width':w,'height':h}, device_scale_factor=1)
            try:
                page.goto('about:blank')
                info = page.evaluate('''() => {
                  const c=document.createElement('canvas'); c.width=32;c.height=32;
                  c.style.cssText='width:32px;height:32px'; document.body.append(c);
                  const gl=c.getContext('webgl2',{preserveDrawingBuffer:true});
                  if(!gl)return {webgl2:false};
                  gl.viewport(0,0,32,32);gl.clearColor(0.2,0.4,0.6,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.finish();
                  const pixels=new Uint8Array(4);gl.readPixels(16,16,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
                  const renderer=gl.getExtension('WEBGL_debug_renderer_info');
                  return {webgl2:true,version:gl.getParameter(gl.VERSION),
                    renderer:renderer?gl.getParameter(renderer.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),
                    pixels:Array.from(pixels),error:gl.getError(),lost:gl.isContextLost(),
                    width:window.innerWidth,height:window.innerHeight};
                }''')
                assert info['webgl2'] and info['version'].startswith('WebGL 2.0'), info
                assert not info['lost'] and info['error'] == 0, info
                assert info['width'] == w and info['height'] == h, info
                assert all(abs(a-b) <= 2 for a,b in zip(info['pixels'],[51,102,153,255])), info
                path = out / f'webgl2-transport-ONLY-{w}x{h}.png'
                page.screenshot(path=str(path))
                results.append({'viewport':[w,h], 'preflightOnly':True,
                  'notCandidateRender':True, 'details':info,
                  'pngSHA256':hashlib.sha256(path.read_bytes()).hexdigest()})
            finally:
                page.close()
    finally:
        browser.close()
(out/'preflight.json').write_text(json.dumps({'status':'PASS', 'type':'transport-only',
  'neverProductionOrCandidateAcceptance':True,'results':results},indent=2)+'\n')
print('REAL_WEBGL2_TRANSPORT_PASS 3 mobile landscape sizes; NOT candidate asset proof',flush=True)
