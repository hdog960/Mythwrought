// Additive CI-owned Chromium startup diagnostic. Does not alter, mock or retry original tests.
// Selects only a real installed Chrome/Chromium executable that answers an actual DevTools port.
// The original 4B Chromium test still uses its exact original code, flags, CDP timeouts and assertions.
import {existsSync,mkdtempSync,readFileSync,rmSync,mkdirSync,writeFileSync,appendFileSync} from 'node:fs';
import {tmpdir,freemem,totalmem} from 'node:os';
import {join,resolve} from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
const candidates=[process.env.CHROME_BIN,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].filter((x,i,a)=>x&&existsSync(x)&&a.indexOf(x)===i);
const observations=[];
const mem={freeBefore:freemem(),total:totalmem()};
function stop(child){try{if(child.pid)process.kill(-child.pid,'SIGTERM');}catch{try{child.kill('SIGTERM');}catch{}}}
async function probe(binary){
 const profile=mkdtempSync(join(tmpdir(),'mythwrought-rc4b-real-cdp-probe-'));
 const version=spawnSync(binary,['--version'],{encoding:'utf8',timeout:10000});
 const child=spawn(binary,[
 '--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu-sandbox',
 '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader',
 '--enable-webgl','--ignore-gpu-blocklist','--remote-allow-origins=*',
 '--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'
 ],{stdio:['ignore','pipe','pipe'],detached:true});
 let stderr='',stdout='',port=null,reason='no-debug-port';
 child.stdout.on('data',x=>{stdout=(stdout+x.toString()).slice(-5000)});
 child.stderr.on('data',x=>{stderr=(stderr+x.toString()).slice(-10000)});
 try{
  for(let i=0;i<180;i++){
   if(existsSync(join(profile,'DevToolsActivePort'))){
    const p=Number(readFileSync(join(profile,'DevToolsActivePort'),'utf8').split('\n')[0]);
    if(Number.isInteger(p)&&p>0){
     const controller=new AbortController();
     const t=setTimeout(()=>controller.abort(),5000);
     try{
      const response=await fetch('http://127.0.0.1:'+p+'/json/version',{signal:controller.signal});
      const d=await response.json();
      if(response.ok&&d.webSocketDebuggerUrl&&d.Browser){port=p;reason='real-CDP-success';break;}
      reason='bad-CDP-version-json';
     }catch(e){reason='CDP-health-fetch: '+e.message}
     finally{clearTimeout(t);}
    }
   }
   if(child.exitCode!==null){reason='real-Chromium-exit-'+child.exitCode;break;}
   await sleep(100);
  }
 }finally{stop(child);await sleep(200);rmSync(profile,{recursive:true,force:true,maxRetries:15,retryDelay:100});}
 return {binary,version:(version.stdout||version.stderr||'').trim(),success:port!==null,reason,stdout,stderr,freeAfter:freemem()};
}
for(const bin of candidates){const result=await probe(bin);observations.push(result);console.log(JSON.stringify({chromiumDiagnostic:result}));if(result.success){
 const record={schema:'mythwrought.roadmap-c-4b-real-browser-health.v1',sourceHead:process.env.SOURCE_HEAD_SHA,runId:process.env.GITHUB_RUN_ID,runAttempt:process.env.GITHUB_RUN_ATTEMPT,binary:bin,observations,freeMemBefore:mem.freeBefore,totalMem:mem.total,realCDP:true};
 mkdirSync('artifacts/health',{recursive:true});writeFileSync('artifacts/health/chrome-startup.json',JSON.stringify(record,null,2)+'\n');
 if(!process.env.GITHUB_ENV)throw Error('not running in a real GitHub Actions job; browser binary selection not durable');
 appendFileSync(process.env.GITHUB_ENV,'CHROME_BIN='+bin+'\n');console.log('RC4B_VERIFIED_REAL_CHROMIUM '+bin);
 process.exit(0);
}}
mkdirSync('artifacts/health',{recursive:true});
writeFileSync('artifacts/health/chrome-startup-failure.json',JSON.stringify({schema:'mythwrought.roadmap-c-4b-real-browser-health.v1',sourceHead:process.env.SOURCE_HEAD_SHA,runId:process.env.GITHUB_RUN_ID,runAttempt:process.env.GITHUB_RUN_ATTEMPT,observations,realCDP:false},null,2)+'\n');
throw Error('No installed real Chromium binary established a CDP port; no simulated or skipped test path');
