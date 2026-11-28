import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const out='artifacts/minimap-flight';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:956,height:440},hasTouch:true,isMobile:true,deviceScaleFactor:1,serviceWorkers:'block'});
const page=await context.newPage(),errors=[];
const report={head:process.env.GITHUB_SHA??null,seed:-652801853,stages:[],errors};
page.on('pageerror',e=>errors.push(e.message));
const snapshot=()=>page.evaluate(()=>{
 const t=window.__mythwroughtTest,m=document.querySelector('#miniMap');
 return {flight:t.flightInfo(),pose:t.m5ObservedPose(),chunks:t.snapshot().chunks,
  discovered:Number(m.dataset.discovered),sourceReads:Number(m.dataset.surveySourceReads||0),surveyKind:m.dataset.surveyKind,surveyMs:Number(m.dataset.surveyMs||0),surveyY:Number(m.dataset.surveyY),
  saved:JSON.parse(localStorage.getItem('mythwrought-exploration-v1-'+m.dataset.seed)||'{"cells":[]}').cells,
  observed:JSON.parse(localStorage.getItem('mythwrought-navigation00-observations-v1-'+m.dataset.seed)||'{"tiles":[]}').tiles};
});
async function holdUntil(key,predicate,arg){
 await page.keyboard.down(key);
 try{await page.waitForFunction(predicate,arg,{timeout:150000,polling:100});}
 finally{await page.keyboard.up(key);}
}
try{
 await page.addInitScript(()=>{const old=crypto.getRandomValues.bind(crypto);crypto.getRandomValues=a=>{if(a instanceof Int32Array&&a.length===1){a[0]=-652801853;return a;}return old(a);};});
 await page.goto('http://127.0.0.1:4173/?production-ui=1',{waitUntil:'domcontentloaded',timeout:120000});
 await page.waitForFunction(()=>window.__mythwroughtTest&&Number(document.querySelector('#scene')?.dataset.loadedChunks)>=18,null,{timeout:120000});
 report.startup=await snapshot();assert.equal(report.startup.pose.seed,report.seed);
 await page.waitForFunction(()=>Number(document.querySelector('#miniMap')?.dataset.discovered)>0,null,{timeout:30000});
 report.ground=await snapshot();await page.screenshot({path:out+'/ground.png'});
 await page.locator('#g2bFlightEnable').check();
 if(await page.locator('#closeHelp').isVisible())await page.locator('#closeHelp').click();
 await page.locator('#jump').tap();await page.locator('#jump').tap();
 await page.waitForFunction(()=>window.__mythwroughtTest.flightInfo().active,null,{timeout:30000});
 await page.evaluate(()=>window.__mythwroughtTest.setOrientation(0,0));
 let demonstratedEviction=false;
 for(const target of [21,100,200,254]){
  await holdUntil('e',y=>window.__mythwroughtTest.flightInfo().position.y>=y,target);
  const before=await snapshot();
  assert.ok(before.flight.active&&before.flight.position.y>=target);
  await holdUntil('w',({x,z,n})=>{
   const p=window.__mythwroughtTest.flightInfo().position;
   return Math.hypot(p.x-x,p.z-z)>=40&&Number(document.querySelector('#miniMap').dataset.discovered)>n;
  },{x:before.pose.x,z:before.pose.z,n:before.discovered});
  const after=await snapshot();
  assert.ok(after.discovered>before.discovered,'discovery did not grow at Y'+target);
  assert.ok(after.sourceReads<=96,'nonresident survey exceeded source budget');
  assert.ok(after.flight.residentChunks<=25,'minimap must not expand GPU owners');
  const cx=Math.floor(after.pose.x/16),cz=Math.floor(after.pose.z/16);
  const centerGround=after.chunks.includes(cx+','+cz);
  if(target>=100&&!centerGround&&after.sourceReads>0)demonstratedEviction=true;
  await page.locator('#miniMapButton').tap();
  const flushed=await snapshot();
  const old=new Set(before.saved);
  const fresh=flushed.saved.filter(k=>!old.has(k));
  assert.ok(fresh.length>0,'no persisted new cells at Y'+target);
  const hereX=Math.floor(after.pose.x/4),hereZ=Math.floor(after.pose.z/4);
  assert.ok(fresh.some(k=>{const [x,z]=k.split(',').map(Number);return Math.hypot(x-hereX,z-hereZ)<=8;}),'no local flight discovery at Y'+target);
  assert.ok(flushed.observed.some(t=>fresh.includes(t[0]+','+t[1])),'new fog has no actual observed terrain colors');
  await page.screenshot({path:out+'/y'+target+'-map.png'});
  await page.locator('#closeExploration').tap();
  const frame=await page.evaluate(async()=>{
   const ms=[];let last=performance.now();
   for(let i=0;i<40;i++)await new Promise(resolve=>requestAnimationFrame(now=>{ms.push(now-last);last=now;resolve();}));
   const s=ms.slice(1).sort((a,b)=>a-b);
   return {p50:s[Math.floor(s.length*.5)],p95:s[Math.floor(s.length*.95)]};
  });
  report.stages.push({target,position:after.flight.position,before:before.discovered,after:after.discovered,sourceReads:after.sourceReads,surveyMs:after.surveyMs,surveyKind:after.surveyKind,centerGround,owners:after.flight.residentChunks,frame});
  console.log('MINIMAP_FLIGHT',JSON.stringify(report.stages.at(-1)));
 }
 assert.ok(demonstratedEviction,'no high-altitude nonresident source survey exercised');
 const rotation=await page.evaluate(async()=>{
  const canvas=document.querySelector('#miniMap'),before=canvas.toDataURL(),start=performance.now();
  const t=window.__mythwroughtTest;t.setOrientation(t.m5ObservedPose().yaw+Math.PI/2,0);
  return await new Promise(resolve=>{
   function check(now){if(canvas.toDataURL()!==before)return resolve(now-start);
    if(now-start>2000)return resolve(null);requestAnimationFrame(check);}
   requestAnimationFrame(check);
  });
 });
 assert.notEqual(rotation,null,'heading repaint failed');report.headingRepaintMs=rotation;
 await page.locator('#miniMapButton').tap();const beforeReload=await snapshot();
 await page.locator('#closeExploration').tap();
 await page.reload({waitUntil:'domcontentloaded',timeout:120000});
 await page.waitForFunction(n=>Number(document.querySelector('#miniMap')?.dataset.discovered)>=n,beforeReload.saved.length,{timeout:120000});
 const afterReload=await snapshot();const saved=new Set(afterReload.saved);
 assert.ok(beforeReload.saved.every(k=>saved.has(k)),'flight discovery lost on reload');
 assert.deepEqual(errors,[]);report.persisted=beforeReload.saved.length;report.pass=true;
}finally{
 report.lastState=await snapshot().catch(e=>({error:String(e)}));
 console.log('MINIMAP_FINAL_STATE',JSON.stringify(report.lastState).slice(0,10000));
 await writeFile(out+'/report.json',JSON.stringify(report,null,2));
 await page.screenshot({path:out+'/last.png'}).catch(()=>{});
 await context.close();await browser.close();
}
