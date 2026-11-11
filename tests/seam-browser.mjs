// MYTHWROUGHT v0.07: real Chromium seam-edit and horizontal iPhone thumb regressions.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true});
const page=await context.newPage(),errors=[],missing=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400)missing.push(response.url());});
const get=()=>page.evaluate(()=>{
  const c=document.querySelector('#scene');
  return {x:Number(c.dataset.playerX),z:Number(c.dataset.playerZ),
    yaw:Number(c.dataset.cameraYaw),pitch:Number(c.dataset.cameraPitch),
    loaded:Number(c.dataset.loadedChunks),pending:Number(c.dataset.pendingChunks),
    center:c.dataset.chunkCenter,target:c.dataset.targetBlock,
    last:c.dataset.lastEditedChunks?.split(';').filter(Boolean)??[],
    batches:Number(c.dataset.meshEditBatches),
    vertices:Number(c.dataset.renderedMeshVertices)};
});
const touch=(id,x,y)=>({id,x:Math.round(x),y:Math.round(y)});
const center=box=>({x:box.x+box.width/2,y:box.y+box.height/2});
const populated=()=>page.waitForFunction(()=>{
  const d=document.querySelector('#scene')?.dataset;
  return Number(d?.loadedChunks)===25&&Number(d?.pendingChunks)===0;
},null,{timeout:30000});

try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await populated();
  assert.equal(await page.evaluate(()=>typeof window.__mythwroughtTest),'object');
  assert.match(await page.title(),/v0\.09/);
  const cdp=await context.newCDPSession(page);
  const left=center(await page.locator('#movePad').boundingBox());
  const right=center(await page.locator('#lookPad').boundingBox());
  
  // Both horizontal directions were previously inverted on the user's iPhone.
  // Physical right thumb motion must turn right (negative yaw in this renderer).
  await page.evaluate(()=>{window.__mythwroughtTest.teleport(.5,.5);window.__mythwroughtTest.setOrientation(Math.PI,0);});
  const beforeMove=await get();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(1,left.x,left.y)]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[touch(1,left.x+32,left.y)]});
  await page.waitForFunction(base=>Number(document.querySelector('#scene').dataset.playerX)>base+.08,beforeMove.x,{timeout:7000});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const afterMove=await get();
  assert.ok(afterMove.x>beforeMove.x+.08,'Left thumb right still moves hero left');
  await page.evaluate(()=>window.__mythwroughtTest.setOrientation(0,0));
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(2,right.x,right.y)]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[touch(2,right.x+39,right.y)]});
  await page.waitForFunction(()=>Number(document.querySelector('#scene').dataset.cameraYaw)<-.12,null,{timeout:5000});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.ok((await get()).yaw<-.12,'Right thumb right still turns camera left');

  // Vertical axes must remain unchanged: upward swipe raises the camera.
  await page.evaluate(()=>window.__mythwroughtTest.setOrientation(0,0));
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(3,right.x,right.y)]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[touch(3,right.x,right.y-36)]});
  await page.waitForFunction(()=>Number(document.querySelector('#scene').dataset.cameraPitch)>.12,null,{timeout:5000});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});

  // Continuous stick mode must also reverse horizontal without affecting vertical.
  await page.locator('#menu').click();
  await page.locator('#lookMode').selectOption('stick');
  await page.locator('#closeHelp').click();
  await page.evaluate(()=>window.__mythwroughtTest.setOrientation(0,0));
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(4,right.x+34,right.y)]});
  await page.waitForFunction(()=>Number(document.querySelector('#scene').dataset.cameraYaw)<-.08,null,{timeout:7000});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});

  // Build a lightweight fixture at a POSITIVE x=16 chunk boundary.
  // Actual MINE and PLACE buttons must update BOTH loaded adjacent meshes.
  await page.evaluate(()=>{
    const dev=window.__mythwroughtTest;
    dev.placeFixture(14,13,0,3); // standing platform; no gameplay save-schema changes
    dev.placeFixture(16,18,0,5);
    dev.placeFixture(17,18,0,3);
    dev.teleport(14.5,.5);
    dev.aimAt(16,18,0);
  });
  await populated();
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.targetBlock==='16,18,0',null,{timeout:7000});
  const beforeEdit=await get();
  await page.locator('#dig').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),0,'MINE failed at seam');
  const mined=await page.evaluate(()=>window.__mythwroughtTest.snapshot());
  assert.ok(mined.editMeshBatches>beforeEdit.batches);
  assert.deepEqual(mined.lastEditMeshKeys,['1,0','0,0','1,-1'],'Edit did not atomically update visible seam neighbors');
  // Re-aim at the backing block; the player is looking uphill at a floating
  // test fixture, so the original ray would overshoot it after mining.
  await page.evaluate(()=>window.__mythwroughtTest.aimAt(17,18,0));
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.targetBlock==='17,18,0',null,{timeout:7000});
  await page.locator('#place').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),3,'PLACE failed across seam');
  assert.deepEqual(
    await page.evaluate(()=>window.__mythwroughtTest.snapshot().lastEditMeshKeys),
    ['1,0','0,0','1,-1']);
  const save=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
  assert.ok(save?.includes('[16,18,0,3]'),'Chunk-edge edit was not saved in original schema');

  // Streaming to both positive and negative boundary centers remains bounded.
  await mkdir('artifacts',{recursive:true});
  await page.evaluate(()=>{
    const dev=window.__mythwroughtTest;
    dev.teleport(16.5,.5);dev.setOrientation(Math.PI,-.14);
  });
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.chunkCenter==='1,0',null,{timeout:7000});
  await populated();
  const positive=await get();
  assert.ok(positive.loaded<=25&&positive.pending===0&&positive.vertices>0&&positive.vertices<5000000);
  await page.screenshot({path:'artifacts/mythwrought-v007-positive-seam.png'});
  await page.evaluate(()=>{
    const dev=window.__mythwroughtTest;
    dev.teleport(-16.5,-.5);dev.setOrientation(Math.PI,-.14);
  });
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.chunkCenter==='-2,-1',null,{timeout:7000});
  await populated();
  const negative=await get();
  assert.equal(negative.loaded,25);
  assert.ok(negative.vertices>0&&negative.vertices<5000000);
  await page.screenshot({path:'artifacts/mythwrought-v007-negative-seam.png'});
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),3,'Edit vanished after traveling through chunks');

  await page.reload({waitUntil:'networkidle'});
  await populated();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),3,'Chunk-border edit vanished on reload');
  assert.deepEqual(errors,[],'Browser JavaScript errors');
  assert.deepEqual(missing,[],'Missing game files');
  console.log('PASS v0.07 positive/negative seam travel, actual seam MINE/PLACE, saved edits and horizontal thumb axes');
}finally{await browser.close();}
