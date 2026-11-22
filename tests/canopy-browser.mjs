// Genuine Chromium WebGL scene and reversible canopy edit test.
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const loaded=()=>page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25&&Number(document.querySelector('#scene')?.dataset.pendingChunks)===0,null,{timeout:30000});
const inspect=()=>page.evaluate(async()=>{
 const {woodlandCanopyVertices}=await import('./src/canopy.mjs');
 const {terrainHeight,baseBlock}=await import('./src/voxel.mjs');
 const dev=window.__mythwroughtTest,world={seed:179,get:(x,y,z)=>dev.block(x,y,z)};
 const found=[];
 for(let cx=-2;cx<=2;cx++)for(let cz=-2;cz<=2;cz++){
   const vertices=woodlandCanopyVertices(world,cx,cz,{heightAt:terrainHeight,baseAt:baseBlock});
   if(vertices.length){
     const x=Math.floor(vertices[0]),z=Math.floor(vertices[2]);
     found.push({x,z,y:terrainHeight(x,z,179),cx,cz});
   }
 }
 return found.sort((a,b)=>(a.x*a.x+a.z*a.z)-(b.x*b.x+b.z*b.z))[0]||null;
});
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await loaded();
 // The historical sources are retained but NONE may draw into the live game.
 const fakeMeshCheck=await page.evaluate(async()=>{
   const {VoxelWorld,meshChunk}=await import('./src/voxel.mjs');
   const w=new VoxelWorld(179),old=JSON.stringify(w.save());
   let vertices=0,physicalLeaves=0;
   for(const [cx,cz] of [[0,0],[-1,0],[0,-1]]){
     const mesh=meshChunk(w,cx,cz);
     for(let i=8;i<mesh.length;i+=9){
       const mat=mesh[i];vertices++;
       if(mat>=7&&mat<=17)throw Error('Noninteractive decorative geometry in live mesh: '+mat);
       if(mat===18)physicalLeaves++;
     }
   }
   // Nearby arbitrary chunks may contain no seed-selected tree. Also inspect
   // the exact original physical tree's occupied chunk to prove real leaves
   // survived even where the retired fake canopy used to be.
   const {liveVoxelDistrict}=await import('./src/live-voxel-world.mjs');
   const district=liveVoxelDistrict(w.seed,0,0,(x,y,z)=>w.legacyBlockAt(x,y,z));
   const real=district.trees.flatMap(t=>t.cells).find(c=>c[3]===7);
   if(!real)throw Error('Original seeded physical foliage missing');
   const mesh=meshChunk(w,Math.floor(real[0]/16),Math.floor(real[2]/16));
   for(let i=8;i<mesh.length;i+=9)if(mesh[i]===18)physicalLeaves++;
   return {vertices,physicalLeaves,saveUnchanged:JSON.stringify(w.save())===old};
 });
 assert.ok(fakeMeshCheck.vertices>1000&&fakeMeshCheck.saveUnchanged);
 assert.ok(fakeMeshCheck.physicalLeaves>0,
   'mineable seeded foliage must survive fake-canopy removal');

 const tree=await inspect();assert.ok(tree,'retired canopy source remains accessible for future real trees');
 await page.evaluate(p=>{window.__mythwroughtTest.teleport(p.x-3,p.z+3);window.__mythwroughtTest.aimAt(p.x,p.y+2,p.z);},tree);
 await loaded();await mkdir('artifacts',{recursive:true});
 await page.screenshot({path:'artifacts/mythwrought-v010-woodland-canopy-landscape.png'});
 for(const [w,h] of [[667,375],[844,390],[932,430]]){
   await page.setViewportSize({width:w,height:h});await loaded();
   await page.screenshot({path:`artifacts/manual-remove-fake-canopy-${w}x${h}.png`});
 }
 await page.setViewportSize({width:932,height:430});await loaded();
 const gap=()=>page.evaluate(()=>{const c=document.querySelector('#scene').getBoundingClientRect(),l=document.querySelector('.left').getBoundingClientRect(),r=document.querySelector('.right').getBoundingClientRect();return [c.left-l.right,r.left-c.right]});
 assert.ok((await gap()).every(x=>x>=-2));
 // M2: genuinely rendered current in-game source at all three supported
 // iPhone-landscape sizes, same seed/camera/feature as historical 932x430.
 // These PNGs are AFTER witnesses. Previous-main screenshots are retained
 // separately in GitHub Actions; do not mislabel old captures as exact-head.
 for(const [w,h] of [[667,375],[844,390],[932,430]]){
   await page.setViewportSize({width:w,height:h});await page.waitForTimeout(250);await loaded();
   assert.equal(await page.evaluate(()=>!!document.querySelector('#scene')?.getContext('webgl2')),true);
   assert.ok((await gap()).every(x=>x>=-2),'iPhone grips remain off the view');
   await page.screenshot({path:`artifacts/manual-m2-woodland-after-${w}x${h}.png`});
 }
 await page.setViewportSize({width:932,height:430});await loaded();
 // Render the unmodified baseline canopy.mjs through the ACTUAL same game
 // renderer, using a route-scoped source substitution in a separate browser
 // page. This never changes the installed game, main branch or saved world.
 // The fixture is byte-exact source from main 104e57ff / blob 9fea51ed.
 const previousSource=await readFile(new URL('./fixtures/manual-m1-canopy-before.mjs',import.meta.url),'utf8');
 const baselineContext=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true,serviceWorkers:'block'});
 const baseline=await baselineContext.newPage();
 const baselineErrors=[];
 baseline.on('pageerror',e=>baselineErrors.push(e.message));
 await baseline.route('**/src/canopy.mjs',async route=>route.fulfill({
   status:200,contentType:'text/javascript; charset=utf-8',body:previousSource
 }));
 try{
   await baseline.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
   await baseline.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25&&
      Number(document.querySelector('#scene')?.dataset.pendingChunks)===0,null,{timeout:30000});
   await baseline.evaluate(p=>{
     window.__mythwroughtTest.teleport(p.x-3,p.z+3);
     window.__mythwroughtTest.aimAt(p.x,p.y+2,p.z);
   },tree);
   await baseline.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25&&
      Number(document.querySelector('#scene')?.dataset.pendingChunks)===0,null,{timeout:30000});
   for(const [w,h] of [[667,375],[844,390],[932,430]]){
     await baseline.setViewportSize({width:w,height:h});
     await baseline.waitForTimeout(250);
     assert.equal(await baseline.evaluate(()=>!!document.querySelector('#scene')?.getContext('webgl2')),true);
     const rails=await baseline.evaluate(()=>{
       const c=document.querySelector('#scene').getBoundingClientRect();
       const l=document.querySelector('.left').getBoundingClientRect();
       const r=document.querySelector('.right').getBoundingClientRect();
       return [c.left-l.right,r.left-c.right];
     });
     assert.ok(rails.every(n=>n>=-2),'baseline rails must stay outside the canvas');
     await baseline.screenshot({path:`artifacts/manual-m1-woodland-before-${w}x${h}.png`});
   }
   assert.deepEqual(baselineErrors,[]);
 }finally{await baselineContext.close();}
 await page.evaluate(p=>window.__mythwroughtTest.placeFixture(p.x,p.y,p.z,0),tree);await loaded();
 assert.notDeepEqual(await inspect(),tree,'mined tree should disappear');
 await page.reload({waitUntil:'networkidle'});await loaded();
 assert.notDeepEqual(await inspect(),tree,'mined tree must remain absent after reload');
 await page.evaluate(p=>window.__mythwroughtTest.placeFixture(p.x,p.y,p.z,1),tree);await loaded();
 assert.deepEqual(await inspect(),tree,'restoring natural anchor restores deterministic canopy');
 await page.setViewportSize({width:568,height:320});await page.waitForTimeout(200);
 assert.ok((await gap()).every(x=>x>=-2));
 await page.screenshot({path:'artifacts/mythwrought-v010-woodland-canopy-compact.png'});
 assert.deepEqual(errors,[]);
 console.log('PASS genuine WebGL2: fake canopy absent, real editable tree blocks intact, three landscape images and historical source reversible');
}finally{await browser.close();}
