// Two-thumb interaction contract: real Chrome-dispatched multitouch, not synthetic DOM clicks.
// Checks isolation of movement/look, sticky-input cancellation, precision and stick mode.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const v=async()=>page.evaluate(()=>{
  const c=document.getElementById('scene');
  return {x:Number(c.dataset.playerX),z:Number(c.dataset.playerZ),yaw:Number(c.dataset.cameraYaw),
    pitch:Number(c.dataset.cameraPitch),precision:c.dataset.precision,mode:c.dataset.lookMode,
    chunks:Number(c.dataset.loadedChunks)};
});
const center=box=>({x:Math.round(box.x+box.width/2),y:Math.round(box.y+box.height/2)});
const touch=(id,x,y)=>({id,x:Math.round(x),y:Math.round(y)});
const deltaYaw=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,{timeout:20000});
  const left=center(await page.locator('#movePad').boundingBox());
  const right=center(await page.locator('#lookPad').boundingBox());
  const cdp=await context.newCDPSession(page);
  const begin=await v();
  // Both thumbs down at once, then move independently while both remain held.
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(1,left.x,left.y),touch(2,right.x,right.y)]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[touch(1,left.x,left.y-37),touch(2,right.x+32,right.y+40)]});
  await page.waitForTimeout(650);
  const moving=await v();
  assert.ok(Math.hypot(moving.x-begin.x,moving.z-begin.z)>.15,'Left thumb did not move hero while looking');
  assert.ok(Math.abs(deltaYaw(moving.yaw,begin.yaw))>.12,'Right thumb did not turn camera while moving');
  // Real CDP multitouch: hold the left thumb in motion while tapping
  // right-grip actions with a second finger. Click-only handlers can fail
  // here on Safari when the first pointer owns capture.
  const jumpCenter=center(await page.locator('#jump').boundingBox());
  const mineCenter=center(await page.locator('#dig').boundingBox());
  const placeCenter=center(await page.locator('#place').boundingBox());
  const moveFinger=touch(1,left.x,left.y-37);
  // End the right look pointer, but keep the left movement pointer active.
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[moveFinger]});
  await page.evaluate(()=>window.__mythwroughtTest.teleport(14.5,.5));
  const beforeJump=Number(await page.locator('#scene').getAttribute('data-player-feet'));
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[moveFinger,touch(7,jumpCenter.x,jumpCenter.y)]});
  await page.waitForFunction(base=>Number(document.querySelector('#scene').dataset.playerFeet)>base+.12,beforeJump,{timeout:5500});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[moveFinger]});
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.playerGrounded==='true',null,{timeout:8000});
  // Release movement displacement without lifting the movement thumb.
  // A moving pad was previously advancing the hero after teleport and
  // invalidating the known-good seam target before the next render.
  const heldNeutralFinger=touch(1,left.x,left.y);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[heldNeutralFinger]});
  await page.waitForTimeout(150);
  await page.evaluate(()=>{
    const t=window.__mythwroughtTest;
    t.teleport(14.5,.5);
    t.placeFixture(14,13,0,0);
    t.placeFixture(16,18,0,3);
    t.placeFixture(17,18,0,3);
    t.aimAt(16,18,0);
  });
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.targetBlock==='16,18,0',null,{timeout:8000}).catch(async error=>{
    const state=await page.evaluate(()=>({scene:{...document.querySelector('#scene').dataset},
      hero:{x:document.querySelector('#scene').dataset.playerX,feet:document.querySelector('#scene').dataset.playerFeet,z:document.querySelector('#scene').dataset.playerZ},
      block:window.__mythwroughtTest.block(16,18,0)}));
    throw new Error('Mine fixture target unavailable: '+JSON.stringify(state),{cause:error});
  });
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[heldNeutralFinger,touch(8,mineCenter.x,mineCenter.y)]});
  await page.waitForFunction(()=>window.__mythwroughtTest.block(16,18,0)===0,null,{timeout:5000});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[heldNeutralFinger]});
  // Restore the known-good seam fixture from blocks-browser.mjs, where
  // targeting (17,18,0) exposes (16,18,0) as a valid placement cell.
  // The movement thumb remains held at the neutral pad center.
  await page.evaluate(()=>{
    window.__mythwroughtTest.placeFixture(14,13,0,3);
    window.__mythwroughtTest.teleport(14.5,.5);
    window.__mythwroughtTest.placeFixture(16,18,0,0);
    window.__mythwroughtTest.placeFixture(17,18,0,3);
    window.__mythwroughtTest.aimAt(17,18,0);
  });
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.targetBlock==='17,18,0',null,{timeout:8000}).catch(async error=>{
    const state=await page.evaluate(()=>({scene:{...document.querySelector('#scene').dataset},
      support:window.__mythwroughtTest.block(14,13,0),
      empty:window.__mythwroughtTest.block(16,18,0),
      target:window.__mythwroughtTest.block(17,18,0)}));
    throw new Error('Place fixture target unavailable: '+JSON.stringify(state),{cause:error});
  });
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.targetPlace==='16,18,0',null,{timeout:8000});
  assert.equal(await page.evaluate(()=>document.querySelector('#scene').dataset.canPlace),'true','Seam fixture must expose a legal placement cell');
  // Keep the first finger down at the neutral pad center for a stable
  // build target; the earlier jump and mine actions exercised moving input.
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[heldNeutralFinger,touch(9,placeCenter.x,placeCenter.y)]});
  await page.waitForFunction(()=>window.__mythwroughtTest.block(16,18,0)===3,null,{timeout:5000});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[heldNeutralFinger]});
  // A tap must perform one action, not pointerdown plus synthetic click.
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),3);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(90);
  const released=await v();
  await page.waitForTimeout(250);
  const stopped=await v();
  assert.ok(Math.hypot(stopped.x-released.x,stopped.z-released.z)<.035,'Movement continued after both thumbs lifted');
  assert.ok(Math.abs(deltaYaw(stopped.yaw,released.yaw))<.005,'Camera drifted after release');
  assert.equal(await page.evaluate(()=>window.scrollY),0,'Multi-touch gesture scrolled the game page');
  // Continuous stick mode must rotate only while held, using a radial dead zone.
  await page.locator('#menu').click();
  // Queued synthetic iOS events must not activate action buttons behind settings.
  const blocked=await page.evaluate(()=>{
    const scene=document.querySelector('#scene');
    const before={jump:scene.dataset.playerVelocityY,edits:window.__mythwroughtTest.block(16,18,0)};
    for(const id of ['jump','dig','place']){
      const button=document.getElementById(id);
      button.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerType:'touch'}));
      button.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,detail:0}));
    }
    return {before,after:{jump:scene.dataset.playerVelocityY,edits:window.__mythwroughtTest.block(16,18,0)}};
  });
  assert.deepEqual(blocked.after,blocked.before,'Menu-open touch actions modified gameplay state');
  await page.locator('#lookMode').selectOption('stick');
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v004-look-mode')),'stick');
  await page.locator('#closeHelp').click();
  const beforeStick=await v();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(3,right.x+32,right.y)]});
  await page.waitForTimeout(500);
  const duringStick=await v();
  assert.equal(duringStick.mode,'stick');
  assert.ok(Math.abs(deltaYaw(duringStick.yaw,beforeStick.yaw))>.09,'Hold-to-turn stick mode failed');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(80);
  const afterStick=await v();
  await page.waitForTimeout(250);
  assert.ok(Math.abs(deltaYaw((await v()).yaw,afterStick.yaw))<.005,'Stick continued turning after release');
  // Holding precision must be a distinct action, never a persistent toggle.
  const precision=center(await page.locator('#precision').boundingBox());
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(4,precision.x,precision.y)]});
  // The pointer event changes the button synchronously, but the canvas data
  // attribute is published on the NEXT WebGL frame. Software GPU CI may need
  // >70 ms for that frame; keep both assertions instead of sleeping blindly.
  await page.waitForFunction(()=>document.querySelector('#precision').classList.contains('held'),null,{timeout:2500});
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.precision==='true',null,{timeout:2500});
  assert.equal((await v()).precision,'true','Precision button did not engage while pressed');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForFunction(()=>!document.querySelector('#precision').classList.contains('held'),null,{timeout:2500});
  await page.waitForFunction(()=>document.querySelector('#scene').dataset.precision==='false',null,{timeout:2500});
  assert.equal((await v()).precision,'false','Precision button stuck after release');
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>0);
  await page.locator('#menu').click();
  assert.equal(await page.locator('#lookMode').inputValue(),'stick','Look mode not persisted after reload');
  await page.locator('#closeHelp').click();
  // Page blur must clear any active stick to prevent motion after app-switching.
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch(5,left.x,left.y-32)]});
  await page.waitForTimeout(160);
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
  const blur=await v();
  await page.waitForTimeout(240);
  const afterBlur=await v();
  assert.ok(Math.hypot(afterBlur.x-blur.x,afterBlur.z-blur.z)<.06,'Input remained held across app blur');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  // A jump queued just before app suspension must never fire on resume.
  // Dispatch keydown and blur in one JS turn, before the next animation frame.
  await page.evaluate(()=>{
    const scene=document.getElementById('scene');
    scene.focus({preventScroll:true});
    scene.dispatchEvent(new KeyboardEvent('keydown',{code:'Space',bubbles:true,cancelable:true}));
    window.dispatchEvent(new Event('blur'));
  });
  const beforeResume=await page.evaluate(()=>Number(document.querySelector('#scene').dataset.playerFeet));
  await page.waitForTimeout(250);
  const afterResume=await page.evaluate(()=>({
    feet:Number(document.querySelector('#scene').dataset.playerFeet),
    velocity:Number(document.querySelector('#scene').dataset.playerVelocityY)
  }));
  assert.ok(afterResume.feet<=beforeResume+.06,'Queued jump fired after blur');
  assert.ok(afterResume.velocity<=.01,'Jump velocity persisted after blur');
  assert.deepEqual(errors,[],'Console/page errors during 2-thumb interaction');
  console.log('PASS simultaneous movement with jump/mine/place, dual-thumb look, precision, cancellation');
}finally{
  await browser.close();
}
