#!/usr/bin/env python3
"""Opt-in real Chromium Canvas2D QA for wall+buttress+battlement construction.

This intentionally uses the exact authored AABB parts, material palettes and
Pack 3 preview painter. It is NOT a live WebGL2, save, or world-placement test.
Run: PACK3_FORT_ASSEMBLY_DIR=/tmp/fort-review python tests/block-packs/pack-3/fortification-assembly-browser.py
"""
import asyncio, base64, hashlib, importlib.util, json, os
from pathlib import Path
from playwright.async_api import async_playwright

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('pack3_gallery', HERE/'gallery-browser.py')
gallery=importlib.util.module_from_spec(spec);spec.loader.exec_module(gallery)
SIZES=((667,375),(844,390),(932,430))
RENDER_JS=r'''(yaw)=>{
 const wall=pack3FortifiedById(116,yaw),
       battlement=pack3FortifiedById(117,yaw),
       buttress=pack3FortifiedById(118,yaw);
 const buttressOffsets=[[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]];
 const origins=[[0,0,0],[0,1,0],buttressOffsets[yaw]];
 const parts=[wall,battlement,buttress].flatMap((asset,i)=>asset.parts.map(p=>({
   box:p.box.map((v,j)=>v+origins[i][j%3]),color:asset.colors[p.tone],id:asset.id
 })));
 const canvas=document.createElement('canvas');canvas.width=960;canvas.height=540;
 document.body.innerHTML='';document.body.style.cssText='margin:0;background:#15212a';
 document.body.append(canvas);
 const ctx=canvas.getContext('2d');ctx.fillStyle='#15212a';ctx.fillRect(0,0,960,540);
 const px=[],py=[];
 for(const part of parts)for(const x of [part.box[0],part.box[3]])
  for(const y of [part.box[1],part.box[4]])for(const z of [part.box[2],part.box[5]]){
    const [xp,yp]=rawPoint(x,y,z);px.push(xp);py.push(yp);
  }
 const midX=(Math.min(...px)+Math.max(...px))/2,
       midY=(Math.min(...py)+Math.max(...py))/2,
       scale=Math.min(1.4,840/(Math.max(...px)-Math.min(...px)),420/(Math.max(...py)-Math.min(...py)));
 const point=(x,y,z)=>{const [xp,yp]=rawPoint(x,y,z);
  return [480+(xp-midX)*scale,294+(yp-midY)*scale];};
 parts.sort((a,b)=>a.box[1]-b.box[1]||(a.box[0]+a.box[2])-(b.box[0]+b.box[2]));
 for(const part of parts)paintBox(ctx,part.box,part.color,point);
 ctx.font='bold 24px system-ui';ctx.fillStyle='#f5e8cf';
 ctx.fillText('PACK 3 · FORTRESS WALL + BUTTRESS + BATTLEMENT',24,42);
 ctx.font='17px system-ui';ctx.fillStyle='#e8cfa3';
 ctx.fillText('Actual physical box unions · yaw '+yaw*90+'° · UNMERGED CANDIDATES',24,72);
 ctx.font='16px system-ui';ctx.fillStyle='#d0b88b';
 ctx.fillText('116 base · 117 upper merlons · 118 supporting foot · NOT LIVE WebGL2',24,513);
 return {png:canvas.toDataURL('image/png'),parts:parts.length,ids:[wall.id,battlement.id,buttress.id],yaw};
}'''

async def main():
    out=Path(os.getenv('PACK3_FORT_ASSEMBLY_DIR','/tmp/pack3-fortification-assembly'))
    out.mkdir(parents=True,exist_ok=True)
    records=[]
    async with async_playwright() as p:
        browser=await p.chromium.launch(executable_path=os.getenv('PACK3_CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
        for w,h in SIZES:
            page=await browser.new_page(viewport={'width':w,'height':h})
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            await page.set_content(gallery.source_gallery(),wait_until='load')
            for yaw in range(4):
                result=await page.evaluate(RENDER_JS,yaw)
                png=base64.b64decode(result['png'].split(',')[1])
                assert png.startswith(b'\x89PNG\r\n\x1a\n')
                assert result['ids']==[116,117,118] and result['parts']==29
                filename=out/f'pack3-fortification-{w}x{h}-yaw{yaw*90}.png'
                filename.write_bytes(png)
                records.append({'viewport':f'{w}x{h}','yaw':yaw,'hash':hashlib.sha256(png).hexdigest(),
                                'bytes':len(png),'file':str(filename)})
            assert not errors,errors
            print(json.dumps({'viewport':f'{w}x{h}','sceneViews':4,'errors':len(errors)}))
            await page.close()
        await browser.close()
    ref=[r['hash'] for r in records[:4]]
    assert len(set(ref))==4,'Could not distinguish four real scene orientations'
    assert all([r['hash'] for r in records[k:k+4]]==ref for k in (4,8)), 'Pixel drift across viewports'
    (out/'proof.json').write_text(json.dumps({'source':'actual Pack 3 Chromium Canvas2D, NOT WebGL2','scenes':records},indent=2))
    print('PASS: 12 source-authentic assembled fortification scenes, four distinct yaw angles; no browser errors')
if __name__=='__main__':asyncio.run(main())
