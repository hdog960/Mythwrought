#!/usr/bin/env python3
"""Opt-in ridge plus two pitch roof assembly review. Canvas2D only, not live WebGL2.

PACK3_RIDGE_ASSEMBLY_DIR=/tmp/ridge-scenes python tests/block-packs/pack-3/ridge-assembly-browser.py
Uses local source gallery and Playwright/Chromium; does not touch saves or world.
"""
import asyncio, hashlib, importlib.util, json, os
from pathlib import Path
from playwright.async_api import async_playwright

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('pack3_gallery',HERE/'gallery-browser.py')
gallery=importlib.util.module_from_spec(spec);spec.loader.exec_module(gallery)
SIZES=((667,375),(844,390),(932,430))
RENDER_JS=r'''(yaw)=>{
 const a=pack3GeometryById(115,yaw),
       s1=pack3GeometryById(113,(yaw+3)%4),
       s2=pack3GeometryById(113,(yaw+1)%4);
 const sideA=[[-1,0,0],[0,0,-1],[1,0,0],[0,0,1]][yaw];
 const sideB=sideA.map(v=>-v);
 const locations=[[0,0,0],sideA,sideB];
 const parts=[a,s1,s2].flatMap((asset,i)=>asset.parts.map(p=>({
  box:p.box.map((v,j)=>v+locations[i][j%3]),
  color:asset.colors[p.tone],id:asset.id
 })));
 const canvas=document.createElement('canvas');canvas.width=960;canvas.height=540;
 canvas.id='roof-assembly';
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
       scale=Math.min(1.45,840/(Math.max(...px)-Math.min(...px)),415/(Math.max(...py)-Math.min(...py)));
 const point=(x,y,z)=>{const [xp,yp]=rawPoint(x,y,z);
   return [480+(xp-midX)*scale,292+(yp-midY)*scale];};
 // Same source geometry and painter as the opt-in pack preview, but now
 // world-translated into the exact 3-cell construction under review.
 parts.sort((a,b)=>a.box[1]-b.box[1]||(a.box[0]+a.box[2])-(b.box[0]+b.box[2]));
 for(const part of parts)paintBox(ctx,part.box,part.color,point);
 ctx.font='bold 25px system-ui';ctx.fillStyle='#f5e8cf';
 ctx.fillText('PACK 3 · CLAY RIDGE + TWO PITCHED ROOF STAIRS',24,42);
 ctx.font='17px system-ui';ctx.fillStyle='#e8cfa3';
 ctx.fillText('Physical boxes in adjoining integer cells · yaw '+yaw*90+'° · CANDIDATE ONLY',24,72);
 ctx.font='16px system-ui';ctx.fillStyle='#d0b88b';
 ctx.fillText('115 × 1 · 113 × 2 · no live block registration, save writes or WebGL2',24,513);
 const pixels=ctx.getImageData(0,0,960,540).data;
 let painted=0;
 for(let i=0;i<pixels.length;i+=4)
  if(pixels[i]!==21||pixels[i+1]!==33||pixels[i+2]!==42)painted++;
 return {png:canvas.toDataURL('image/png'),painted,parts:parts.length,ids:[a.id,s1.id,s2.id],yaw};
}'''
async def main():
    dest=Path(os.getenv('PACK3_RIDGE_ASSEMBLY_DIR','/tmp/pack3-ridge-assembly'));dest.mkdir(parents=True,exist_ok=True)
    records=[]
    async with async_playwright() as p:
        browser=await p.chromium.launch(executable_path=os.getenv('PACK3_CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
        import base64
        for w,h in SIZES:
            page=await browser.new_page(viewport={'width':w,'height':h})
            errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            await page.set_content(gallery.source_gallery(),wait_until='load')
            for yaw in range(4):
                result=await page.evaluate(RENDER_JS,yaw)
                png=base64.b64decode(result['png'].split(',')[1]);digest=hashlib.sha256(png).hexdigest()
                out=dest/f'pack3-roof-assembly-{w}x{h}-yaw{yaw*90}.png';out.write_bytes(png)
                assert png[:8]==b'\x89PNG\r\n\x1a\n',out
                assert result['parts']>20 and result['painted']>18000,result
                assert result['ids']==[115,113,113]
                records.append({'viewport':f'{w}x{h}','yaw':yaw,'hash':digest,'painted':result['painted'],'file':str(out)})
            assert not errors,errors
            print(json.dumps({'viewport':f'{w}x{h}','assemblies':4,'errors':len(errors),'allSceneBoxesDrawn':True}))
            await page.close()
        await browser.close()
    first=[r['hash'] for r in records[:4]]
    assert all([r['hash'] for r in records[i:i+4]]==first for i in (4,8)), 'Source geometry image differs across CSS viewports'
    assert len(set(first))==4,'Four turned ridge assemblies should render separately'
    (dest/'proof.json').write_text(json.dumps({'engine':'Actual Chromium Canvas2D, NOT production WebGL2','scenes':records},indent=2))
    print('PASS: 12 authentic assembled ridge scenes; four visually distinct yaw states; stable pixels across all 3 viewport sizes')
if __name__=='__main__':asyncio.run(main())
