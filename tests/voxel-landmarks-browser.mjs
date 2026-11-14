// Genuine in-engine Chromium scenes for the physically editable replacements.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {VoxelWorld,terrainHeight,baseBlock,chunkCoord,BLOCK,WORLD_MAX_Y} from '../src/voxel.mjs';
import {voxelLandmarksForChunk} from '../src/voxel-landmarks.mjs';
const opts={heightAt:terrainHeight,baseAt:baseBlock,maxY:WORLD_MAX_Y};
const candidates=[[-7,-5,'watchtower'],[2,-6,'shrine'],[9,-23,'arch'],[11,-11,'causeway']];
for(let cx=-20;cx<=20;cx++){
  let found=false;
  for(let cz=-20;cz<=20;cz++){
    if(((cx%4)+4)%4!==1||((cz%4)+4)%4!==2)continue;
    if(voxelLandmarksForChunk(cx,cz,179,opts).sites.some(s=>s.kind==='waystone')){
      candidates.unshift([cx,cz,'waystone']);found=true;break;
    }
  }
  if(found)break;
}
assert.equal(candidates.length,5);
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const page=await context.newPage(),errors=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)missing.push(r.url()+' '+r.status());});
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,null,{timeout:20000});
 await mkdir('artifacts',{recursive:true});
 for(const [cx,cz,kind] of candidates){
   const {sites,blocks}=voxelLandmarksForChunk(cx,cz,179,opts);
   const site=sites.find(s=>s.kind===kind);
   assert.ok(site,'missing real '+kind);
   const [key,material]=[...blocks][0],coords=key.split(',').map(Number);
   const expectedKey=chunkCoord(site.x+5)+','+chunkCoord(site.z+9);
   await page.evaluate(({site,expectedKey})=>{
     const d=window.__mythwroughtTest;
     d.teleport(site.x+5,site.z+9);
     d.aimAt(site.x,site.groundY+3,site.z);
   },{site,expectedKey});
   await page.waitForFunction(expected=>document.querySelector('#scene')?.dataset.chunkCenter===expected,expectedKey,{timeout:15000});
   await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,null,{timeout:20000});
   assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),coords),material,kind+' must be physical on the game page');
   assert.ok(await page.evaluate(()=>Number(document.querySelector('#scene').dataset.renderedMeshVertices))>1000);
   await page.screenshot({path:'artifacts/voxelized-'+kind+'-actual-chromium.png'});
 }
 const [cx,cz]=candidates[0],{blocks}=voxelLandmarksForChunk(cx,cz,179,opts),[cell]=blocks;
 const p=cell[0].split(',').map(Number),original=cell[1];
 await page.evaluate(p=>window.__mythwroughtTest.placeFixture(...p,0),p);
 assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),p),BLOCK.AIR,'mining landmark not reflected in live world');
 await page.reload({waitUntil:'networkidle'});
 await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>0,null,{timeout:20000});
 assert.equal(await page.evaluate(p=>window.__mythwroughtTest.block(...p),p),BLOCK.AIR,'mined landmark block did not survive reload');
 assert.notEqual(original,BLOCK.AIR);
 assert.deepEqual(errors,[],'browser errors during landscape screenshots and save roundtrip');
 assert.deepEqual(missing,[],'missing game resource requests');
 console.log('PASS five genuine voxel landmark scenes + in-browser collision baseline + mining and reload');
}finally{await browser.close();}
