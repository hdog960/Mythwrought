import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import pngjs from 'pngjs';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {M6_BALANCED_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
const {PNG}=pngjs;

const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true});
const page=await context.newPage();
const errors=[],badRequests=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)badRequests.push(r.status()+' '+r.url());});
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
  // Actual root WebGL2 smoke is not allowed to bypass the new protected
  // start: original seed179 bytes may exist but must NEVER become playable.
  const old=new VoxelWorld(179);
  assert.equal(old.set(2,15,2,BLOCK.CRYSTAL),true);
  const historical=JSON.stringify(old.save());
  await page.locator('#playerMenu').waitFor({state:'visible',timeout:30000});
  assert.equal(await page.locator('#help').isVisible(),true,
    'Unprofiled old world bypassed current-generation gate');
  await page.evaluate(raw=>{
    localStorage.setItem('mythwrought-v002-world-179',raw);
    localStorage.setItem('mythwrought-v002-selected-seed','179');
  },historical);
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:/NEW WORLD/}).click();
  await page.locator('#help').waitFor({state:'hidden',timeout:45000});
  const first=await page.evaluate(()=>{
    const t=window.__mythwroughtTest,seed=t.snapshot().seed;
    return {seed,profile:t.fourBiomeProfile()?.generator,
      saved:localStorage.getItem('mythwrought-v002-world-'+seed),
      selected:localStorage.getItem('mythwrought-v002-selected-seed'),
      legacy:localStorage.getItem('mythwrought-v002-world-179')};
  });
  assert.notEqual(first.seed,179,'Archived seed179 became playable');
  assert.equal(first.profile,M6_BALANCED_GENERATOR,
    'Original root WebGL2 game did not enter installed current V6');
  assert.ok(first.saved?.includes('"schema":1'),'Current V6 schema-1 save missing');
  assert.equal(first.selected,String(first.seed));
  assert.equal(first.legacy,historical,'Creating V6 overwrote old schema-1 bytes');
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
    null,{timeout:60000});
  await page.waitForFunction(()=>document.querySelector('#scene')?.width>0,null,{timeout:20000});
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
  // Aim at an actual seeded natural surface block in the current V6 world.
  // This uses the same read-only aiming/teleport test hook as original Pack3;
  // the MINE interaction below remains the real player-facing button.
  const target=await page.evaluate(()=>{
    const t=window.__mythwroughtTest,x=16,z=0;
    let y=null;
    for(let at=30;at>=0;at--){
      if(t.block(x,at,z)!==0&&t.block(x,at+1,z)===0){y=at;break;}
    }
    if(y===null)throw Error('No authentic exposed V6 surface block for root mining proof');
    t.teleport(14.5,.5);t.aimAt(x,y,z);
    return {x,y,z};
  });
  await page.waitForFunction(({x,y,z})=>
    document.querySelector('#scene')?.dataset.targetBlock===x+','+y+','+z,
    target,{timeout:30000});
  const miningBefore=await page.evaluate(seed=>
    localStorage.getItem('mythwrought-v002-world-'+seed),first.seed);
  await page.locator('#dig').click();
  const editStatus=await page.locator('#status').textContent();
  assert.match(editStatus,/Removed .+ · saved/,
    'Actual touch-side mining did not modify and verifiably save current-V6 terrain');
  const mined=await page.evaluate(({seed,target})=>{
    const raw=localStorage.getItem('mythwrought-v002-world-'+seed);
    return {raw,edits:JSON.parse(raw).edits,
      block:window.__mythwroughtTest.block(target.x,target.y,target.z)};
  },{seed:first.seed,target});
  assert.equal(mined.block,BLOCK.AIR,
    'Live original-game MINE did not remove actual V6 natural terrain');
  assert.ok(Array.isArray(mined.edits)&&mined.edits.length>0&&mined.raw!==miningBefore,
    'Mined current-V6 block did not persist a real schema-1 terrain edit');
  assert.equal(await page.evaluate(()=>
    localStorage.getItem('mythwrought-v002-world-179')),historical,
    'Mining the current V6 world changed the archived original');
  await page.locator('#menu').click();
  assert.ok(await page.locator('#help').isVisible(),'Current settings should open');
  assert.equal(await page.locator('#playerMenu .player-menu-row').count(),3,
    'Creator-approved main menu has exactly Test Code, time and New World');
  const menuLayout=await page.evaluate(()=>{
    const p=document.getElementById('playerMenu'),r=p.getBoundingClientRect();
    return {scroll:p.scrollHeight,client:p.clientHeight,
      left:r.left,right:r.right,top:r.top,bottom:r.bottom};
  });
  assert.ok(menuLayout.scroll<=menuLayout.client+1&&menuLayout.left>=0&&
    menuLayout.right<=932+1&&menuLayout.top>=0&&menuLayout.bottom<=430+1,
    'Main menu overflows or scrolls on a real mobile landscape viewport');
  assert.equal(await page.locator('#save').isVisible(),false,
    'Legacy developer SAVE must not reappear in compact player settings');
  assert.equal(await page.locator('#switchWorld').isVisible(),false,
    'Obsolete-world switch must never be user-facing');
  const helpTouchAction=await page.locator('.helpbody').evaluate(el=>getComputedStyle(el).touchAction);
  assert.equal(helpTouchAction,'pan-y','Recovery drawer must permit vertical finger scrolling on iPhone');
  const canvasTouchAction=await page.locator('#scene').evaluate(el=>getComputedStyle(el).touchAction);
  assert.equal(canvasTouchAction,'none','Gameplay canvas must not drag or scroll the page');
  // Original sensitivity host remains mounted and functional, but is no
  // longer part of user-facing settings. Exercise its ORIGINAL input handler.
  await page.evaluate(()=>{
    const slider=document.getElementById('lookSensitivity');
    slider.value='150';slider.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await page.locator('#lookValue').textContent(),'150%','Camera sensitivity did not update');
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v003-look-percent')),'150');
  await page.locator('.player-menu-safety-link').click();
  assert.equal(await page.locator('#playerSafety').isVisible(),true);
  await page.getByRole('button',{name:'SAVE CURRENT WORLD'}).click();
  const afterExplicitSave=await page.evaluate(seed=>
    localStorage.getItem('mythwrought-v002-world-'+seed),first.seed);
  assert.equal(afterExplicitSave,mined.raw,
    'Current V6 save unexpectedly rewrote the already verified mined schema-1 bytes');
  await page.locator('.player-safety-back').click();
  await page.locator('.player-menu-close').click();
  assert.equal(await page.locator('#help').isVisible(),false);
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'scene',
    'Closing settings should restore actual world keyboard focus');
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>
    Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
    null,{timeout:60000});
  assert.equal(await page.locator('#help').isVisible(),false,
    'Saved current V6 world did not reopen directly on same-install reload');
  assert.equal(await page.locator('#lookValue').textContent(),'150%',
    'Original camera preference failed to persist during current-V6 reload');
  assert.equal(await page.evaluate(seed=>
    localStorage.getItem('mythwrought-v002-world-'+seed),first.seed),mined.raw,
    'Current world lost its actual MINE edit after browser reload');
  await page.locator('#menu').click();
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:/NEW WORLD/}).click();
  await page.locator('#help').waitFor({state:'hidden',timeout:45000});
  const second=await page.evaluate(()=>{
    const t=window.__mythwroughtTest,seed=t.snapshot().seed;
    return {seed,profile:t.fourBiomeProfile()?.generator,
      saved:localStorage.getItem('mythwrought-v002-world-'+seed)};
  });
  assert.notEqual(second.seed,first.seed,
    'Second current-world creation reused or overwrote prior saved identity');
  assert.equal(second.profile,M6_BALANCED_GENERATOR);
  assert.ok(second.saved?.includes('"schema":1'));
  assert.equal(await page.evaluate(seed=>
    localStorage.getItem('mythwrought-v002-world-'+seed),first.seed),mined.raw,
    'New current world overwrote previous V6 mining work');
  assert.equal(await page.evaluate(()=>
    localStorage.getItem('mythwrought-v002-world-179')),historical,
    'Second V6 world overwrote archived legacy seed179');
  // Treat an old selected seed as a read-only recovery case, not a playable
  // downgrade. Restore current selection without altering any world bytes.
  await page.evaluate(()=>localStorage.setItem('mythwrought-v002-selected-seed','179'));
  await page.reload({waitUntil:'networkidle'});
  await page.locator('#playerMenu').waitFor({state:'visible',timeout:30000});
  assert.equal(await page.locator('#help').isVisible(),true,
    'Legacy selected seed incorrectly resumed playable world');
  await page.getByRole('button',{name:'RETURN TO GAME'}).click();
  assert.equal(await page.locator('#help').isVisible(),true,
    'Legacy read-only world admission was bypassed');
  assert.equal(await page.evaluate(()=>
    localStorage.getItem('mythwrought-v002-world-179')),historical,
    'Protected legacy gate modified archived original bytes');
  await page.evaluate(seed=>
    localStorage.setItem('mythwrought-v002-selected-seed',String(seed)),second.seed);
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(generator=>
    window.__mythwroughtTest?.fourBiomeProfile?.()?.generator===generator,
    M6_BALANCED_GENERATOR,{timeout:45000});
  assert.equal(await page.locator('#help').isVisible(),false);
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'scene',
    'Current-generation reload lost keyboard focus after protected recovery');
  const rightGrip=await page.locator('.right').boundingBox();
  const leftGrip=await page.locator('.left').boundingBox();
  for(const id of ['#lookPad','#jump','#dig','#place','#precision']){
    const grip=id==='#precision'?leftGrip:rightGrip;
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
