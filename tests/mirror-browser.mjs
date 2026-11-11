// Gate A v0.10: REAL Chromium IndexedDB mirror + reversible WebGL pixel budget.
// Chrome mobile emulation is NOT real Safari/iPhone hardware testing.
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:2,hasTouch:true,isMobile:true,acceptDownloads:true});
const page=await context.newPage(),errors=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+' '+r.url());});
const primary='mythwrought-v002-world-179',backup=primary+'-backup-v009';
const saved=key=>page.evaluate(key=>localStorage.getItem(key),key);
const scene=()=>page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=20,null,{timeout:30000});
const fixture=(x,y,z,id)=>page.evaluate(args=>window.__mythwroughtTest.placeFixture(...args),[x,y,z,id]);
const block=(x,y,z)=>page.evaluate(args=>window.__mythwroughtTest.block(...args),[x,y,z]);
const waitMirror=fragment=>page.waitForFunction(s=>document.querySelector('#mirrorStatus').textContent.includes(s),fragment,{timeout:15000});
const inspect=seed=>page.evaluate(async seed=>{
 const {inspectMirror}=await import('./src/mirror.mjs');return inspectMirror(seed);
},seed);
const dims=()=>page.evaluate(()=>{
 const canvas=document.querySelector('#scene'),view=canvas.getBoundingClientRect();
 const left=document.querySelector('.left').getBoundingClientRect();
 const right=document.querySelector('.right').getBoundingClientRect();
 return {width:canvas.width,height:canvas.height,cssWidth:view.width,cssHeight:view.height,
  leftGap:view.left-left.right,rightGap:right.left-view.right,
  renderPreset:canvas.dataset.renderPreset,scale:canvas.dataset.renderScale};
});
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await scene();
 assert.equal((await dims()).renderPreset,'balanced');
 const initial=await dims();
 assert.ok(initial.leftGap>=-2&&initial.rightGap>=-2);
 assert.equal(initial.width,Math.floor(initial.cssWidth*1.5),'Default frame buffer changed');
 await fixture(15,18,-1,4);
 const wood=await saved(primary);
 assert.equal((await inspect(179)).exists,false,'Mirroring ran without consent');
 await page.locator('#menu').click();
 assert.equal(await page.locator('#mirrorEnabled').isChecked(),false);
 await page.locator('#renderPreset').selectOption('battery');
 await page.waitForFunction(()=>document.querySelector('#scene').dataset.renderPreset==='battery');
 const low=await dims();
 assert.ok(low.width<initial.width&&low.height<initial.height,'Battery mode did not reduce framebuffer');
 assert.equal(low.cssWidth,initial.cssWidth,'Reduced render preset changed canvas CSS viewport');
 assert.ok(low.leftGap>=-2&&low.rightGap>=-2,'Reduced framebuffer moved grip controls');
 assert.equal(await saved(primary),wood,'Rendering preference changed canonical save');

 await page.locator('#mirrorEnabled').check();
 await waitMirror('Verified device mirror for seed 179');
 let state=await inspect(179);
 assert.equal(state.current.valid,true);
 assert.equal(state.current.raw,wood);
 assert.equal(state.previous,null);
 await page.locator('#closeHelp').click();
 await fixture(15,18,-1,5);
 const crystal=await saved(primary);
 assert.notEqual(crystal,wood);
 await page.locator('#menu').click();
 await waitMirror('Verified device mirror for seed 179');
 await page.locator('#mirrorCheck').click();
 await waitMirror('previous: verified');
 state=await inspect(179);
 assert.equal(state.current.raw,crystal,'Latest mirror did not follow new canonical edit');
 assert.equal(state.previous.raw,wood,'Previous-good mirror was not retained');

 await page.locator('#mirrorSlot').selectOption('previous');
 await page.locator('#mirrorPrepare').click();
 await waitMirror('Tap the separate DOWNLOAD link');
 const downloading=page.waitForEvent('download');
 await page.locator('#mirrorDownload').click();
 const download=await downloading;
 const exported=JSON.parse(await readFile(await download.path(),'utf8'));
 assert.deepEqual(exported.edits,JSON.parse(wood).edits,'Previous copy exported incorrect world');
 assert.equal(exported.schema,1,'Mirror JSON broke schema-1');
 assert.equal(exported.checksum,undefined,'No proprietary mirror wrapper in JSON');
 await mkdir('artifacts',{recursive:true});
 await page.locator('.mirror-settings').screenshot({path:'artifacts/mythwrought-v010-save-mirror-settings.png'});
 await page.locator('#mirrorEnabled').scrollIntoViewIfNeeded();
 await page.screenshot({path:'artifacts/mythwrought-v010-save-mirror-landscape.png'});

 page.once('dialog',dialog=>dialog.dismiss());
 await page.locator('#mirrorRestore').click();
 await waitMirror('Restore cancelled');
 assert.equal(await saved(primary),crystal,'Cancelled restore changed canonical save');
 assert.equal(await block(15,18,-1),5);
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#mirrorRestore').click();
 await waitMirror('Restore verified');
 assert.equal(await block(15,18,-1),4,'Approved restore failed in world');
 assert.equal(await saved(backup),crystal,'Prior valid live save not preserved');
 assert.equal(JSON.parse(await saved(primary)).schema,1);
 await page.reload({waitUntil:'networkidle'});
 await scene();
 assert.equal(await block(15,18,-1),4,'Restored canonical save did not survive reload');
 assert.equal(await page.locator('#mirrorEnabled').isChecked(),true,'Mirror opt-in setting lost on reload');
 assert.equal(await page.locator('#renderPreset').inputValue(),'battery','Render preset not persisted');
 assert.ok((await dims()).width<(await dims()).cssWidth,'Battery preset was ignored after reload');

 // Force an acknowledged read-back sync of seed 179 before comparing its
 // bytes across a seed switch. Previously the test could snapshot an older
 // mirror while the restored seed's 400ms follow-up was still pending.
 await page.locator('#menu').click();
 await page.locator('#mirrorSync').click();
 await waitMirror('Verified mirror synced for seed 179');
 const old179=(await inspect(179)).current.raw;
 assert.equal(old179,await saved(primary),'Seed 179 mirror is not actually up-to-date');
 // Another seed must never replace seed 179's acknowledged mirror.
 await page.locator('#seedInput').fill('987');
 await page.locator('#switchWorld').click();
 await page.waitForFunction(()=>document.querySelector('#seed').textContent==='WORLD 987');
 await page.locator('#closeHelp').click();
 await fixture(15,18,-1,4);
 await page.locator('#menu').click();
 await waitMirror('Verified device mirror for seed 987');
 assert.equal((await inspect(179)).current.raw,old179,'Another seed overwrote first seed mirror');
 assert.equal((await inspect(987)).current.valid,true);

 // Corruption of a mirror copy must cause subsequent writes to refuse to
 // replace that copy; the canonical local save still succeeds independently.
 await page.evaluate(async()=>{
  const db=await new Promise((resolve,reject)=>{
   const req=indexedDB.open('mythwrought-v010-save-mirror',1);
   req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
  await new Promise((resolve,reject)=>{
   const tx=db.transaction('seeds','readwrite'),store=tx.objectStore('seeds');
   const req=store.get(987);
   req.onsuccess=()=>{const value=req.result;value.current.raw='{damaged-mirror';store.put(value);};
   tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  });
  db.close();
 });
 const damaged=(await inspect(987)).current;
 assert.equal(damaged.valid,false);
 await page.locator('#closeHelp').click();
 await fixture(15,18,-1,5);
 const healthyCanonical=await saved('mythwrought-v002-world-987');
 await page.locator('#menu').click();
 await waitMirror('MIRROR NOT VERIFIED');
 assert.equal((await inspect(987)).current.valid,false,'Corrupt mirror silently overwritten');
 assert.equal(await saved('mythwrought-v002-world-987'),healthyCanonical);
 await page.locator('#mirrorSlot').selectOption('current');
 await page.locator('#mirrorPrepare').click();
 await waitMirror('Mirror operation refused');
 assert.match(await page.locator('#mirrorStatus').textContent(),/checksum|Mirror copy rejected/);
 assert.equal(await page.locator('#mirrorDownload').isVisible(),false);
 assert.equal(await saved('mythwrought-v002-world-987'),healthyCanonical);

 // Opting out prevents future automatic mirrors while preserving both the
 // existing canonical world and the already committed mirrors.
 await page.locator('#mirrorEnabled').uncheck();
 await page.locator('#seedInput').fill('4321');
 await page.locator('#switchWorld').click();
 await page.waitForFunction(()=>document.querySelector('#seed').textContent==='WORLD 4321');
 await page.locator('#closeHelp').click();
 await fixture(15,18,-1,4);
 await page.waitForTimeout(600);
 assert.equal((await inspect(4321)).exists,false,'Mirror continued after opt-out');
 await page.locator('#menu').click();
 await page.locator('#renderPreset').selectOption('economy');
 await page.waitForFunction(()=>document.querySelector('#scene').dataset.renderPreset==='economy');
 const economy=await dims();
 assert.ok(economy.width<low.width,'Economy mode did not reduce GPU pixel work');
 assert.equal(economy.cssWidth,low.cssWidth,'Economy mode shifted viewport geometry');
 assert.ok(economy.leftGap>=-2&&economy.rightGap>=-2);

 // A completely corrupted disposable seed must remain protected. Attempting
 // to opt into mirroring here must not persist an enabled preference.
 await page.evaluate(()=>{
   localStorage.setItem('mythwrought-v002-world-765','{damaged-protected-seed');
   localStorage.setItem('mythwrought-v002-selected-seed','765');
 });
 await page.reload({waitUntil:'networkidle'});
 await scene();
 assert.match(await page.locator('#status').textContent(),/SAVE PROTECTION/);
 await page.locator('#menu').click();
 await page.locator('#mirrorEnabled').check();
 assert.equal(await page.locator('#mirrorEnabled').isChecked(),false,
   'Read-only startup wrongly enabled mirroring');
 assert.equal(await saved('mythwrought-v010-enable-mirror'),'disabled',
   'Mirror preference enabled despite protected damaged save');
 assert.equal(await saved('mythwrought-v002-world-765'),'{damaged-protected-seed',
   'Mirror opt-in damaged a protected original world');
 assert.deepEqual(errors,[],'Browser JavaScript errors');
 assert.deepEqual(missing,[],'Missing app resource');
 console.log('PASS v0.10 opt-in serialized IndexedDB mirror: unchanged default, 2 generations, export, refused/approved restore, per-seed isolation, corruption hard-stop, opt-out and reversible rendering budgets');
}finally{await browser.close();}
