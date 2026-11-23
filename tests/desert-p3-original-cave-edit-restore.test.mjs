// Genuine original V7 cave source cell, temporary in-memory player-authored
// colored blocks and canonical schema-1 save/restore provenance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,restoreFourRegionWorld,
 M7_ENVIRONMENT_GENERATOR as M7} from '../src/manual-biomes/profile-world.mjs';
import {meshChunk,chunkCoord,BLOCK} from '../src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {canBlendNaturalDesertSurface} from '../src/manual-biomes/desert-seam-vertex-tint.mjs';
import {canWarmSourceScree} from '../src/manual-biomes/desert-bilateral-rgb.mjs';
import {desertSeamEditAffectedChunks} from '../src/manual-biomes/desert-seam-invalidation.mjs';
import {editAffectedChunks} from '../src/chunks.mjs';

test('real original cave AIR veto survives manually colored fake cap and canonical saved-world restore',()=>{
 const seed=179,profile=fourRegionProfile(seed,M7);
 const w=new FourRegionWorld(seed,profile),mouths=w.environmentCaves.entranceSites;
 let witness=null,sourceChecks=0;
 for(const site of mouths){
  const {x:mx,y:my,z:mz}=site.mouth;
  for(let dx=-4;dx<=4&&!witness;dx++)for(let dz=-4;dz<=4&&!witness;dz++){
   const x=mx+dx,z=mz+dz,plan=w._columnPlan(x,z);
   if(plan.size)continue;
   for(let y=Math.max(-3,my-3);y<=Math.min(19,my+3);y++){
    sourceChecks++;
    const cave=w.environmentCaves.get(x,y,z);
    if(cave!==BLOCK.AIR)continue;
    if(w.get(x,y,z)!==BLOCK.AIR)continue;
    witness={x,y,z,site:site.name,mouth:site.mouth};break;
   }
  }
  if(witness)break;
 }
 assert.ok(witness,'Genuine original verified cave source must contain an empty protected cave cell');
 const {x,y,z}=witness,cx=chunkCoord(x),cz=chunkCoord(z);
 const original=meshChunk(w,cx,cz);
 const prior=editAffectedChunks(x,z);
 const originalClimate=v6BiomeAt(x,z,seed);
 const cases=[];
 for(const candidateId of [258,401]){
  assert.equal(w._columnPlan(x,z).size,0,'Protected original cave plan remains empty');
  assert.equal(w.get(x,y,z),BLOCK.AIR);
  assert.ok(w.set(x,y,z,candidateId),
   'Only normal in-memory schema-1 edit can place the fake colored cave block');
  assert.equal(w.get(x,y,z),candidateId);
  assert.ok(w.edits.has(x+','+y+','+z));
  assert.deepEqual(desertSeamEditAffectedChunks(w,x,z,y),prior,
   'Original cave veto must not trigger the extra Desert visual chunk halo');
  const region=v6BiomeAt(x,z,seed);
  assert.deepEqual(region,originalClimate);
  assert.equal(canBlendNaturalDesertSurface({
   id:258,edited:true,region,sourceSurface:null,y}),false);
  assert.equal(canWarmSourceScree({
   id:401,edited:true,region,sourceSurface:null,y}),false);
  const wrap=new Pack2LiveWorld(w);
  assert.deepEqual(desertSeamEditAffectedChunks(wrap,x,z,y),prior);
  assert.equal(wrap.get(x,y,z),candidateId);
  const edited=meshChunk(w,cx,cz);
  assert.ok(edited instanceof Float32Array&&edited.byteLength>0);
  assert.equal(edited.length%9,0);
  const save=w.save();
  assert.equal(save.edits.length,1);
  const reload=restoreFourRegionWorld(save,profile);
  assert.equal(reload.get(x,y,z),candidateId);
  assert.equal(reload._columnPlan(x,z).size,0);
  assert.deepEqual(reload.save().edits,save.edits);
  assert.deepEqual(meshChunk(reload,cx,cz),edited,
   'Same original cave edit must have exactly the same source GPU vertices after reload');
  assert.ok(w.set(x,y,z,BLOCK.AIR));
  assert.deepEqual(w.save().edits,[]);
  assert.deepEqual(meshChunk(w,cx,cz),original,
   'Restoring cave AIR must restore EVERY source-authored vertex float');
  cases.push({candidateId,editedBytes:edited.byteLength,restoredBytes:original.byteLength,
   savedRowsBeforeRestore:save.edits.length,savedRowsAfterUndo:0});
 }
 assert.ok(w.cachedBiomeColumns<=1024);
 console.log('DESERT_P3_REAL_CAVE_FAKE_CAP_SAVE_RESTORE '+JSON.stringify({
  seed,witness,sourceChecks,baselineChunk:[cx,cz],
  genuineOriginalCaveAIR:0,originalRegion:originalClimate?.name??'plains',
  cases,unmodifiedOriginalGPUBytes:original.byteLength,
  result:'two genuine colored player edits stay non-natural, canonical restore works and all original vertices return'
 }));
});
