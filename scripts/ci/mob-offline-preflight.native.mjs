import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp,mkdir,writeFile,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {auditMobOffline} from './mob-offline-preflight.mjs';

const files={
  'src/mobs/live-game.mjs':"import './shared.mjs'; export {x} from './adapter.mjs';\n",
  'src/mobs/live-render.mjs':"import {x} from './adapter.mjs';\n",
  'src/mobs/shared.mjs':"import '../world.mjs';\n",
  'src/mobs/adapter.mjs':"import './shared.mjs'; export const x=1;\n",
  'src/world.mjs':"import './mobs/shared.mjs';\n",
  'src/mobs/research-only.mjs':"throw Error('not reachable');\n"
};
const required=Object.keys(files).filter(p=>!p.includes('research-only'));
const digest=s=>createHash('sha256').update(s).digest('hex');
async function fixture(t,{publicPaths=required,stagePaths=required,stale=[],overrides={}}={}){
  const root=await mkdtemp(join(tmpdir(),'mob-offline-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  for(const [p,s] of Object.entries({...files,...overrides})){
    await mkdir(dirname(join(root,p)),{recursive:true});await writeFile(join(root,p),s);
  }
  const worker='const SOURCE_ASSETS=[\n'+publicPaths.map(p=>'  "./'+p+'",').join('\n')+'\n];\n';
  const manifest=JSON.stringify({version:'fixture',assets:Object.fromEntries(stagePaths.map(p=>['./'+p,digest(stale.includes(p)?'old':({...files,...overrides})[p])]))});
  await writeFile(join(root,'sw-m5.js'),worker);
  await writeFile(join(root,'nonblock-stage-assets.json'),manifest);
  return {root,worker,manifest};
}
test('native parser follows static imports, reexports, cycles and excludes research-only files',async t=>{
  const {root}=await fixture(t);const r=await auditMobOffline(root);
  assert.equal(r.ready,true);assert.equal(r.modules,5);
  assert.deepEqual(r.rows.map(x=>x.path).sort(),[...required].sort());
});
test('new dependency absent in both workers is an explicit hold',async t=>{
  const paths=required.filter(p=>!p.includes('adapter'));
  const {root}=await fixture(t,{publicPaths:paths,stagePaths:paths});const r=await auditMobOffline(root);
  assert.equal(r.ready,false);assert.deepEqual(r.missingPublic,['src/mobs/adapter.mjs']);assert.deepEqual(r.missingStage,r.missingPublic);
});
test('listed stage entry with previous bytes is stale, not accepted',async t=>{
  const {root}=await fixture(t,{stale:['src/mobs/live-game.mjs']});const r=await auditMobOffline(root);
  assert.equal(r.ready,false);assert.deepEqual(r.staleStage,['src/mobs/live-game.mjs']);assert.deepEqual(r.missingStage,[]);
});
test('stage manifest alone cannot satisfy public worker',async t=>{
  const {root}=await fixture(t,{publicPaths:required.filter(p=>p!=='src/world.mjs')});const r=await auditMobOffline(root);
  assert.equal(r.ready,false);assert.deepEqual(r.missingPublic,['src/world.mjs']);assert.deepEqual(r.missingStage,[]);
});
test('actual missing source file fails read-only audit',async t=>{
  const {root}=await fixture(t);await rm(join(root,'src/world.mjs'));await assert.rejects(auditMobOffline(root),/ENOENT/);
});
test('bare and escaping module imports cannot silently pass',async t=>{
  for(const spec of ['node:fs','../../../outside.mjs','./adapter.mjs?v=1']){
    const {root}=await fixture(t,{overrides:{'src/mobs/live-game.mjs':`import '${spec}';`}});
    await assert.rejects(auditMobOffline(root),/Unsupported|escapes/);
  }
});
test('parse errors and duplicate cache entries fail closed',async t=>{
  const malformed=await fixture(t,{overrides:{'src/mobs/live-game.mjs':'export const =;'}});
  await assert.rejects(auditMobOffline(malformed.root),SyntaxError);
  const duplicate=await fixture(t,{publicPaths:[...required,required[0]]});
  await assert.rejects(auditMobOffline(duplicate.root),/duplicate/);
});
test('audit never evaluates modules or changes worker or manifest bytes',async t=>{
  const {root,worker,manifest}=await fixture(t,{overrides:{'src/world.mjs':"throw Error('MUST NOT EXECUTE');"}});
  assert.equal((await auditMobOffline(root)).ready,true);
  assert.equal(await readFile(join(root,'sw-m5.js'),'utf8'),worker);
  assert.equal(await readFile(join(root,'nonblock-stage-assets.json'),'utf8'),manifest);
});
