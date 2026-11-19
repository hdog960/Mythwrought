// Genuine original-game, no mocked media input: WebGL2 canvas -> MediaRecorder ->
// 3-second manual stop and 10-second auto-stop -> decoded playable file.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {spawnSync,execFileSync} from 'node:child_process';
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
const OUT='artifacts/gameplay-recorder';
const sourceHead=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const sha256Of=raw=>createHash('sha256').update(raw).digest('hex');
const report={
  kind:'MYTHWROUGHT_ACTUAL_ORIGINAL_GAME_REC_3_AND_10_SECONDS',
  sourceHead,browser:'real Chromium WebGL2 MediaRecorder',
  physicalIphone:false,productionDeployed:false,
  canonicalSchema1SavePreserved:false,
  clips:[],errors:[],status:'INCOMPLETE'
};
const errors=[],badResponses=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',r=>{if(r.status()>=400)badResponses.push(r.status()+' '+r.url());});
const saved=()=>page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
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
async function preserveVerifiedClip(label,metadata){
  assert.ok(['three','ten'].includes(label));
  assert.match(metadata.name,/\.((mp4)|(webm))$/);
  const format=metadata.name.endsWith('.mp4')?'mp4':'webm';
  const target=OUT+'/real-original-game-'+label+'-second.'+format;
  const [download]=await Promise.all([
    page.waitForEvent('download',{timeout:15000}),
    page.locator('#captureSave').click()
  ]);
  await download.saveAs(target);
  const encoded=await readFile(target);
  assert.equal(encoded.byteLength,metadata.bytes,
    'Downloaded genuine recorder output differs from original in-memory Blob');
  assert.ok(encoded.length>2048,'Actual encoded clip is empty');
  if(format==='mp4')
    assert.equal(encoded.toString('ascii',4,8),'ftyp','MP4 source does not contain valid ftyp');
  else
    assert.equal(encoded.subarray(0,4).toString('hex'),'1a45dfa3',
      'WebM source lacks genuine EBML header');
  const probe=spawnSync('ffprobe',['-v','error','-select_streams','v:0',
    '-show_entries','stream=codec_name,width,height,duration:format=duration,format_name',
    '-of','json',target],{encoding:'utf8',timeout:30000});
  assert.equal(probe.status,0,'Actual video ffprobe failed: '+String(probe.stderr||probe.error));
  const info=JSON.parse(probe.stdout),stream=info.streams?.[0];
  assert.ok(stream,'Actual encoded file has no video stream');
  assert.equal(stream.width,metadata.width,'Encoded video width differs from actual decoded preview');
  assert.equal(stream.height,metadata.height,'Encoded video height differs from actual decoded preview');
  const duration=Number(info.format?.duration??stream.duration);
  assert.ok(Number.isFinite(duration),'Actual video duration not measurable');
  assert.ok(label==='three'?duration>=2.3&&duration<=4.5:
    duration>=8&&duration<=11.5,'Genuine '+label+' seconds duration invalid: '+duration);
  const decode=spawnSync('ffmpeg',['-v','error','-i',target,'-f','null','-'],
    {encoding:'utf8',timeout:45000});
  assert.equal(decode.status,0,'Real captured WebGL2 video frames could not decode: '+
    String(decode.stderr||decode.error));
  const record={label,filename:target.split('/').at(-1),mime:metadata.type,
    sha256:sha256Of(encoded),bytes:encoded.length,duration,codec:stream.codec_name,
    dimensions:[stream.width,stream.height],ffmpegDecoded:true};
  report.clips.push(record);
  console.log('GENUINE_SOURCE_VIDEO_FILE_PASS',JSON.stringify(record));
  return record;
}
try{
  await mkdir(OUT,{recursive:true});
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
  await page.locator('#captureToggle').click();
  await page.locator('#scene').focus();
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(3150);
  await page.keyboard.up('ArrowRight');
  await page.locator('#captureToggle').click();
  const short=await getClip();
  assert.ok(short.bytes>2048,'3-second recording has no encoded video bytes');
  assert.ok(short.width>200&&short.height>100,'3-second recording is missing actual scene pixels');
  assert.ok(short.controls,'Inline video preview has no playback controls');
  assert.match(short.name,/^mythwrought-.+\.(mp4|webm)$/);
  assert.ok(Number(await page.locator('#scene').getAttribute('data-rendered-frames'))>firstFrame);
  await mkdir('artifacts/gameplay-recorder',{recursive:true});
  const shotPath='artifacts/gameplay-recorder/real-game-932x430.png';
  await page.screenshot({path:shotPath});
  const bytes=await readFile(shotPath);
  assert.ok(bytes.length>15000,'Real 3D viewport screenshot is suspiciously small');
  const sha256=createHash('sha256').update(bytes).digest('hex');
  const originalThree=await preserveVerifiedClip('three',short);
  console.log('PASS REAL 3s VIDEO',short,'frame screenshot SHA256',sha256);
  await page.locator('#captureClose').click();
  assert.ok(await page.locator('#capturePanel').isHidden());
  await page.locator('#captureToggle').click();
  await page.locator('#scene').focus();
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(2000);
  await page.keyboard.up('ArrowRight');
  const full=await getClip(); // natural ten-second stop; do not simulate timer
  assert.ok(full.bytes>2048,'10-second recording has no encoded video bytes');
  assert.ok(full.width>200&&full.height>100);
  assert.equal(full.width,short.width,'Unexpected video resolution difference');
  // MediaRecorder/MP4 may encode an odd-height WebGL frame at the neighboring
  // even pixel height. Verify the same genuine full-width moving scene, with
  // no more than one pixel of height rounding; never skip playback/frame tests.
  assert.ok(Math.abs(full.height-short.height)<=1,
    'Unexpected video resolution difference beyond encoder pixel rounding');
  assert.ok(Math.abs(full.width/full.height-short.width/short.height)<0.01,
    'Recorded video aspect ratio changed unexpectedly');
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
  const originalTen=await preserveVerifiedClip('ten',full);
  assert.equal(originalThree.dimensions[0],originalTen.dimensions[0]);
  assert.ok(Math.abs(originalThree.dimensions[1]-originalTen.dimensions[1])<=1,
    'Actual two encoded videos have incompatible physical output dimensions');
  assert.equal(await saved(),beforeSave,'Recorder modified the canonical world save');
  report.canonicalSchema1SavePreserved=true;
  report.status='ORIGINAL_GAME_3_AND_10_SECOND_VIDEOS_DECODED_AND_AUTHENTIC';
  const glError=await page.evaluate(()=>document.querySelector('#scene').getContext('webgl2').getError());
  assert.equal(glError,0,'WebGL error after recording');
  assert.deepEqual(errors,[],'Game threw errors while recording');
  assert.deepEqual(badResponses,[],'Missing assets during recording');
  console.log('PASS REAL 10s VIDEO',full,'decoded moving frames',play.sums,'no save changes/GL errors');
}catch(error){
  report.errors.push(String(error?.stack||error));
  throw error;
}finally{
  await mkdir(OUT,{recursive:true});
  await writeFile(OUT+'/original-video-proof.json',
    JSON.stringify(report,null,2)+'\n');
  await browser.close();
}
