// G2B-owned root acceptance: real native source tests AND actual Chromium.
import './creative-integration/g2b-physics-stream.test.mjs';
import './creative-integration/g2b-input-safety.test.mjs';
import './creative-integration/g2b-feature-off.test.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {readFileSync} from 'node:fs';
const exec=(cmd,args,{timeout=120000}={})=>{
 const r=spawnSync(cmd,args,{cwd:process.cwd(),encoding:'utf8',timeout,
  env:{...process.env,PLAYWRIGHT_BROWSERS_PATH:process.env.PLAYWRIGHT_BROWSERS_PATH||undefined}});
 if(r.status!==0)throw Error(cmd+' '+args.join(' ')+' failed: '+String(r.stderr||r.stdout).slice(-3000));
 return r;
};
test('G2B six-size genuine WebGL2 and live-flight browser acceptance',{timeout:16*60*1000},async()=>{
 // The root Node runner is parallel. Let the EXISTING real Pack 2 WebGL2 test
 // finish first; launching another GPU-heavy Chromium simultaneously caused
 // a 240-second Pack 2 timeout despite G2B itself passing all six viewports.
 // Pack 2 writes this exact head-specific manifest ONLY after its real
 // physical GPU and save-parity tests complete. No shared CI changes.
 // The existing Pack 2 test has a 240-second *per-test* browser timeout;
 // in concurrent Node workers it can START after this test begins.
 // Allow a bounded 450-second arrival window for its head-pinned manifest.
 // Never treat elapsed time, a stale artifact, or a console log as PASS.
 const pack2WaitMs=450000,pollMs=500;
 let priorPack2Done=false,observedHead='none';
 for(let elapsed=0;elapsed<pack2WaitMs;elapsed+=pollMs){
   try{
     const evidence=JSON.parse(readFileSync('artifacts/pack2-live-webgl/manifest.json','utf8'));
     observedHead=String(evidence.CIHead||'missing');
     if(evidence.CIHead===(process.env.GITHUB_SHA||'local')&&
        evidence.originalSaveSchema===1&&
        evidence.liveDeployment===false&&
        Array.isArray(evidence.viewports)&&evidence.viewports.length===3){
       priorPack2Done=true;
       break;
     }
   }catch(_){}
   await delay(pollMs);
 }
 assert.ok(priorPack2Done,'Existing Pack 2 WebGL2 head-pinned manifest missing after '+
   pack2WaitMs+'ms; expected '+(process.env.GITHUB_SHA||'local')+
   ', saw '+observedHead+'; do not launch GPU-concurrent G2B browser');
 // Root npm test runs before shared CI installs browser tools. This *test-owned*
 // bootstrap uses the same pinned free Playwright dependency as existing CI;
 // it changes no tracked package/CI file and is never a production import.
 if(spawnSync(process.execPath,['-e',"import('playwright')"],{cwd:process.cwd()}).status!==0)
   exec('npm',['install','--no-save','--no-audit','--no-fund','playwright@1.58.2','pngjs@7.0.0'],{timeout:240000});
 exec('npx',['playwright','install','chromium'],{timeout:240000});
 const port=4174;
 const web=spawn('python3',['-m','http.server',String(port)],{cwd:process.cwd(),
  stdio:'ignore'});
 try{
  let ready=false;
  for(let n=0;n<50;n++){
   try{const r=await fetch('http://127.0.0.1:'+port+'/');if(r.ok){ready=true;break;}}
   catch(_){}
   await delay(200);
  }
  assert.ok(ready,'G2B localhost production source server did not start');
  const child=spawn(process.execPath,['tests/creative-integration/g2b-browser.mjs'],
    {cwd:process.cwd(),env:{...process.env,G2B_BROWSER_ORIGIN:'http://127.0.0.1:'+port},
      stdio:['ignore','pipe','pipe']});
  let output='',errors='';
  child.stdout.on('data',d=>{output+=d.toString();});
  child.stderr.on('data',d=>{errors+=d.toString();});
  const code=await new Promise((resolve,reject)=>{
   child.on('error',reject);child.on('close',resolve);
  });
  console.log(output);
  assert.equal(code,0,'G2B real Chromium harness failed: '+errors.slice(-4200));
  assert.equal((output.match(/PASS G2B real Chromium WebGL2 flight/g)||[]).length,6,
    'All six real Chromium WebGL2 iPhone-landscape layouts must pass');
 }finally{web.kill('SIGTERM');}
});
