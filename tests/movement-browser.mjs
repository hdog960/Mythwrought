// MYTHWROUGHT v0.06 - live first-person movement, jumping and edited world regression.
// Exercises the shipped browser gameplay rather than only pure isolated physics.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true});
const page=await context.newPage();
const errors=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)missing.push(r.url()+' '+r.status());});
async function position(){return page.evaluate(()=>{
  const c=document.getElementById('scene');
  return {x:Number(c.dataset.playerX),z:Number(c.dataset.playerZ),
    feet:Number(c.dataset.playerFeet),grounded:c.dataset.playerGrounded,
    touching:c.dataset.playerColliding,vy:Number(c.dataset.playerVelocityY),
    chunks:Number(c.dataset.loadedChunks)};
});}
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>{
    const d=document.querySelector('#scene')?.dataset;
    return d?.playerFeet!==undefined&&Number(d.loadedChunks)===25;
  },null,{timeout:20000});
  const origin=await position();
  assert.match(await page.title(),/v0\.09/i,'Browser title still advertises previous release');
  assert.match(await page.locator('.bezel.foot strong').textContent(),/v0\.09/i,'Footer still advertises previous release');
  assert.ok(Number.isFinite(origin.feet)&&origin.feet>0);
  assert.equal(origin.touching,'false','Player starts embedded in ground');
  // Explicitly focus the game, then observe simulation states instead of assuming
  // SwiftShader can render a fixed number of frames in 210 milliseconds.
  await page.locator('#scene').focus();
  await page.keyboard.press('Space');
  await page.waitForFunction((base)=>{
    const c=document.querySelector('#scene');
    return Number(c.dataset.playerFeet)>base+.25;
  },origin.feet,{timeout:6500});
  const airborne=await position();
  assert.ok(airborne.feet>origin.feet+.25,'Jump did not lift player');
  assert.equal(airborne.touching,'false','Jump embedded player into voxel');
  await page.waitForFunction(base=>{
    const d=document.querySelector('#scene').dataset;
    return d.playerGrounded==='true'&&Math.abs(Number(d.playerFeet)-base)<.05;
  },origin.feet,{timeout:8500});
  const landed=await position();
  assert.equal(landed.touching,'false');
  assert.equal(landed.grounded,'true');
  // Landscape keyboard movement plus corner and chunk streaming safety.
  await page.keyboard.down('w');
  await page.waitForFunction(origin=>{
    const d=document.querySelector('#scene').dataset;
    return Math.hypot(Number(d.playerX)-origin.x,Number(d.playerZ)-origin.z)>.75;
  },origin,{timeout:7500});
  await page.keyboard.up('w');
  const walking=await position();
  assert.ok(Math.hypot(walking.x-origin.x,walking.z-origin.z)>.7,'Real player never moved');
  assert.equal(walking.touching,'false','Walk embedded player in edited terrain');
  assert.ok(walking.chunks>0&&walking.chunks<=25,'Unbounded GPU chunk cache');
  await page.waitForFunction(()=>{
    const d=document.querySelector('#scene').dataset;
    return Math.hypot(Number(d.playerVelocityX),Number(d.playerVelocityZ))<.1;
  },null,{timeout:3500});
  const stopped=await position();
  await page.waitForTimeout(250);
  const atRest=await position();
  assert.ok(Math.hypot(atRest.x-stopped.x,atRest.z-stopped.z)<.035,'Released input still drifted');
  // Camera, block editing and backup regression remain functional.
  await page.locator('#menu').click();
  await page.locator('#save').click();
  assert.ok(await page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179')));
  await page.locator('#closeHelp').click();
  await mkdir('artifacts',{recursive:true});
  await page.screenshot({path:'artifacts/mythwrought-v006-walking-landscape.png'});
  assert.deepEqual(errors,[],'Browser exceptions');
  assert.deepEqual(missing,[],'Missing public assets');
  console.log('PASS v0.06 live jump, landing, horizontal walk, bounded GPU chunks and no clipping');
}finally{await browser.close();}
