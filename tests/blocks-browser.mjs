// Mythwrought v0.08 — player-facing block actions, safe previews and persistent edits.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},hasTouch:true,isMobile:true,deviceScaleFactor:1});
const page=await context.newPage(),errors=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)missing.push(r.url()+' '+r.status());});
const snapshot=()=>page.evaluate(()=>{
  const c=document.querySelector('#scene');
  return {hit:c.dataset.targetBlock,place:c.dataset.targetPlace,
    canPlace:c.dataset.canPlace,meshEdits:Number(c.dataset.meshEditBatches),
    hint:document.querySelector('#targetInfo').textContent,
    status:document.querySelector('#status').textContent};
});
const aim=async(x,y,z)=>page.evaluate(({x,y,z})=>window.__mythwroughtTest.aimAt(x,y,z),{x,y,z});
const waitHit=async(key)=>page.waitForFunction(key=>document.querySelector('#scene')?.dataset.targetBlock===key,key,{timeout:9000});
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,null,{timeout:20000});
  assert.match(await page.title(),/v0\.09/);
  await page.evaluate(()=>{
    const dev=window.__mythwroughtTest;
    dev.placeFixture(14,13,0,3);
    dev.placeFixture(16,18,0,3);
    dev.placeFixture(17,18,0,3);
    dev.teleport(14.5,.5);
    dev.aimAt(16,18,0);
  });
  await waitHit('16,18,0');
  const first=await snapshot();
  assert.equal(first.canPlace,'true','Build preview is missing at safe adjacent position');
  assert.ok(first.place.length>0,'Valid gold placement cell missing');
  assert.match(first.hint,/STONE/,'Right grip lacks current target material');
  assert.match(first.hint,/BUILD SPACE/,'Right grip does not explain valid placement');
  const viewport=await page.locator('#scene').boundingBox();
  const hint=await page.locator('#targetInfo').boundingBox();
  assert.ok(hint.x>=viewport.x+viewport.width,'Target hint overlaps main world view');

  await page.locator('#dig').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),0,'Mining did not remove selected voxel');
  assert.match(await page.locator('#status').textContent(),/Removed stone · saved/);
  const mined=await page.evaluate(()=>window.__mythwroughtTest.snapshot());
  assert.ok(mined.editMeshBatches>first.meshEdits,'Mining did not rebuild loaded seam');
  await aim(17,18,0);
  await waitHit('17,18,0');
  await page.locator('[data-block="4"]').click();
  assert.equal(await page.locator('[data-block="4"]').getAttribute('aria-pressed'),'true');
  await page.locator('#place').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),4,'Wood placement failed at seam');
  assert.match(await page.locator('#status').textContent(),/Placed timber · saved/);
  const save=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
  assert.ok(save?.includes('[16,18,0,4]'),'Wood material or edit delta not saved');

  // Mine the restored wood then place crystal: right grip selection changes
  // material, not horizontal thumb orientation or camera axis.
  await aim(16,18,0);
  await waitHit('16,18,0');
  await page.locator('#dig').click();
  await aim(17,18,0);
  await waitHit('17,18,0');
  await page.locator('[data-block="5"]').click();
  await page.locator('#place').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),5);
  assert.match(await page.locator('#status').textContent(),/Placed crystal · saved/);

  // Real player-body rejection: the placement candidate lies inside the
  // player's AABB, even though the adjacent voxel is empty.
  await page.evaluate(()=>{
    const dev=window.__mythwroughtTest;
    dev.placeFixture(14,15,1,3);
    dev.teleport(14.5,.5);
    dev.aimAt(14,15,1);
  });
  await waitHit('14,15,1');
  await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.canPlace==='false');
  const occupied=await snapshot();
  assert.match(occupied.hint,/PLACE BLOCKED/);
  const saveBefore=await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
  await page.locator('#place').click();
  assert.match(await page.locator('#status').textContent(),/Cannot place inside the player/);
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),saveBefore,'Rejected placement altered save');

  // Out of reach does nothing; display hints don't cover the viewport.
  await page.evaluate(()=>window.__mythwroughtTest.setOrientation(0,1.2));
  await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.targetBlock==='');
  const noTarget=await snapshot();
  assert.equal(noTarget.hint,'LOOK AT A BLOCK');
  await page.locator('#dig').click();
  assert.match(await page.locator('#status').textContent(),/Look at a nearby block/);
  assert.equal(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')),saveBefore);

  await mkdir('artifacts',{recursive:true});
  await page.evaluate(()=>window.__mythwroughtTest.aimAt(16,18,0));
  await waitHit('16,18,0');
  await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Target found'));
  assert.match(await page.locator('#status').textContent(),/Target found/,'Old invalid-target warning remained after successful re-aim');
  await page.screenshot({path:'artifacts/mythwrought-v008-crystal-target.png'});
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>0);
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),5,'Crystal seam edit vanished on reload');

  // Real WebGL2/browser acceptance for the automation biome130 block registry:
  // choose a physical non-cube from the settings sheet, rotate it, place it,
  // save it, render it, then reload and target it again on the actual canvas.
  await page.locator('#menu').click();
  assert.ok(await page.locator('#biome130Select').isVisible(),'57+ new materials missing from iPhone settings');
  await page.locator('#biome130Select').selectOption('315'); // 060 geothermal mountain rock
  await page.locator('#biome130Rotation').selectOption('1'); // East
  await page.locator('#closeHelp').click();
  await page.evaluate(()=>{const dev=window.__mythwroughtTest;dev.teleport(14.5,.5);dev.aimAt(16,18,0);});
  await waitHit('16,18,0');
  await page.locator('#dig').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),0);
  await page.evaluate(()=>window.__mythwroughtTest.aimAt(17,18,0));
  await waitHit('17,18,0');
  await page.locator('#place').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),315,
    'Biome130 block not physically placed through the regular iPhone action');
  const biomeSaved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mythwrought-v002-world-179')));
  assert.ok(biomeSaved.edits.some(e=>e.join(',')==='16,18,0,315'),'High-ID voxel not persisted');
  assert.ok(biomeSaved.rotations?.some(e=>e.join(',')==='16,18,0,1'),'Rotation not persisted');
  await page.evaluate(()=>window.__mythwroughtTest.aimAt(16,18,0));
  await waitHit('16,18,0');
  await page.waitForTimeout(300);
  await page.screenshot({path:'artifacts/mythwrought-biome130-geothermal-physical-in-game.png'});
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>0);
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),315,
    'Biome130 block disappeared from world across browser reload');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mythwrought-v002-world-179')).rotations
    .find(e=>e[0]===16&&e[1]===18&&e[2]===0)?.[3]),1,'Rotated voxel orientation lost on reload');

  // 013: new ancient-ruin fragment selected through the real settings palette,
  // physically placed and restored after browser reload with its orientation.
  await page.locator('#menu').click();
  await page.locator('#biome130Select').selectOption('325');
  await page.locator('#biome130Rotation').selectOption('2');
  await page.locator('#closeHelp').click();
  await page.evaluate(()=>{const dev=window.__mythwroughtTest;dev.teleport(14.5,.5);dev.aimAt(16,18,0);});
  await waitHit('16,18,0');
  await page.locator('#dig').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),0);
  await page.evaluate(()=>window.__mythwroughtTest.aimAt(17,18,0));
  await waitHit('17,18,0');
  await page.locator('#place').click();
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),325,
    'Ancient ruin block not physically placed through real UI');
  const ruinSaved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mythwrought-v002-world-179')));
  assert.ok(ruinSaved.edits.some(e=>e.join(',')==='16,18,0,325'));
  assert.ok(ruinSaved.rotations.some(e=>e.join(',')==='16,18,0,2'));
  await page.screenshot({path:'artifacts/mythwrought-013-ancient-ruin-physical.png'});
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>0);
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.block(16,18,0)),325);
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,null,{timeout:20000});
  assert.equal(await page.evaluate(()=>window.__mythwroughtTest.snapshot().chunks.length),25);
  assert.deepEqual(errors,[],'Browser exceptions during block interaction');
  assert.deepEqual(missing,[],'Missing game resources');
  console.log('PASS v0.08 material selection, mine/place, no-target/player-body rejects, grip hint and save/reload');
}finally{await browser.close();}
