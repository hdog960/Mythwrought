// Genuine original-game, no mocked media input: WebGL2 canvas -> MediaRecorder ->
// 3-second manual stop and 10-second auto-stop -> decoded playable file.
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:[
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const context=await browser.newContext({
  viewport:{width:932,height:430},deviceScaleFactor:1,hasTouch:true,isMobile:true,
  acceptDownloads:true
});
const page=await context.newPage();
const errors=[],badResponses=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',r=>{if(r.status()>=400)badResponses.push(r.status()+' '+r.url());});
const saved=()=>page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
const canvasSize=()=>page.locator('#scene').evaluate(({width,height})=>[width,height]);
function checkVideoSize(clip,canvas){
  // Encoders may preserve the odd last row/column or align a coded frame
  // down to even dimensions. Check each output against its actual canvas.
  for(const [index,pixels] of [clip.width,clip.height].entries()){
    const source=canvas[index],even=source-source%2;
    assert.ok(pixels===source||pixels===even,`Unexpected video dimension ${pixels} from canvas ${source}`);
  }
}
async function getClip(){
  await page.waitForFunction(()=>{
    const panel=document.querySelector('#capturePanel');
    return panel&&!panel.hidden&&document.querySelector('#captureSave')?.href;
  },null,{timeout:22000});
  await page.waitForFunction(()=>document.querySelector('#capturePreview')?.videoWidth>0,
    null,{timeout:12000});
  return page.evaluate(async()=>{
    const v=document.querySelector('#capturePreview');
    const a=document.querySelector('#captureSave');
    const blob=await(await fetch(a.href)).blob();
    return {bytes:blob.size,type:blob.type,name:a.download,width:v.videoWidth,
      height:v.videoHeight,duration:v.duration,controls:v.controls,
      sourceMime:document.querySelector('#capturePreview').currentSrc};
  });
}
try{
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>Number(document.querySelector('#scene')?.dataset.loadedChunks)===25,
    null,{timeout:30000});
  const available=await page.evaluate(()=>({
    media:typeof MediaRecorder==='function',
    stream:typeof document.querySelector('#scene').captureStream==='function',
    webgl:!!document.querySelector('#scene').getContext('webgl2')
  }));
  assert.deepEqual(available,{media:true,stream:true,webgl:true},
    'Real Chromium capture APIs and WebGL2 required');
  assert.equal(await page.locator('#captureToggle').getAttribute('aria-label'),
    'Record 10 seconds of gameplay');
  const beforeSave=await saved();
  const firstFrame=Number(await page.locator('#scene').getAttribute('data-rendered-frames'));
  const shortCanvas=await canvasSize();
  await page.locator('#captureToggle').click();
  await page.locator('#scene').focus();
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(3150);
  await page.keyboard.up('ArrowRight');
  await page.locator('#captureToggle').click();
  const short=await getClip();
  assert.ok(short.bytes>2048,'3-second recording has no encoded video bytes');
  assert.ok(short.width>200&&short.height>100,'3-second recording is missing actual scene pixels');
  checkVideoSize(short,shortCanvas);
  assert.ok(short.controls,'Inline video preview has no playback controls');
  assert.match(short.name,/^mythwrought-.+\.(mp4|webm)$/);
  assert.ok(Number(await page.locator('#scene').getAttribute('data-rendered-frames'))>firstFrame);
  await mkdir('artifacts/gameplay-recorder',{recursive:true});
  const shotPath='artifacts/gameplay-recorder/real-game-932x430.png';
  await page.screenshot({path:shotPath});
  const bytes=await readFile(shotPath);
  assert.ok(bytes.length>15000,'Real 3D viewport screenshot is suspiciously small');
  const sha256=createHash('sha256').update(bytes).digest('hex');
  console.log('PASS REAL 3s VIDEO',short,'frame screenshot SHA256',sha256);
  await page.locator('#captureClose').click();
  assert.ok(await page.locator('#capturePanel').isHidden());
  const fullCanvas=await canvasSize();
  assert.deepEqual(fullCanvas,shortCanvas,'Canvas dimensions changed between recordings');
  await page.locator('#captureToggle').click();
  await page.locator('#scene').focus();
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(2000);
  await page.keyboard.up('ArrowRight');
  const full=await getClip(); // natural ten-second stop; do not simulate timer
  assert.ok(full.bytes>2048,'10-second recording has no encoded video bytes');
  assert.ok(full.width>200&&full.height>100);
  checkVideoSize(full,fullCanvas);
  const play=await page.evaluate(async()=>{
    const v=document.querySelector('#capturePreview');
    v.muted=true;v.currentTime=0;
    try{await v.play();}catch(error){return {started:false,error:String(error)};}
    const c=document.createElement('canvas');c.width=16;c.height=16;
    const ctx=c.getContext('2d',{willReadFrequently:true});
    const sums=[];
    for(let i=0;i<3;i++){
      await new Promise(resolve=>setTimeout(resolve,375));
      ctx.drawImage(v,0,0,16,16);
      const arr=ctx.getImageData(0,0,16,16).data;
      let sum=0;
      for(let j=0;j<arr.length;j+=4)sum+=arr[j]+arr[j+1]+arr[j+2];
      sums.push(sum);
    }
    v.pause();return {started:true,sums};
  });
  assert.ok(play.started,'Recorded video would not play: '+play.error);
  assert.ok(play.sums.some(x=>x>20000),'Recorded image is black or empty');
  assert.ok(new Set(play.sums).size>1,'Recorded image appears frozen, not moving gameplay');
  assert.equal(await saved(),beforeSave,'Recorder modified the canonical world save');
  const glError=await page.evaluate(()=>document.querySelector('#scene').getContext('webgl2').getError());
  assert.equal(glError,0,'WebGL error after recording');
  assert.deepEqual(errors,[],'Game threw errors while recording');
  assert.deepEqual(badResponses,[],'Missing assets during recording');
  console.log('PASS REAL 10s VIDEO',full,'decoded moving frames',play.sums,'no save changes/GL errors');
}finally{
  await browser.close();
}
