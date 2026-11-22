// M1 source-matched native Node parity against original PR #121 at its pinned exact head.
// GitHub Actions' fetch-depth:0 checkout supplies the original Git object.
// A missing original object must FAIL CLOSED, never silently substitute fabricated fixtures.
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const ledger=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-1b/legacy-inheritance.json',import.meta.url),'utf8'));
const objSha=s=>createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');

test('M1: independently execute original PR #121 sources and match every inherited stable complete voxel-by-voxel',async()=>{
 const work=mkdtempSync(join(tmpdir(),'mythwrought-roadmap1b-source-parity-'));
 const legacyNames=['schema.mjs','m1-designs.mjs','m1-candidate-footprints.mjs','m1-buildings.mjs'];
 try{
  for(const name of legacyNames){
   const obj=execFileSync('git',['show',ledger.originalHead+':src/building-pool/roadmap-1/'+name],{encoding:'utf8',maxBuffer:3*1024*1024});
   const expected=ledger.originalSourceBlobs[name];
   assert.equal(objSha(obj),expected,'original Git source blob was not exact: '+name);
   writeFileSync(join(work,name),obj,'utf8');
  }
  const url=pathToFileURL(join(work,'m1-buildings.mjs')).href;
  const original=(await import(url)).getM1Blueprints().filter(x=>x.category==='stable');
  const migrated=getInheritedStables();
  assert.equal(original.length,15);assert.equal(migrated.length,15);
  const originalById=new Map(original.map(x=>[x.id,x]));
  assert.equal(originalById.size,15);
  let voxelCount=0;
  for(const next of migrated){
   const old=originalById.get(next.id);
   assert.ok(old,'original stable missing '+next.id);
   assert.equal(stableBlueprintJSON(next),stableBlueprintJSON(old),'full source-exact physical coordinate/portal/room/dependency mismatch: '+next.id);
   assert.equal(structuralFingerprint(next),structuralFingerprint(old),'structural identity diverged: '+next.id);
   voxelCount+=next.placements.length;
  }
  assert.ok(voxelCount>1000,'unexpected loss of original authored stable physical cells');
 }finally{rmSync(work,{recursive:true,force:true});}
});