// Gate A optional IndexedDB vault: actual Chromium WebGL and storage transactions.
// No hardware/art/offline certification and no migration of canonical schema-1 keys.
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true,acceptDownloads:true});
const page=await context.newPage(),errors=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+' '+r.url());});
const primary='mythwrought-v002-world-179';
const keyBackup=primary+'-backup-v009';
const get=k=>page.evaluate(k=>localStorage.getItem(k),k);
const block=(x,y,z)=>page.evaluate(v=>window.__mythwroughtTest.block(...v),[x,y,z]);
const seen=async(fragment)=>page.waitForFunction(fragment=>document.querySelector('#vaultStatus').textContent.includes(fragment),fragment,{timeout:12000});
const scene=async()=>page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=18,null,{timeout:25000});
const firstOption=()=>page.locator('#vaultSelect option:not([value=""])').first().getAttribute('value');
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await scene();
 await page.evaluate(()=>window.__mythwroughtTest.placeFixture(15,18,-1,4));
 const woodBytes=await get(primary);
 assert.ok(woodBytes?.includes('"schema":1'));
 const unchangedJournal=await get(primary+'-integrity-v009');

 await page.locator('#menu').click();
 await page.locator('#vaultBackup').click();
 await seen('Verified device backup');
 const firstId=await firstOption();
 assert.match(firstId,/^v010:/);
 assert.equal(await get(primary),woodBytes,'IndexedDB snapshot touched canonical localStorage');
 assert.equal(await get(primary+'-integrity-v009'),unchangedJournal,'Vault changed journal');
 assert.equal(await page.locator('#vaultSelect option:not([value=""])').count(),1);
 await page.locator('#vaultPrepare').click();
 await seen('Tap DOWNLOAD VERIFIED');
 assert.equal(await page.locator('#vaultDownloadLink').isVisible(),true,'No iPhone-friendly explicit download link');
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#vaultDownloadLink').click();
 const download=await downloadPromise;
 assert.match(download.suggestedFilename(),/mythwrought-vault-seed-179/);
 const exported=JSON.parse(await readFile(await download.path(),'utf8'));
 assert.equal(exported.schema,1);
 assert.deepEqual(exported.edits,JSON.parse(woodBytes).edits);
 assert.equal(exported.checksum,undefined,'Export must not wrap original schema-1');

 await mkdir('artifacts',{recursive:true});
 await page.locator('.vault-settings').scrollIntoViewIfNeeded();
 await page.screenshot({path:'artifacts/mythwrought-v010-vault-settings.png'});
 await page.locator('.vault-settings').screenshot({path:'artifacts/mythwrought-v010-vault-detail.png'});

 await page.locator('#closeHelp').click();
 await page.evaluate(()=>window.__mythwroughtTest.placeFixture(15,18,-1,5));
 const crystalBytes=await get(primary);
 assert.notEqual(crystalBytes,woodBytes);
 await page.locator('#menu').click();
 await page.locator('#vaultBackup').click();
 await seen('Verified device backup');
 assert.equal(await page.locator('#vaultSelect option:not([value=""])').count(),2,'Second snapshot should not replace first');
 await page.locator('#vaultSelect').selectOption(firstId);

 // A declined restore may not touch live world, journal or either vault record.
 page.once('dialog',d=>d.dismiss());
 await page.locator('#vaultRestore').click();
 await seen('Restore cancelled');
 assert.equal(await get(primary),crystalBytes);
 assert.equal(await block(15,18,-1),5);

 // Explicit consent restores the older wood snapshot, preserving crystal in
 // the original v0.09 previous-good backup and allowing normal reload.
 page.once('dialog',d=>d.accept());
 await page.locator('#vaultRestore').click();
 await seen('Restore complete');
 assert.equal(await block(15,18,-1),4);
 assert.equal(await get(keyBackup),crystalBytes,'Previous live edits were not archived');
 assert.equal(JSON.parse(await get(primary)).schema,1);
 await page.reload({waitUntil:'networkidle'});
 await scene();
 assert.equal(await block(15,18,-1),4,'Restored snapshot did not survive reload');
 await page.locator('#menu').click();
 await page.locator('#vaultRefresh').click();
 await seen('device backups found');
 assert.equal(await page.locator('#vaultSelect option:not([value=""])').count(),2,'IndexedDB backups lost on page reload');

 // Corrupt an IndexedDB *test snapshot*, never the live world. Verify the
 // checksum stops download/restore and leaves localStorage untouched.
 const canonicalAfter=await get(primary);
 await page.evaluate(async id=>{
  const db=await new Promise((resolve,reject)=>{
   const q=indexedDB.open('mythwrought-v010-optional-vault',1);
   q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);
  });
  await new Promise((resolve,reject)=>{
   const tx=db.transaction('snapshots','readwrite');
   const store=tx.objectStore('snapshots');
   const q=store.get(id);
   q.onsuccess=()=>{const record=q.result;record.raw='not-json';store.put(record);};
   tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);tx.onerror=()=>reject(tx.error);
  });
  db.close();
 },firstId);
 await page.locator('#vaultSelect').selectOption(firstId);
 await page.locator('#vaultPrepare').click();
 await seen('checksum mismatch');
 assert.equal(await page.locator('#vaultDownloadLink').isVisible(),false,'Corrupt backup was offered for download');
 assert.equal(await get(primary),canonicalAfter,'Corrupt vault item changed live world');
 page.once('dialog',d=>d.accept());
 await page.locator('#vaultDelete').click();
 await seen('snapshot deleted and verified');
 assert.equal(await page.locator('#vaultSelect option:not([value=""])').count(),1,'Targeted deletion did not preserve other snapshot');
 assert.equal(await get(primary),canonicalAfter,'Deleting vault item changed canonical world');

 // A separate seed gets its own vault snapshot; the original seed's backup
 // and canonical saved deltas remain independently recoverable.
 await page.locator('#seedInput').fill('987');
 await page.locator('#switchWorld').click();
 await page.waitForFunction(()=>document.querySelector('#seed').textContent==='WORLD 987',null,{timeout:8000});
 await page.locator('#vaultBackup').click();
 await seen('Verified device backup for seed 987');
 assert.equal(await page.locator('#vaultSelect option:not([value=""])').count(),2);
 const options=await page.locator('#vaultSelect option:not([value=""])').allTextContents();
 assert.ok(options.some(s=>s.includes('Seed 179')),'Original seed backup vanished after switching');
 assert.ok(options.some(s=>s.includes('Seed 987')),'New seed not archived independently');
 assert.equal(await get(primary),canonicalAfter,'Switching and vaulting another seed changed the old one');
 assert.deepEqual(errors,[],'Browser JavaScript errors');
 assert.deepEqual(missing,[],'Missing HTTP resources');
 console.log('PASS optional IndexedDB vault: separate verified snapshots, independent downloadable schema-1 exports, explicit restore consent, prior-live save backup, reload, corruption rejection, selective deletion, original grips and no resource errors');
}finally{await browser.close();}
