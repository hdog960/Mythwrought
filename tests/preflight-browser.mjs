// v0.10 Gate A — instrumented browser evidence, not physical iPhone approval.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true});
const page=await context.newPage(),errors=[],missing=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400)missing.push(response.status()+' '+response.url());});
const primary='mythwrought-v002-world-179';
const audit=page.locator('#auditReport');
const waitForScene=()=>page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=20,null,{timeout:25000});
const saved=()=>page.evaluate(key=>localStorage.getItem(key),primary);
const probes=()=>page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('mythwrought-v010-probe')));
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await waitForScene();
  await page.waitForTimeout(500);
  const before=await saved();
  await page.locator('#menu').click();
  await page.locator('#runAudit').click();
  await page.waitForFunction(()=>document.querySelector('#auditReport').value.includes('Captured:'));
  let text=await audit.inputValue();
  assert.match(text,/Gate A diagnostic \(not certification\)/);
  assert.match(text,/left\/right grip clearance/);
  assert.match(text,/geometry PASS/);
  assert.match(text,/Foreground play frames: [1-9]/);
  assert.match(text,/Temporary storage: PASS/);
  assert.match(text,/MANUAL iPhone Safari/);
  assert.deepEqual(await probes(),[],'Diagnostic temporary storage leaked');
  assert.equal(await saved(),before,'Device diagnostic modified canonical world save');
  // Capture readable, unselected diagnostic text *before* the clipboard
  // fallback selects it. Preserve evidence of both the menu and report.
  await mkdir('artifacts',{recursive:true});
  await audit.evaluate(el=>{el.scrollTop=0;el.setSelectionRange(0,0);});
  await audit.screenshot({path:'artifacts/mythwrought-v010-audit-report.png'});
  await page.locator('#runAudit').scrollIntoViewIfNeeded();
  await page.screenshot({path:'artifacts/mythwrought-v010-audit-settings.png'});
  await page.locator('#copyAudit').click();
  await page.waitForFunction(()=>/copied|selected/.test(document.querySelector('#auditStatus').textContent),null,{timeout:8000});
  assert.match(await page.locator('#auditStatus').textContent(),/copied|selected/);

  await page.locator('#closeHelp').click();
  await page.evaluate(()=>window.__mythwroughtTest.placeFixture(15,18,-1,4));
  const edited=await saved();
  assert.notEqual(edited,before,'Test fixture did not persist');
  await page.locator('#menu').click();
  await page.locator('#runAudit').click();
  await page.waitForFunction(()=>document.querySelector('#auditReport').value.includes('Save check:'));
  text=await audit.inputValue();
  assert.match(text,/Save check: Current world matches stored edits; source=primary/);
  assert.equal(await saved(),edited,'Diagnostic silently rewrote the edited world');

  // A narrow landscape viewport must retain independent clear side grips.
  await page.setViewportSize({width:568,height:320});
  await page.locator('#runAudit').click();
  await page.waitForFunction(()=>document.querySelector('#auditReport').value.includes('568×320'));
  text=await audit.inputValue();
  assert.match(text,/geometry PASS/,'Controls intrude on compact world viewport');
  assert.deepEqual(await probes(),[]);

  // Read-only preflight must not repair a damaged primary or change journal.
  await page.evaluate(key=>localStorage.setItem(key,'{damaged-gate-a'),primary);
  const journalBefore=await page.evaluate(k=>localStorage.getItem(k),primary+'-integrity-v009');
  await page.reload({waitUntil:'networkidle'});
  await waitForScene();
  assert.equal(await saved(),'{damaged-gate-a','Startup changed damaged canonical data');
  await page.locator('#menu').click();
  await page.locator('#runAudit').click();
  await page.waitForFunction(()=>document.querySelector('#auditReport').value.includes('source=journal'));
  text=await audit.inputValue();
  assert.match(text,/source=journal/);
  assert.equal(await saved(),'{damaged-gate-a','Preflight rewrote damaged primary bytes');
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),primary+'-integrity-v009'),journalBefore);
  assert.deepEqual(await probes(),[]);
  assert.deepEqual(errors,[],'Browser errors during device check');
  assert.deepEqual(missing,[],'Missing resources during device check');
  console.log('PASS Gate A device audit: frame sample, two landscape layouts, unchanged save bytes, journal recovery, local storage probe cleanup and screenshots');
}finally{await browser.close();}
