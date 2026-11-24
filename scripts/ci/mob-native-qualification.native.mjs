import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {qualify} from './mob-native-qualification.mjs';

async function fixture(t,body="import test from 'node:test'; test('pass',()=>{});\n"){
  const dir=await mkdtemp(join(tmpdir(),'mob-native-'));
  t.after(()=>rm(dir,{recursive:true,force:true}));
  const root=join(dir,'repo'),output=join(dir,'evidence');
  await mkdir(join(root,'tests'),{recursive:true});
  await writeFile(join(root,'tests/sample.test.mjs'),body);
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
  git('init','-q');git('config','user.email','fixture@example.invalid');
  git('config','user.name','Fixture');git('add','.');git('commit','-qm','fixture');
  const expected=git('rev-parse','HEAD');
  return {root,output,expected,plan:[{name:'fixture',files:['tests/sample.test.mjs']}]};
}
test('native pass produces real TAP and matching evidence digest, never release-ready',async t=>{
  const f=await fixture(t),r=await qualify(f);
  assert.equal(r.nativeReady,true);assert.equal(r.releaseReady,false);
  assert.equal(r.groups[0].tests,1);assert.equal(r.groups[0].pass,1);
  assert.equal(r.groups[0].sha256,createHash('sha256').update(await readFile(join(f.output,'fixture.tap'))).digest('hex'));
  assert.deepEqual(JSON.parse(await readFile(join(f.output,'qualification.json'),'utf8')),r);
  await assert.rejects(qualify(f),/EEXIST/);
});
test('real failing Node test cannot qualify',async t=>{
  const f=await fixture(t,"import test from 'node:test'; test('fail',()=>{throw Error('failure')});\n");
  const r=await qualify(f);assert.equal(r.nativeReady,false);assert.equal(r.groups[0].fail,1);
});
test('real skipped Node test cannot qualify',async t=>{
  const f=await fixture(t,"import test from 'node:test'; test.skip('skip',()=>{});\n");
  const r=await qualify(f);assert.equal(r.nativeReady,false);assert.equal(r.groups[0].skipped,1);
});
test('wrong commit and dirty checkout fail before execution',async t=>{
  const f=await fixture(t);
  await assert.rejects(qualify({...f,expected:'0'.repeat(40)}),/Wrong checkout HEAD/);
  await writeFile(join(f.root,'tests/sample.test.mjs'),'throw Error("changed");\n');
  await assert.rejects(qualify(f),/Checkout is dirty/);
});
test('duplicate tests and internal output directory are refused',async t=>{
  const f=await fixture(t);
  await assert.rejects(qualify({...f,plan:[...f.plan,{name:'duplicate',files:f.plan[0].files}]}),/duplicate test/);
  await assert.rejects(qualify({...f,output:join(f.root,'evidence')}),/outside checkout/);
});
test('timeout leaves real nonpassing evidence',async t=>{
  const f=await fixture(t,"import test from 'node:test'; test('slow',()=>new Promise(r=>setTimeout(r,5000)));\n");
  const r=await qualify({...f,timeoutMs:80});
  assert.equal(r.nativeReady,false);assert.ok(r.groups[0].error||r.groups[0].signal);
});
