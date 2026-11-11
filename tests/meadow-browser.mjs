// Real Chromium visual/interaction evidence for original cosmetic voxel meadows.
// No actual iPhone hardware or final-art acceptance is implied.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const context=await browser.newContext({
  viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true
});
const page=await context.newPage(),errors=[],missing=[];
page.on('pageerror',err=>errors.push(err.message));
page.on('response',res=>{if(res.status()>=400)missing.push(res.status()+' '+res.url());});
const loaded=()=>page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25&&
  Number(document.querySelector('#scene')?.dataset.pendingChunks)===0,null,{timeout:30000});
const saved=()=>page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
const stats=()=>page.evaluate(()=>({
  d:document.querySelector('#scene').dataset,
  gap:(()=>{
    const left=document.querySelector('.left').getBoundingClientRect();
    const right=document.querySelector('.right').getBoundingClientRect();
    const view=document.querySelector('#scene').getBoundingClientRect();
    return [view.left-left.right,right.left-view.right];
  })()
}));
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await loaded();
 assert.equal(await saved(),null,'Fresh seed should not be silently saved by a visual-only feature');

 // Find a real blossom attached to the currently visible natural grass, not
 // a hard-coded object, fake pixel or invented scene image.
 const blossom=await page.evaluate(async()=>{
   const {terrainHeight,BLOCK,CHUNK_SIZE}=await import('./src/voxel.mjs');
   const {meadowAccentVertices}=await import('./src/meadow.mjs');
   const dev=window.__mythwroughtTest;
   const model={seed:179,get:(x,y,z)=>dev.block(x,y,z)};
   const flowers=[];
   for(const cx of [-1,0,1])for(const cz of [-1,0,1]){
     const mesh=meadowAccentVertices(model,cx,cz,{
       chunkSize:CHUNK_SIZE,heightAt:terrainHeight,grass:BLOCK.GRASS,air:BLOCK.AIR
     });
     for(let k=0;k<mesh.length;k+=9){
       if(mesh[k+8]!==8)continue;
       const x=Math.floor(mesh[k]),z=Math.floor(mesh[k+2]),y=terrainHeight(x,z,179);
       if(!flowers.some(f=>f.x===x&&f.z===z))flowers.push({x,y,z});
     }
   }
   flowers.sort((a,b)=>(a.x*a.x+a.z*a.z)-(b.x*b.x+b.z*b.z));
   return {flower:flowers[0],total:flowers.length};
 });
 assert.ok(blossom.flower&&blossom.total>=10,
   'Did not find multiple seed-179 wildflowers in nearby chunks');
 const {x,y,z}=blossom.flower;

 await page.evaluate(({x,y,z})=>{
   const dev=window.__mythwroughtTest;
   dev.teleport(x-2,z+2);
   dev.aimAt(x,y+1,z);
 },{x,y,z});
 await loaded();
 const before=await stats();
 assert.ok(before.gap.every(v=>v>=-2),'Foliage altered the external two-thumb viewport');
 const bytesBefore=await saved();
 assert.equal(bytesBefore,null,'Rendering blooms modified original schema-1 storage');
 await mkdir('artifacts',{recursive:true});
 await page.screenshot({path:'artifacts/mythwrought-v010-whimsical-meadow-blooms.png'});

 // Mining or constructing over a real flower removes only its visual accents;
 // the *existing* original save schema remains authoritative and reversible.
 await page.evaluate(({x,y,z})=>window.__mythwroughtTest.placeFixture(x,y,z,0),{x,y,z});
 await page.waitForFunction(({x,y,z})=>window.__mythwroughtTest.block(x,y,z)===0,{x,y,z});
 assert.match(await saved(),/"schema":1/);
 assert.ok((await saved()).includes('['+[x,y,z,0].join(',')+']'));
 const afterMine=await page.evaluate(async({x,y,z})=>{
   const {meadowAccentVertices}=await import('./src/meadow.mjs');
   const {terrainHeight}=await import('./src/voxel.mjs');
   const dev=window.__mythwroughtTest;
   const mesh=meadowAccentVertices({seed:179,get:(a,b,c)=>dev.block(a,b,c)},
     Math.floor(x/16),Math.floor(z/16),{heightAt:terrainHeight});
   for(let i=0;i<mesh.length;i+=9){
     if(mesh[i+8]===8&&Math.floor(mesh[i])===x&&Math.floor(mesh[i+2])===z)return false;
   }
   return true;
 },{x,y,z});
 assert.equal(afterMine,true,'Flower survived removal of its grass voxel');
 await page.reload({waitUntil:'networkidle'});
 await loaded();
 assert.equal(await page.evaluate(({x,y,z})=>window.__mythwroughtTest.block(x,y,z),{x,y,z}),0,
  'Save/reload erased a mined voxel beneath meadow');

 await page.evaluate(({x,y,z})=>window.__mythwroughtTest.placeFixture(x,y,z,1),{x,y,z});
 await loaded();
 const bytesAfter=await saved();
 assert.ok(bytesAfter,'Restored original block did not save');
 const parsed=JSON.parse(bytesAfter);
 assert.equal(parsed.schema,1);
 assert.equal(parsed.seed,179);
 assert.equal(parsed.edits.filter(row=>row[0]===x&&row[1]===y&&row[2]===z).length,0,
   'Restored original grass left a phantom persistent edit');
 const reappeared=await page.evaluate(async({x,y,z})=>{
   const {meadowAccentVertices}=await import('./src/meadow.mjs');
   const {terrainHeight}=await import('./src/voxel.mjs');
   const dev=window.__mythwroughtTest;
   const mesh=meadowAccentVertices({seed:179,get:(a,b,c)=>dev.block(a,b,c)},
     Math.floor(x/16),Math.floor(z/16),{heightAt:terrainHeight});
   for(let i=0;i<mesh.length;i+=9)
     if(mesh[i+8]===8&&Math.floor(mesh[i])===x&&Math.floor(mesh[i+2])===z)return true;
   return false;
 },{x,y,z});
 assert.ok(reappeared,'Restoring a grass voxel failed to restore its decorative blossom');
 await page.screenshot({path:'artifacts/mythwrought-v010-whimsical-meadow-restored.png'});

 // Keep source UI and environment legible after the original terrain edit.
 const last=await stats();
 assert.ok(last.gap.every(v=>v>=-2));
 assert.ok(Number(last.d.loadedChunks)===25);
 assert.ok(Number(last.d.renderedMeshVertices)>0);
 assert.deepEqual(errors,[],'JavaScript or shader runtime exception');
 assert.deepEqual(missing,[],'Missing public resources');
 console.log('PASS Gate A edit-aware whimsical voxel meadows: actual colorful bloom geometry, untouched initial save, mined/restored schema-1 grass, complete 25-chunk streaming and external grips');
}finally{await browser.close();}
