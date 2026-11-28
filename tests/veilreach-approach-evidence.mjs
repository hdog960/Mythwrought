import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {chromium} from 'playwright';

const origin=process.env.VEILREACH_ORIGIN??'http://127.0.0.1:4211/';
const out=process.env.VEILREACH_EVIDENCE??'artifacts/veilreach-approach';
const revision=process.env.VEILREACH_SOURCE;
assert.match(revision??'',/^[a-f0-9]{40}$/);
const recordVideo=process.env.VEILREACH_EVIDENCE_NO_VIDEO!=='1';
const viewport={width:844,height:390};
await mkdir(out,{recursive:true});
const browser=await chromium.launch({args:['--enable-webgl','--use-gl=angle',
  '--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport,hasTouch:true,isMobile:true,deviceScaleFactor:1,
  ...(recordVideo?{recordVideo:{dir:out,size:viewport}}:{})});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const wait=(fn,arg)=>page.waitForFunction(fn,arg,{polling:100,timeout:180000});
const pose=()=>page.evaluate(()=>window.__mythwroughtTest.flightInfo());
const aim=(x,y,z)=>page.evaluate(args=>window.__mythwroughtTest.aimAt(...args),[x,y,z]);
const hold=async(key,fn,arg)=>{
  await page.keyboard.down(key);
  try{await wait(fn,arg);}finally{await page.keyboard.up(key);}
};
const report={revision,viewport,seed:180,engine:'Chromium SwiftShader',recordVideo,errors};
try{
  await page.addInitScript(()=>{
    const random=crypto.getRandomValues.bind(crypto);
    crypto.getRandomValues=a=>{
      if(a instanceof Int32Array&&a.length===1){a[0]=180;return a;}
      return random(a);
    };
    window.approachFrames=[];
    window.approachSegment='cold';
    let last='',prior=0;
    function track(now){
      const d=document.querySelector('#scene')?.dataset;
      if(d?.renderedFrames&&d.renderedFrames!==last&&window.approachFrames.length<20000){
        window.approachFrames.push({
          t:now,dt:prior?now-prior:null,segment:window.approachSegment,
          x:+d.playerX,y:+d.playerFeet,z:+d.playerZ,far:+d.veilreachDistanceVertices,
          upper:+d.upperGpuOwners,upperBytes:+d.upperGpuBytes,queued:+d.pendingChunks,
          atlas:d.veilreachAtlas?JSON.parse(d.veilreachAtlas):null
        });
        last=d.renderedFrames;
        prior=now;
      }
      requestAnimationFrame(track);
    }
    requestAnimationFrame(track);
  });
  await page.goto(new URL('?production-ui=1',origin).href,{waitUntil:'domcontentloaded'});
  await wait(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)>=18&&
    Number(document.querySelector('#scene')?.dataset.veilreachDistanceVertices)>0);
  await page.locator('#menu').click();
  await page.locator('#skySetDay').click();
  await page.locator('#closeHelp').click();
  await page.locator('#g2bFlightEnable').check();
  const cdp=await context.newCDPSession(page);
  const doubleTap=async()=>{
    const b=await page.locator('#jump').boundingBox(),t=Date.now()/1000;
    for(let i=0;i<2;i++){
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',
        touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2,id:i+1}],timestamp:t+i*.3});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[],timestamp:t+i*.3+.075});
    }
  };
  const tag=segment=>page.evaluate(segment=>{window.approachSegment=segment;},segment);
  await tag('ascent');
  await aim(57,99,39);
  await doubleTap();
  await wait(()=>window.__mythwroughtTest.flightInfo().active);
  await page.locator('#scene').focus();
  await hold('e',y=>window.__mythwroughtTest.flightInfo().position.y>=y,127);
  await tag('approach');
  await aim(57,116,39);
  await hold('w',()=>{
    const p=window.__mythwroughtTest.flightInfo().position;
    return Math.hypot(p.x-57.5,p.z-39.5)<.72;
  });
  report.approach=await pose();
  await tag('landing');
  await doubleTap();
  await wait(()=>!window.__mythwroughtTest.flightInfo().active&&window.__mythwroughtTest.m5ObservedPose().onGround);
  report.landed=await pose();
  assert.ok(report.landed.position.y>100);
  await page.locator('#scene').focus();
  await tag('walk');
  await aim(62,118,40);
  await hold('w',p=>{
    const n=window.__mythwroughtTest.flightInfo().position;
    return Math.hypot(p.x-n.x,p.z-n.z)>.65;
  },report.landed.position);
  report.walked=await pose();
  assert.deepEqual(errors,[]);
  report.pass=true;
}finally{
  report.trace=await page.evaluate(()=>window.approachFrames).catch(()=>[]);
  const times=report.trace.filter(f=>f.segment==='approach'&&f.dt!==null).map(f=>f.dt).sort((a,b)=>a-b);
  const percentile=p=>times[Math.max(0,Math.ceil(p*times.length)-1)]??null;
  report.approachFrameMs={median:percentile(.5),p95:percentile(.95),p99:percentile(.99)};
  await writeFile(join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
  const clip=page.video();
  await context.close();
  if(clip)await clip.saveAs(join(out,'approach.webm'));
  await browser.close();
}
