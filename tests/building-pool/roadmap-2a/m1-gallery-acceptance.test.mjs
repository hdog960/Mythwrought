import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const driver=fileURLToPath(new URL('./m1-gallery-browser.py',import.meta.url));
test('all 480 actual-source Chromium WebGL2 exterior/cutaway views, three landscape viewports', {timeout:1200000},()=>{
 const system=spawnSync('python3',['-c','import playwright.sync_api'],{encoding:'utf8'});
 const temp=mkdtempSync(join(tmpdir(),'mythwrought-2a-python-'));
 try{
  const env={...process.env,PYTHONUNBUFFERED:'1'};
  if(system.status!==0){
   env.PYTHONPATH=join(temp,'lib');
   const pip=spawnSync('python3',['-m','pip','install','--disable-pip-version-check','--no-input','--target',env.PYTHONPATH,'playwright==1.58.0'],
    {cwd:root,env,encoding:'utf8',timeout:240000});
   assert.equal(pip.status,0,'Pinned free Playwright install failed: '+(pip.stderr||pip.stdout||'').slice(-1600));
  }
  if(!env.CHROMIUM_EXECUTABLE){
   const found=spawnSync('bash',['-lc','command -v google-chrome || command -v google-chrome-stable || command -v chromium || true'],{encoding:'utf8'});
   if(found.stdout.trim())env.CHROMIUM_EXECUTABLE=found.stdout.trim().split('\n')[0];
  }
  if(env.CHROMIUM_EXECUTABLE)assert(existsSync(env.CHROMIUM_EXECUTABLE),'Genuine Chromium not found');
  const r=spawnSync('python3',[driver],{cwd:root,env,encoding:'utf8',timeout:1200000,maxBuffer:8*1024*1024});
  if(r.stdout)process.stdout.write(r.stdout);
  if(r.stderr)process.stderr.write(r.stderr);
  assert.equal(r.status,0,'480-view genuine Chromium gallery failed: '+(r.error?.message||r.stderr||r.stdout||'').slice(-2000));
 }finally{rmSync(temp,{recursive:true,force:true});}
});
