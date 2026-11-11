import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

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
    const pixels=new Uint8Array(4),cx=Math.floor(canvas.width/2),cy=Math.floor(canvas.height/2);
    gl?.readPixels(cx,cy,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
    return {webgl:!!gl,width:canvas.width,height:canvas.height,noticeHidden:document.querySelector('#notice').hidden,
      layout:left.right<=view.left+3&&right.left>=view.right-3,pixel:[...pixels],
      status:document.querySelector('#status').textContent};
  });
  assert.ok(state.webgl,'WebGL2 is not initialized');
  assert.ok(state.width>200&&state.height>100,'Viewport too small');
  assert.ok(state.noticeHidden,'Fatal error overlay is showing');
  assert.ok(state.layout,'Controller grips overlap the world viewport');
  assert.ok(state.pixel.some(v=>v!==0),'Viewport pixel appears unrendered');
  // Aim toward the ground with the actual right-pad pointer interaction.
  const pad=await page.locator('#lookPad').boundingBox();
  assert.ok(pad,'Missing look pad');
  await page.mouse.move(pad.x+pad.width/2,pad.y+pad.height/2);
  await page.mouse.down();
  await page.mouse.move(pad.x+pad.width/2,pad.y+pad.height/2+72,{steps:8});
  await page.mouse.up();
  await page.locator('#dig').click();
  const editStatus=await page.locator('#status').textContent();
  assert.match(editStatus,/Block removed and saved/,'Touch-side mining control did not edit terrain');
  const edits=await page.evaluate(()=>JSON.parse(localStorage.getItem('mythwrought-v002-world-179')||'{}').edits);
  assert.ok(Array.isArray(edits)&&edits.length>0,'Mining did not persist a real block edit');
  await page.locator('#menu').click();
  assert.ok(await page.locator('#help').isVisible(),'Help should open');
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
  await page.locator('#seedInput').fill('179');
  await page.locator('#switchWorld').click();
  assert.equal(await page.locator('#seed').textContent(),'WORLD 179');
  const oldEdits=await page.evaluate(()=>JSON.parse(localStorage.getItem('mythwrought-v002-world-179')).edits);
  assert.ok(oldEdits.length>0,'Seed switching lost the previous world edit');
  await page.locator('#closeHelp').click();
  assert.ok(!(await page.locator('#help').isVisible()),'Help should close');
  await mkdir('artifacts',{recursive:true});
  await page.screenshot({path:'artifacts/mythwrought-landscape-smoke.png',fullPage:true});
  assert.deepEqual(errors,[],'Browser JavaScript errors');
  assert.deepEqual(badRequests,[],'Missing app resources');
  console.log('PASS landscape WebGL smoke',JSON.stringify(state));
}finally{
  await browser.close();
}
