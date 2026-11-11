// MYTHWROUGHT v0.09: real browser recovery and non-destructive save flows.
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true,acceptDownloads:true});
const page=await context.newPage(),errors=[],missing=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400)missing.push(response.status()+' '+response.url());});
const primary='mythwrought-v002-world-179';
const journal=primary+'-integrity-v009',backup=primary+'-backup-v009',damaged=primary+'-damaged-v009';
const scene=async()=>page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=20,null,{timeout:25000});
const get=async k=>page.evaluate(k=>localStorage.getItem(k),k);
const block=async(x,y,z)=>page.evaluate(([x,y,z])=>window.__mythwroughtTest.block(x,y,z),[x,y,z]);
const inputFile=(data)=>({name:'verified-backup.json',mimeType:'application/json',buffer:Buffer.from(data)});
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await scene();
  assert.match(await page.title(),/v0\.09/);
  await page.evaluate(()=>{
    const dev=window.__mythwroughtTest;
    dev.placeFixture(15,18,-1,4);
    dev.placeFixture(16,18,0,5);
  });
  assert.equal(await block(15,18,-1),4);
  assert.equal(await block(16,18,0),5);
  const original=await get(primary);
  assert.equal(JSON.parse(original).schema,1,'Old world slot must retain original schema');
  assert.ok(await get(journal),'Missing verified journal');
  assert.ok(await get(backup),'Missing previous-good backup');
  const originalDelta=JSON.parse(original).edits;
  assert.ok(originalDelta.some(r=>r[0]===-16 || r[0]===15),'Expected signed chunk boundary deltas');
  await page.reload({waitUntil:'networkidle'});
  await scene();
  assert.equal(await block(16,18,0),5,'Cross-chunk crystal edit was lost on reload');
  assert.equal(await block(15,18,-1),4,'Cross-chunk wood edit was lost on reload');

  // Corrupt the main old-format key. The journal should recover without
  // replacing or erasing those original damaged bytes automatically.
  await page.evaluate(k=>localStorage.setItem(k,'{damaged-primary-v009'),primary);
  await page.reload({waitUntil:'networkidle'});
  await scene();
  assert.equal(await block(16,18,0),5,'Checksum journal did not recover world');
  assert.equal(await get(primary),'{damaged-primary-v009','Damaged save silently overwritten on startup');
  assert.match(await page.locator('#status').textContent(),/Recovered from verified edit journal/);
  await page.locator('#menu').click();
  await page.locator('#save').click();
  assert.match(await page.locator('#status').textContent(),/verified and saved/);
  assert.equal(await get(damaged),'{damaged-primary-v009','Damaged bytes not preserved during user save repair');
  assert.deepEqual(JSON.parse(await get(primary)).edits,originalDelta);

  // Exports retain the ORIGINAL schema-1 format, without journal metadata.
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#export').click();
  const download=await downloadPromise;
  assert.match(download.suggestedFilename(),/mythwrought-seed-179/);
  const exported=JSON.parse(await readFile(await download.path(),'utf8'));
  assert.equal(exported.schema,1);
  assert.deepEqual(exported.edits,JSON.parse(await get(primary)).edits);
  assert.equal(exported.checksum,undefined);

  // Malformed imported files must not change the active world or any saved slot.
  const safe=await get(primary);
  await page.locator('#importFile').setInputFiles(inputFile('{"schema":1,"seed":179,"edits":[[16,18,0,5],[16,18,0,4]]}'));
  await page.waitForFunction(()=>document.querySelector('#status').textContent.startsWith('Import rejected'));
  assert.equal(await get(primary),safe,'Malformed import changed canonical world');

  // Conflicting valid imported edits require explicit confirmation. Test both
  // dismiss and accept, preserving the old world in a verified previous-good slot.
  const imported=JSON.parse(safe),row=imported.edits.find(r=>r[0]===16&&r[1]===18&&r[2]===0);
  assert.ok(row,'Missing seam edit');
  row[3]=4; // Replace crystal with timber in the imported saved world.
  const fixture=inputFile(JSON.stringify(imported));
  page.once('dialog',dialog=>dialog.dismiss());
  await page.locator('#importFile').setInputFiles(fixture);
  await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Import cancelled'));
  assert.equal(await get(primary),safe,'Dismissed import altered original save');
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#importFile').setInputFiles(fixture);
  await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Imported world safely'));
  assert.equal(await block(16,18,0),4,'Accepted import did not restore expected material');
  assert.equal(await get(backup),safe,'Import did not archive previous valid world');
  await page.reload({waitUntil:'networkidle'});
  await scene();
  assert.equal(await block(16,18,0),4,'Accepted imported world did not survive reload');

  // A world failing all checksum/backup checks must stay protected read-only.
  await page.evaluate(()=>{
    localStorage.setItem('mythwrought-v002-world-987','corrupted-987-world');
    localStorage.setItem('mythwrought-v002-selected-seed','987');
  });
  await page.reload({waitUntil:'networkidle'});
  await scene();
  assert.match(await page.locator('#status').textContent(),/SAVE PROTECTION/);
  await page.locator('#menu').click();
  await page.locator('#save').click();
  assert.match(await page.locator('#status').textContent(),/SAVE PROTECTION ACTIVE/);
  assert.equal(await get('mythwrought-v002-world-987'),'corrupted-987-world','Damaged seed was overwritten');
  await page.locator('#seedInput').fill('179');
  await page.locator('#switchWorld').click();
  assert.equal(await page.locator('#seed').textContent(),'WORLD 179','Could not leave protected world');
  assert.equal(await get('mythwrought-v002-world-987'),'corrupted-987-world','Switch erased damaged seed');
  await page.locator('#closeHelp').click();
  await page.evaluate(()=>{
    window.__mythwroughtTest.teleport(14.5,.5);
    window.__mythwroughtTest.aimAt(16,18,0);
  });
  await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.targetBlock==='16,18,0',null,{timeout:12000});
  await mkdir('artifacts',{recursive:true});
  await page.screenshot({path:'artifacts/mythwrought-v009-persistent-edits.png'});
  assert.deepEqual(errors,[],'Browser errors during save/recovery tests');
  assert.deepEqual(missing,[],'Missing network resources');
  console.log('PASS v0.09 verified journal recovery, damaged preservation, schema-1 export, non-destructive import and seed protection');
}finally{await browser.close();}
