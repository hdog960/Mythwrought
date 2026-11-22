"""All-30 full-exterior and per-floor cutaway visual QA in genuine Chromium Canvas2D.
Not WebGL2 proof or in-game art. A separate WebGL2-only runner is provided.
"""
import asyncio, json, pathlib, sys
from playwright.async_api import async_playwright

ROOT=pathlib.Path(__file__).parents[3]
OUT=ROOT/'artifacts'/'r4-m1-fullqa'
SRC=ROOT/'src'/'building-pool'/'roadmap-4'
SCHEMA=(SRC/'schema.mjs').read_text().replace('export const ','const ').replace('export function ','function ')
BUILDER=(SRC/'m1-blueprints.mjs').read_text().replace("import {SCHEMA,validateBlueprint,validateCollection} from './schema.mjs';",'').replace('export function ','function ')
# Source is identical to GitHub blob SHAs documented in M1; transformed for in-page no-network evaluation.
DRAW=r'''
(function(){
const type=window.previewType,biome=window.previewBiome,size=window.previewSize,cutaway=window.previewCutaway;
const floorIndex=window.previewFloorIndex||0;
const b=buildM1(type,biome,size),cv=document.getElementById('view'),ctx=cv.getContext('2d'),w=cv.width,h=cv.height;
const roofTop=b.architecturalNotes.storyCount*4;
const baseFloor=new Set(b.cells.filter(c=>c.role==='floor'&&c.at[1]===0).map(c=>c.at.join(',')));
const cutoff=(floorIndex+1)*4;
const cells=b.cells.filter(c=>{
 if(!cutaway)return true;
 if(c.role==='roof'||c.at[1]>=cutoff)return false;
 const [x,y,z]=c.at;
 if(y>0&&['wall','window','parapet'].includes(c.role)&&
    (!baseFloor.has([x+1,0,z].join(','))||!baseFloor.has([x,0,z+1].join(','))))return false;
 return true;
});
const roomColors=['#e4a769','#75afc8','#87c694','#b694d4','#d5c168'];
const roomFloorColors=new Map();
if(cutaway){let n=0;for(const r of b.spaces.filter(r=>r.level===floorIndex*4+1)){
 for(const [x,z] of r.footprint)roomFloorColors.set([x,r.level-1,z].join(','),roomColors[n%roomColors.length]);n++;}
}
const lookup=new Map(cells.map(c=>[c.at.join(','),c]));
const project=([x,y,z])=>[(x-z)*0.7071068,y*1.05-(x+z)*0.37];
const bb=[];for(let x of [0,b.bounds[0]])for(let y of [0,b.bounds[1]])for(let z of [0,b.bounds[2]])bb.push(project([x,y,z]));
const minX=Math.min(...bb.map(p=>p[0])),maxX=Math.max(...bb.map(p=>p[0]));
const minY=Math.min(...bb.map(p=>p[1])),maxY=Math.max(...bb.map(p=>p[1]));
const scale=Math.min((w-40)/(maxX-minX),(h-60)/(maxY-minY));
function point(p){let q=project(p);return [(q[0]-(minX+maxX)/2)*scale+w/2, h/2-(q[1]-(minY+maxY)/2)*scale];}
const palette={temperate:'#ae9069',desert:'#cc9d55',snow:'#a3b3cf','enchanted-forest':'#78b18a',mountain:'#8e9eae'};
const roof={temperate:'#984e47',desert:'#b57946',snow:'#6686ab','enchanted-forest':'#665b9d',mountain:'#676779'};
function tint(hex,k){let a=hex.replace('#','');return '#'+[0,2,4].map(i=>Math.max(0,Math.min(255,Math.round(parseInt(a.slice(i,i+2),16)*k))).toString(16).padStart(2,'0')).join('');}
function color(c){return roomFloorColors.get(c.at.join(','))||(c.role==='roof'?roof[biome]:c.role==='window'?'#64d6eb':c.role==='stair'?'#d4b76a':c.role==='partition'?'#b49b77':c.asset==='base:wood'?'#ae7753':c.role==='column'||c.role==='parapet'?'#c2b8a4':palette[biome])}
const faceDefs=[{d:[0,1,0],p:[[0,1,0],[1,1,0],[1,1,1],[0,1,1]],factor:1},{d:[1,0,0],p:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],factor:.72},{d:[0,0,1],p:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]],factor:.83}];
let quads=0;const surfaces=[];
for(const c of cells){const [x,y,z]=c.at;
 for(const f of faceDefs){if(lookup.has([x+f.d[0],y+f.d[1],z+f.d[2]].join(',')))continue;
  surfaces.push({points:f.p.map(([a,d,e])=>point([x+a,y+d,z+e])),color:tint(color(c),f.factor),sort:x+z+y*.002});quads++;
 }}
surfaces.sort((a,b)=>a.sort-b.sort);
ctx.fillStyle='#101b2a';ctx.fillRect(0,0,w,h);
ctx.strokeStyle='#162333';ctx.lineWidth=.5;
for(const f of surfaces){ctx.beginPath();f.points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();ctx.stroke();}
window.__roadmap4Preview={id:b.id,webgl2:!!document.createElement('canvas').getContext('webgl2'),canvas2d:true,cells:cells.length,visibleFaces:quads,dimensions:b.bounds,walkable:b.navigation.length,rooms:b.spaces.length,cutaway,floorIndex,complete:true};
})();
'''
HTML='''<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"/><style>body{margin:0;background:#101b2a;color:#eee;font:13px system-ui;overflow:hidden}canvas{width:100vw;height:100vh;display:block}#head{position:absolute;top:10px;left:10px;border-radius:6px;padding:10px 12px;background:#102132da;border:1px solid #ae9567;line-height:1.5}small{color:#bba36a}#status{position:absolute;bottom:8px;right:8px;background:#102132da;padding:6px;border-radius:4px}</style></head><body><div id="head"><b>MYTHWROUGHT · ROADMAP 4</b><br><span id="name"></span><br><small>THEORETICAL VOXEL CANDIDATE · CHROMIUM CANVAS2D QA</small></div><canvas id="view"></canvas><div id="status"></div></body></html>'''
SAMPLES=[(t,b,s) for t in ('civic-hall','castle-palace') for b in ('temperate','desert','snow','enchanted-forest','mountain') for s in ('small','medium','large')]
SIZES=[(667,375),(844,390),(932,430)]
# Optional width argument to run browser windows in separate reproducible batches.
SELECTED=[(w,h) for w,h in SIZES if len(sys.argv)<2 or str(w)==sys.argv[1]]
async def main():
 OUT.mkdir(parents=True,exist_ok=True)
 allResults=[]
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for w,h in SELECTED:
   context=await browser.new_context(viewport={'width':w,'height':h},device_scale_factor=1,is_mobile=True,has_touch=True)
   for t,b,s in SAMPLES:
    for cutaway in (False,True):
     page=await context.new_page();errs=[]
     page.on('pageerror',lambda e:errs.append(str(e)))
     await page.set_content(HTML)
     await page.evaluate('''([t,b,s,cutaway])=>{window.previewType=t;window.previewBiome=b;window.previewSize=s;window.previewCutaway=cutaway;window.previewFloorIndex=cutaway?(s==='large'?2:(t==='castle-palace'||s==='medium'?1:0)):0;let c=document.querySelector('#view');c.width=innerWidth;c.height=innerHeight;document.querySelector('#name').textContent=[b,s,t,cutaway?'floor cutaway':'complete'].join(' · ')}''',[t,b,s,cutaway])
     await page.add_script_tag(content=SCHEMA+'\n'+BUILDER+'\n'+DRAW)
     data=await page.evaluate('window.__roadmap4Preview')
     await page.evaluate('document.querySelector("#status").textContent=window.__roadmap4Preview.cells+" occupied voxels / "+window.__roadmap4Preview.visibleFaces+" visible faces"')
     name=f'{t}-{b}-{s}-{w}x{h}-'+('section' if cutaway else 'complete')+'.png'
     await page.screenshot(path=str(OUT/name))
     allResults.append({'file':name,'result':data,'errors':errs})
     print(name, json.dumps(data),errs,flush=True)
     await page.close()
   await context.close()
  await browser.close()
 (OUT/('canvas-results-'+(sys.argv[1] if len(sys.argv)>1 else 'all')+'.json')).write_text(json.dumps(allResults,indent=2))
 assert len(allResults)==60*len(SELECTED) and all(x['result']['canvas2d'] and x['result']['complete'] and not x['errors'] for x in allResults)
 print(f'PASS {len(allResults)} genuine Chromium Canvas2D screenshots ({len(SAMPLES)} blueprints x {len(SELECTED)} viewport(s) x exterior/section); WebGL2 NOT established')
if __name__=='__main__':asyncio.run(main())
