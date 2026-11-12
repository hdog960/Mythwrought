// Genuine headless Chromium WEBGL_lose_context -> WEBGL restore recovery.
// This is NOT a real Safari, Home Screen, iPhone memory or art approval test.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const context=await browser.newContext({
  viewport:{width:932,height:430},hasTouch:true,isMobile:true,deviceScaleFactor:1
});
const page=await context.newPage(),errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});
const saved=()=>page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
const state=()=>page.evaluate(()=>{
 const c=document.querySelector('#scene'),view=c.getBoundingClientRect();
 const left=document.querySelector('.grip.left').getBoundingClientRect();
 const right=document.querySelector('.grip.right').getBoundingClientRect();
 return {loaded:+c.dataset.loadedChunks,pending:+c.dataset.pendingChunks,
   center:c.dataset.chunkCenter,frame:+c.dataset.renderedFrames,
   graphics:window.__mythwroughtTest.snapshot().graphics,
   driver:window.__mythwroughtTest.snapshot().frameDriver,
   gaps:[view.left-left.right,right.left-view.right],
   worldWidth:view.width,noticeHidden:document.querySelector('#notice').hidden,
   renderPreset:c.dataset.renderPreset};
});
const settle=async (x,z)=>page.waitForFunction(({x,z})=>{
 const c=document.querySelector('#scene');
 return c?.dataset.chunkCenter===Math.floor((x+.5)/16)+','+Math.floor((z+.5)/16)&&
  +c.dataset.loadedChunks===25&&+c.dataset.pendingChunks===0;
},{x,z},{timeout:50000});
const capture=async(path)=>{
 const png=PNG.sync.read(await page.locator('#scene').screenshot({path}));
 const colors=new Set();
 for(let iy=1;iy<=9;iy++)for(let ix=1;ix<=15;ix++){
   const px=Math.floor(png.width*ix/16),py=Math.floor(png.height*iy/10),at=(py*png.width+px)*4;
   colors.add([png.data[at]>>4,png.data[at+1]>>4,png.data[at+2]>>4].join(','));
 }
 assert.ok(colors.size>=4,'Canvas was blank or uniform after WebGL restoration');
 return colors.size;
};
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>+document.querySelector('#scene')?.dataset.loadedChunks===25,
   null,{timeout:35000});
 await page.evaluate(()=>window.__mythwroughtTest.placeFixture(15,18,-1,4));
 const original=await saved();
 assert.ok(original?.includes('[15,18,-1,4]'));

 // Select a real, naturally generated cave-wall glyph and adjacent non-solid
 // cell; do not mock an art screenshot or place fake scene geometry.
 const target=await page.evaluate(async()=>{
   const {VoxelWorld,CHUNK_SIZE,WORLD_MIN_Y,WORLD_MAX_Y,terrainHeight,baseBlock,BLOCK,collides}
     =await import('./src/voxel.mjs');
   const {caveRuneVertices}=await import('./src/cave-runes.mjs');
   const w=new VoxelWorld(179);
   const faces=[[1,0],[-1,0],[0,1],[0,-1]];
   let glyphs=0,choice=null;
   for(let cx=-2;cx<=2;cx++)for(let cz=-2;cz<=2;cz++){
     const a=caveRuneVertices(w,cx,cz,{
       chunkSize:CHUNK_SIZE,minY:WORLD_MIN_Y,maxY:WORLD_MAX_Y,
       heightAt:terrainHeight,baseAt:baseBlock,air:BLOCK.AIR,
       stone:BLOCK.STONE,ore:BLOCK.ORE
     });
     glyphs+=a.length/(10*6*9);
     for(let i=0;i<a.length&&!choice;i+=10*6*9){
       const px=a[i],py=a[i+1],pz=a[i+2],y=Math.floor(py);
       for(const [dx,dz] of faces){
         const x=Math.floor(px-dx*.012),z=Math.floor(pz-dz*.012);
         if(![BLOCK.STONE,BLOCK.ORE].includes(w.get(x,y,z)))continue;
         const nx=x+dx,nz=z+dz;
         if(w.get(nx,y,nz)!==BLOCK.AIR||w.get(nx,y+1,nz)!==BLOCK.AIR||
           collides(w,nx+.5,y+.01,nz+.5))continue;
         choice={x,y,z,viewX:nx,viewY:y,viewZ:nz,cx,cz};
         break;
       }
     }
   }
   return {glyphs,choice};
 });
 assert.ok(target.glyphs>0&&target.choice,'No physically visible original cave-wall glyph');
 const rune=target.choice;
 await page.evaluate(r=>{
  const d=window.__mythwroughtTest;
  d.teleportCave(r.viewX,r.viewY,r.viewZ);
  d.aimAt(r.x,r.y,r.z);
 },rune);
 await settle(rune.viewX,rune.viewZ);
 const pre=await state();
 assert.equal(pre.loaded,25);assert.ok(pre.noticeHidden);
 assert.ok(pre.gaps.every(g=>g>=-2)&&pre.worldWidth>=932*.45);
 assert.equal(await saved(),original);
 await mkdir('artifacts',{recursive:true});
 await page.screenshot({path:'artifacts/mythwrought-v010-tree-star-cave-glyphs-before-loss.png'});
 await capture('artifacts/mythwrought-v010-cave-glyph-canvas.png');

 const extension=await page.evaluate(()=>{
   const gl=document.querySelector('#scene').getContext('webgl2');
   const ext=gl.getExtension('WEBGL_lose_context');
   if(!ext)return 'unavailable';
   window.__mythwroughtContextTest=ext;return 'available';
 });
 assert.equal(extension,'available','WEBGL_lose_context missing; cannot claim genuine GPU context-loss verification');
 for(let cycle=1;cycle<=2;cycle++){
   const previous=await state();
   await page.evaluate(()=>window.__mythwroughtContextTest.loseContext());
   await page.waitForFunction(n=>window.__mythwroughtTest.snapshot().graphics.lossCount===n,
     cycle,{timeout:10000});
   const lost=await state();
   assert.equal(lost.graphics.lost,true);
   assert.equal(lost.driver.running,false);
   assert.equal(await saved(),original,'Context loss overwrote canonical schema-1 bytes');
   await page.waitForTimeout(180);
   assert.equal((await state()).frame,lost.frame,'Lost context continued drawing frames');

   await page.evaluate(()=>window.__mythwroughtContextTest.restoreContext());
   await page.waitForFunction(n=>window.__mythwroughtTest.snapshot().graphics.restoredCount===n &&
     !window.__mythwroughtTest.snapshot().graphics.lost,cycle,{timeout:15000});
   await settle(rune.viewX,rune.viewZ);
   const after=await state();
   assert.equal(after.loaded,25);assert.equal(after.pending,0);
   assert.ok(after.noticeHidden,'Restored graphics still covered by fatal notice');
   assert.equal(after.graphics.shaderReady,true,'Shaders not rebuilt after context loss');
   assert.equal(after.driver.running,true);
   assert.equal(after.driver.wakeCount,previous.driver.wakeCount+1,
     'Restored renderer accidentally scheduled multiple animation loops');
   assert.ok(after.frame>lost.frame);
   assert.ok(after.gaps.every(x=>x>=-2));
   assert.equal(await saved(),original,'Context restore rewrote valid edit/save journal');
   await capture('artifacts/mythwrought-v010-context-restored-cycle-'+cycle+'.png');
   if(cycle===1){
     await page.locator('#menu').click();
     await page.locator('#renderPreset').selectOption('economy');
     await page.locator('#closeHelp').click();
     await page.waitForFunction(()=>document.querySelector('#scene').dataset.renderPreset==='economy');
     assert.equal(await saved(),original,'Economy mode changed world bytes');
   }
 }
 await page.screenshot({path:'artifacts/mythwrought-v010-context-restored-grips.png'});
 const last=await state();
 assert.equal(last.renderPreset,'economy');
 assert.equal(last.graphics.restoredCount,2);
 assert.equal(last.graphics.lossCount,2);
 assert.deepEqual(errors,[],'Runtime exception while recovering real WebGL2 context');
 assert.deepEqual(failed,[],'Missing or failed public resources');
 console.log('PASS Gate A two genuine WebGL context-loss/restore cycles, shader and 25-chunk rebuild, original cave glyph screenshots, schema-1 preservation and thumb grips');
}finally{await browser.close();}
