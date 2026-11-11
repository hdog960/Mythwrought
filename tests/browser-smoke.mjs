import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
const {PNG}=pngjs;

const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true});
const page=await context.newPage();
const errors=[],badRequests=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)badRequests.push(r.status()+' '+r.url());});
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>document.querySelector('#scene')?.width>0,{timeout:20000});
  await page.waitForTimeout(1600);
  const state=await page.evaluate(()=>{
    const canvas=document.querySelector('#scene'),left=document.querySelector('.left').getBoundingClientRect();
    const right=document.querySelector('.right').getBoundingClientRect(),view=canvas.getBoundingClientRect();
    const gl=canvas.getContext('webgl2');
    return {webgl:!!gl,width:canvas.width,height:canvas.height,noticeHidden:document.querySelector('#notice').hidden,
      layout:left.right<=view.left+3&&right.left>=view.right-3,
      status:document.querySelector('#status').textContent};
  });
  assert.ok(state.webgl,'WebGL2 is not initialized');
  assert.ok(state.width>200&&state.height>100,'Viewport too small');
  assert.ok(state.noticeHidden,'Fatal error overlay is showing');
  assert.equal(await page.locator('#scene').getAttribute('data-sky-drawn'),'true','Sky pass did not render');
  assert.ok(state.layout,'Controller grips overlap the world viewport');
  // Aim toward the ground with the actual right-pad pointer interaction.
  const pad=await page.locator('#lookPad').boundingBox();
  assert.ok(pad,'Missing look pad');
  const initialYaw=Number(await page.locator('#scene').getAttribute('data-camera-yaw'));
  await page.mouse.move(pad.x+pad.width/2,pad.y+pad.height/2);
  await page.mouse.down();
  await page.mouse.move(pad.x+pad.width/2+42,pad.y+pad.height/2+72,{steps:8});
  await page.mouse.up();
  const changedYaw=Number(await page.locator('#scene').getAttribute('data-camera-yaw'));
  assert.ok(Math.abs(changedYaw-initialYaw)>.15,'Right thumb pad did not rotate the camera');
  await page.locator('#dig').click();
  const editStatus=await page.locator('#status').textContent();
  assert.match(editStatus,/Removed (?:stone|earth|grass|ore|crystal|timber) · saved/,'Touch-side mining did not edit and save terrain');
  const edits=await page.evaluate(()=>JSON.parse(localStorage.getItem('mythwrought-v002-world-179')||'{}').edits);
  assert.ok(Array.isArray(edits)&&edits.length>0,'Mining did not persist a real block edit');
  await page.locator('#menu').click();
  assert.ok(await page.locator('#help').isVisible(),'Help should open');
  const helpTouchAction=await page.locator('.helpbody').evaluate(el=>getComputedStyle(el).touchAction);
  assert.equal(helpTouchAction,'pan-y','Settings modal must permit vertical finger scrolling on iPhone');
  const canvasTouchAction=await page.locator('#scene').evaluate(el=>getComputedStyle(el).touchAction);
  assert.equal(canvasTouchAction,'none','Gameplay canvas must not drag or scroll the page');
  await page.locator('#lookSensitivity').focus();
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('#lookValue').textContent(),'150%','Camera sensitivity did not update');
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v003-look-percent')),'150');
  await page.locator('#save').click();
  const save=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
  assert.ok(save?.includes('"schema":1'),'Prototype save missing');
  await page.locator('#seedInput').fill('Moonlit Vale');
  await page.locator('#switchWorld').click();
  assert.ok((await page.locator('#seed').textContent()).startsWith('WORLD '));
  const savedSeed=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-selected-seed'));
  assert.ok(savedSeed&&savedSeed!=='179','Named seed not selected');
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#scene')?.width>0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-selected-seed')),savedSeed);
  await page.locator('#menu').click();
  assert.equal(await page.locator('#lookValue').textContent(),'150%','Camera preference failed to survive reload');
  await page.locator('#closeHelp').click();
  await page.locator('#menu').click();
  await page.locator('#seedInput').fill('179');
  await page.locator('#switchWorld').click();
  assert.equal(await page.locator('#seed').textContent(),'WORLD 179');
  const oldEdits=await page.evaluate(()=>JSON.parse(localStorage.getItem('mythwrought-v002-world-179')).edits);
  assert.ok(oldEdits.length>0,'Seed switching lost the previous world edit');
  await page.locator('#closeHelp').click();
  assert.ok(!(await page.locator('#help').isVisible()),'Help should close');
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'scene','Closing settings should restore world keyboard focus');
  const grip=await page.locator('.right').boundingBox();
  for(const id of ['#lookPad','#precision','#dig','#place']){
    const b=await page.locator(id).boundingBox();
    assert.ok(b.x>=grip.x-2&&b.x+b.width<=grip.x+grip.width+2,'Control '+id+' horizontally escaped right grip');
    assert.ok(b.y>=grip.y-2&&b.y+b.height<=grip.y+grip.height+2,'Control '+id+' vertically escaped right grip');
  }

  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,null,{timeout:15000});
  await page.waitForTimeout(300); // Capture a fully rebuilt seed, not a transient partial-frame stream.
  await mkdir('artifacts',{recursive:true});
  const screenshot=await page.screenshot({path:'artifacts/mythwrought-landscape-smoke.png',fullPage:true});
  const shot=PNG.sync.read(screenshot),rect=await page.locator('#scene').boundingBox();
  assert.ok(rect,'Canvas disappeared before screenshot');
  const colors=new Set();
  // Sample the rendered COMPOSITED canvas, not a discarded WebGL backbuffer.
  for(let y=1;y<=6;y++)for(let x=1;x<=9;x++){
    const px=Math.floor(rect.x+rect.width*x/10),py=Math.floor(rect.y+rect.height*y/7);
    const i=(py*shot.width+px)*4;
    colors.add([shot.data[i]>>4,shot.data[i+1]>>4,shot.data[i+2]>>4].join(','));
  }
  assert.ok(colors.size>=4,'World screenshot is visually blank or uniform; unique color groups='+colors.size);
  assert.deepEqual(errors,[],'Browser JavaScript errors');
  assert.deepEqual(badRequests,[],'Missing app resources');
  console.log('PASS landscape WebGL smoke',JSON.stringify(state));
}finally{
  await browser.close();
}
