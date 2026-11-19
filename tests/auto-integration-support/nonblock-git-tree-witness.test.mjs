import test from 'node:test';
import assert from 'node:assert/strict';
import {gitBlobSha,verifyProducerTreeWitness} from '../../src/auto-integration-support/nonblock-git-tree-witness.mjs';
const heads={24:'a'.repeat(40),36:'b'.repeat(40),48:'c'.repeat(40)};
const commitTrees={24:'1'.repeat(40),36:'2'.repeat(40),48:'3'.repeat(40)};
const paths={24:'src/nonblock-environments24/objects.mjs',36:'src/nonblock-fittings36/fittings-phase1.mjs',48:'src/nonblock-scene48/nonblock-object-v1.mjs'};
function fixture(){
 const sourceBytes={},trees={},producers=[];
 for(const lane of ['24','36','48']){
  const files=[];
  for(let i=0;i<2;i++){const path=i?paths[lane].replace('.mjs','-other.mjs'):paths[lane];const bytes='fixture-'+lane+'-'+i;sourceBytes[path]=bytes;files.push({path,blob:gitBlobSha(bytes)});}
  producers.push({lane,head:heads[lane],files});
  trees[lane]={sha:commitTrees[lane],truncated:false,tree:files.map(f=>({path:f.path,sha:f.blob,type:'blob',mode:'100644'}))};
 }
 return {manifest:{version:1,producers},trees,sourceBytes,expectedHeads:{...heads},commitTrees:{...commitTrees}};
}
test('Git blob hashes use real git framing',()=>assert.equal(gitBlobSha('test content\n'),'d670460b4b4aece5915caf5c68d12f560a9fe3e4'));
test('all six exact tree-bound files pass',()=>{const r=verifyProducerTreeWitness(fixture());assert.equal(r.ok,true);assert.equal(r.witnessed.length,6);assert.equal(r.live,false)});
for(const [name,mutate] of [
 ['stale head',f=>f.expectedHeads[24]='d'.repeat(40)],
 ['forged tree SHA',f=>f.trees[36].sha='d'.repeat(40)],
 ['missing commit-to-tree evidence',f=>delete f.commitTrees[24]],
 ['wrong commit tree identity',f=>f.commitTrees[48]='f'.repeat(40)],
 ['truncated tree',f=>f.trees[48].truncated=true],
 ['missing blob',f=>delete f.sourceBytes[paths[24]]],
 ['changed bytes',f=>f.sourceBytes[paths[36]]='tampered'],
 ['tree membership altered',f=>f.trees[48].tree[0].sha='e'.repeat(40)],
 ['wrong owner path',f=>f.manifest.producers[0].files[0].path='src/other/objects.mjs'],
 ['duplicate lane',f=>f.manifest.producers[1].lane='24'],
 ['non-blob member',f=>f.trees[24].tree[0].type='tree'],
 ['wrong mode',f=>f.trees[36].tree[0].mode='100755']
])test('fail closed: '+name,()=>{const f=fixture();mutate(f);assert.equal(verifyProducerTreeWitness(f).ok,false)});
