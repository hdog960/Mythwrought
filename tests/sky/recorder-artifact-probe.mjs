// Supplemental evidence only: run on an isolated audit branch whose parent is the
// exact accepted MYTHWROUGHT SKY S6 + M5 + REC release candidate.
// Does not mock MediaRecorder or modify gameplay, saves or source files.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {chromium} from 'playwright';
const ROOT='artifacts/sky-s6-m5-real-recorder';
await mkdir(ROOT,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const originalHead=process.env.GITHUB_SHA||'unknown';
const report={originalCandidateHead:originalHead,rawMP4:true,physicalIphone:false,clips:[],errors:[]};
const browser=await chromium.launch({headless:true,args:[
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
const ctx=await browser.newContext({viewport:{width:932,height:430},deviceScaleFactor:1,isMobile:true,hasTouch:true,acceptDownloads:true});
const page=await ctx.newPage(),errors=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+' '+r.url());});
const save=()=>page.evaluate(()=>localStorage.getItem('mythwrought-v002-world-179'));
async function capture(label,auto){
 await page.locator('#captureToggle').click();
 await page.locator('#scene').focus();
 await page.keyboard.down('ArrowRight');
 await page.waitForTimeout(auto?2100:3100);
 await page.keyboard.up('ArrowRight');
 if(!auto)await page.locator('#captureToggle').click();
 await page.waitForFunction(()=>Boolean(document.querySelector('#captureSave')?.href)
   &&!document.querySelector('#capturePanel')?.hidden,null,{timeout:25000});
 await page.waitForFunction(()=>document.querySelector('#capturePreview')?.videoWidth>0,null,{timeout:15000});
 const meta=await page.evaluate(()=>{const v=document.querySelector('#capturePreview');
  const a=document.querySelector('#captureSave');
  return {width:v.videoWidth,height:v.videoHeight,duration:v.duration,controls:v.controls,
    mime:a.download.split('.').pop(),filename:a.download};
 });
 assert.ok(meta.width>200&&meta.height>100&&meta.controls);
 const target=path.join(ROOT,label+'.mp4');
 const [download]=await Promise.all([
   page.waitForEvent('download',{timeout:15000}),
   page.locator('#captureSave').click()
 ]);
 await download.saveAs(target);
 const bytes=await readFile(target);
 assert.ok(bytes.length>2048,'Empty real video file '+label);
 const probe=spawnSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries',
   'stream=codec_name,width,height,duration:format=duration,format_name','-of','json',target],
   {encoding:'utf8',timeout:30000});
 assert.equal(probe.status,0,'ffprobe failed: '+probe.stderr);
 const info=JSON.parse(probe.stdout),stream=info.streams?.[0];
 assert.ok(stream&&stream.width===meta.width&&stream.height===meta.height,
   'Original encoder file dimensions do not match browser metadata');
 const duration=Number(info.format?.duration||stream.duration);
 assert.ok(Number.isFinite(duration), 'Missing original encoded duration');
 if(auto){assert.ok(duration>=8&&duration<=11.5,'10-second file duration out of range '+duration);}
 else{assert.ok(duration>=2.3&&duration<=4.5,'3-second file duration out of range '+duration);}
 const decode=spawnSync('ffmpeg',['-v','error','-i',target,'-f','null','-'],
  {encoding:'utf8',timeout:40000});
 assert.equal(decode.status,0,'Actual encoded video could not decode: '+decode.stderr);
 const result={label,...meta,ffprobe:info,decodedSeconds:duration,size:bytes.length,sha256:sha(bytes),ffmpegDecode:true};
 report.clips.push(result);
 console.log('PASS ORIGINAL VIDEO FILE',JSON.stringify(result));
 await page.locator('#captureClose').click();
}
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle',timeout:45000});
 await page.waitForFunction(()=>+document.querySelector('#scene')?.dataset.loadedChunks===25,null,{timeout:45000});
 const savedBefore=await save();
 await capture('true-original-3s',false);
 await capture('true-original-10s',true);
 assert.equal(report.clips.length,2);
 assert.equal(report.clips[0].width,report.clips[1].width);
 assert.equal(report.clips[0].height,report.clips[1].height);
 assert.equal(await save(),savedBefore,'Recorder modified canonical world save');
 assert.equal(await page.evaluate(()=>document.querySelector('#scene').getContext('webgl2').getError()),0);
 assert.deepEqual(errors,[],'Page JS errors');assert.deepEqual(missing,[],'Missing assets');
 const shot=await page.screenshot({path:path.join(ROOT,'original-game-after-verified-recording.png')});
 report.screenshotSha256=sha(shot);
 report.complete=true;
} catch(e){report.errors.push(String(e?.stack||e));throw e;}
finally{
 await writeFile(path.join(ROOT,'manifest.json'),JSON.stringify(report,null,2)+'\n');
 await browser.close();
}
