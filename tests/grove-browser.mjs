// Actual headless Chromium WebGL scene for v0.10 storybook garden groves.
// Does NOT claim physical iPhone performance or creator visual approval.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true,args:[
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const context=await browser.newContext({
 viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true
});
const page=await context.newPage();
const errors=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+' '+r.url());});
const loaded=()=>page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25 &&
 Number(document.querySelector('#scene')?.dataset.pendingChunks)===0,null,{timeout:30000});
const scene=()=>page.evaluate(()=>{
 const c=document.querySelector('#scene'),
   l=document.querySelector('.left').getBoundingClientRect(),
   r=document.querySelector('.right').getBoundingClientRect(),
   v=c.getBoundingClientRect();
 return {loaded:Number(c.dataset.loadedChunks),vertices:Number(c.dataset.renderedMeshVertices),
  gaps:[v.left-l.right,r.left-v.right],width:v.width,quality:c.dataset.storybookQuality,
  saved:localStorage.getItem('mythwrought-v002-world-179')};
});
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await loaded();
 const before=await scene();
 assert.equal(before.saved,null);
 assert.equal(before.quality,'painted-materials');
 assert.ok(before.gaps.every(x=>x>=-2));

 // Use a real, deterministic original ground plant, not a scripted sprite or static picture.
 const grove=await page.evaluate(async()=>{
   const {storybookGroveVertices}=await import('./src/grove.mjs');
   const {terrainHeight,baseBlock}=await import('./src/voxel.mjs');
   const dev=window.__mythwroughtTest;
   const model={seed:179,get:(x,y,z)=>dev.block(x,y,z)};
   const found=[];
   for(let cx=-2;cx<=2;cx++)for(let cz=-2;cz<=2;cz++){
     const mesh=storybookGroveVertices(model,cx,cz,{heightAt:terrainHeight,baseAt:baseBlock});
     const anchors=new Set();
     for(let i=0;i<mesh.length;i+=9){
       const x=Math.floor(mesh[i]),z=Math.floor(mesh[i+2]);
       anchors.add(x+','+z);
     }
     for(const key of anchors){
       const [x,z]=key.split(',').map(Number);
       found.push({x,z,y:terrainHeight(x,z,179),cx,cz});
     }
   }
   found.sort((a,b)=>(a.x*a.x+a.z*a.z)-(b.x*b.x+b.z*b.z));
   return {first:found[0],total:found.length};
 });
 assert.ok(grove.first&&grove.total>20,'No authentic groves generated in loaded scene');
 const {x,y,z}=grove.first;
 await page.evaluate(p=>{
   window.__mythwroughtTest.teleport(p.x-2,p.z+2);
   window.__mythwroughtTest.aimAt(p.x,p.y+1,p.z);
 },{x,y,z});
 await loaded();
 await mkdir('artifacts',{recursive:true});
 await page.screenshot({path:'artifacts/mythwrought-v010-sculpted-garden-groves-landscape.png'});
 const visual=await scene();
 assert.ok(visual.vertices>0);
 assert.ok(visual.gaps.every(n=>n>=-2),'Surface art overlaps landscape controller rails');
 assert.equal(visual.saved,null,'Render-only plants wrote to save');

 const inspect=async()=>page.evaluate(async({x,y,z})=>{
   const {storybookGroveVertices}=await import('./src/grove.mjs');
   const {terrainHeight,baseBlock}=await import('./src/voxel.mjs');
   const dev=window.__mythwroughtTest;
   const data=storybookGroveVertices({seed:179,get:(a,b,c)=>dev.block(a,b,c)},
     Math.floor(x/16),Math.floor(z/16),{heightAt:terrainHeight,baseAt:baseBlock});
   for(let i=0;i<data.length;i+=9){
     if(Math.floor(data[i])===x&&Math.floor(data[i+2])===z)return true;
   }
   return false;
 },{x,y,z});
 assert.equal(await inspect(),true);
 await page.evaluate(p=>window.__mythwroughtTest.placeFixture(p.x,p.y,p.z,0),{x,y,z});
 await loaded();
 assert.equal(await inspect(),false,'Plant still visible after its block was mined');
 const afterMine=await scene();
 assert.match(afterMine.saved,/"schema":1/);
 assert.equal(JSON.parse(afterMine.saved).edits.some(e=>e[0]===x&&e[1]===y&&e[2]===z&&e[3]===0),true);

 await page.reload({waitUntil:'networkidle'});
 await loaded();
 assert.equal(await inspect(),false,'Mined plant reappeared after reload');
 await page.evaluate(p=>window.__mythwroughtTest.placeFixture(p.x,p.y,p.z,1),{x,y,z});
 await loaded();
 assert.equal(await inspect(),true,'Restored grass failed to restore original scene');
 const final=await scene();
 assert.equal(JSON.parse(final.saved).schema,1);
 assert.equal(JSON.parse(final.saved).edits.some(e=>e[0]===x&&e[1]===y&&e[2]===z),false);
 assert.ok(final.gaps.every(n=>n>=-2));
 await page.screenshot({path:'artifacts/mythwrought-v010-sculpted-garden-groves-restored.png'});

 await page.setViewportSize({width:568,height:320});
 await page.waitForTimeout(200);
 const compact=await scene();
 assert.ok(compact.gaps.every(n=>n>=-2),'Compact landscape rails covered world');
 assert.ok(compact.width>=568*.45);
 await page.screenshot({path:'artifacts/mythwrought-v010-sculpted-garden-groves-compact.png'});
 assert.deepEqual(errors,[]);
 assert.deepEqual(missing,[]);
 console.log('PASS original three-dimensional garden patches, genuine Chromium WebGL capture, edit/remesh/save/reload, compact landscape and external dual-thumb rails');
}finally{await browser.close();}
