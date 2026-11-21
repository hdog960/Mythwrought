import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {getPack5Surface,surfaceBoxMesh,PACK5_SURFACE_MATERIALS} from '../../../src/block-packs/pack-5/architectural-surfaces.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const browserDriver=fileURLToPath(new URL('./roadmap-a-pack5-producer-witness-browser.py',import.meta.url));
const variants={'pack5:079':['chalk-lime','hand-troweled'],'pack5:080':['hearth-running-bond','kiln-soldier-course'],'pack5:081':['sunburst-encaustic','moonwoven-glaze']};
test('Pack5 physical witness uses exactly six source-authored colored meshes, collision and support geometry; no catalog or game mutation',()=>{
 for(const [symbol,values] of Object.entries(variants))for(const variant of values){
  const a=getPack5Surface(symbol,variant),m=surfaceBoxMesh(a,{rotation:0}),p=resolveManualFivePackAsset(symbol,{variant});
  assert.equal(m.vertexCount,a.art.length*24);
  assert.equal(m.triangles,a.art.length*12);
  assert.equal(m.positions.length,m.vertexCount*3);
  assert.equal(m.colors.length,m.vertexCount*4);
  assert.equal(m.indices.length,m.triangles*3);
  assert.equal(p.visibleBoxes.length,a.art.length);
  assert.equal(p.collisionBoxes.length,a.parts[0].collisionBoxes.length);
  assert.equal(p.livePlaceable,false);
  assert.equal(p.saveWritten,false);
  assert.ok(a.art.every(part=>Object.hasOwn(PACK5_SURFACE_MATERIALS,part.material)));
  if(symbol==='pack5:079'){
   assert.equal(p.supportPolicy,'wall');
   assert.deepEqual(p.supportOffsets,[[0,0,-1]]);
   assert.ok(p.collisionBoxes.every(b=>b[5]-b[2]<.25));
  }else if(symbol==='pack5:080'){
   assert.equal(p.supportPolicy,'none');
   assert.deepEqual(p.collisionBoxes,[[0,0,0,1,1,1]]);
  }else{
   assert.equal(p.supportPolicy,'floor');
   assert.deepEqual(p.supportOffsets,[[0,-1,0]]);
   assert.ok(p.collisionBoxes.every(b=>b[4]-b[1]<.3));
  }
 }
 assert.throws(()=>resolveManualFivePackAsset('pack5:079'),/explicit authored variant/);
});
test('36 original-geometry material-aware Chromium WebGL2 screenshots: two views, three landscape sizes, six true producer variants', {timeout:1200000},()=>{
 const sys=spawnSync('python3',['-c','import playwright.sync_api'],{encoding:'utf8'});
 const tmp=mkdtempSync(join(tmpdir(),'mythwrought-pack5-witness-'));
 try{
  const env={...process.env,PYTHONUNBUFFERED:'1'};
  if(sys.status!==0){
   env.PYTHONPATH=join(tmp,'lib');
   const p=spawnSync('python3',['-m','pip','install','--disable-pip-version-check','--no-input','--target',env.PYTHONPATH,'playwright==1.58.0'],{cwd:root,env,encoding:'utf8',timeout:240000});
   assert.equal(p.status,0,'Pinned real Playwright installation failed '+(p.stderr||p.stdout||'').slice(-1800));
  }
  if(!env.CHROMIUM_EXECUTABLE){
   const c=spawnSync('bash',['-lc','command -v google-chrome || command -v google-chrome-stable || command -v chromium || true'],{encoding:'utf8'});
   if(c.stdout.trim())env.CHROMIUM_EXECUTABLE=c.stdout.trim().split('\n')[0];
  }
  if(env.CHROMIUM_EXECUTABLE)assert(existsSync(env.CHROMIUM_EXECUTABLE),'Real Chromium executable missing');
  const r=spawnSync('python3',[browserDriver],{cwd:root,env,encoding:'utf8',timeout:1200000,maxBuffer:8*1024*1024});
  if(r.stdout)process.stdout.write(r.stdout);
  if(r.stderr)process.stderr.write(r.stderr);
  assert.equal(r.status,0,'Actual material-aware physical producer 36-frame witness failed '+(r.error?.message||r.stderr||r.stdout||'').slice(-2200));
 }finally{rmSync(tmp,{recursive:true,force:true});}
});
