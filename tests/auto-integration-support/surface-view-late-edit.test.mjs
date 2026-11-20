// Source-driven regression against the real :24 world-view producer.
// Candidate-only: never writes to world state or production modules.
// Run on a checkout containing the :24 candidate source:
// node --test tests/auto-integration-support/surface-view-late-edit.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {terrainHeight} from '../../src/voxel.mjs';
// The :24 producer is not on every isolated :12 checkout. Missing producer
// means NOT VERIFIED, never a passing source-driven compatibility claim.
let createSurfaceBiomeWorldView;
let producerUnavailable = '';
try {
  ({createSurfaceBiomeWorldView} = await import('../../src/surface-regions/regions.mjs'));
  if (typeof createSurfaceBiomeWorldView !== 'function') producerUnavailable = 'missing :24 world-view export';
} catch (error) {
  if (error?.code !== 'ERR_MODULE_NOT_FOUND') throw error;
  producerUnavailable = 'actual :24 producer source absent from this isolated checkout';
}
if (producerUnavailable) console.warn('NOT VERIFIED: ' + producerUnavailable);
import {createDurableIntentWitness} from '../../src/auto-integration-support/durable-intent-bridge.mjs';

const seed=179;
function fixture(){
  const edits=new Map(), rotations=new Map();
  const baseline=(x,y,z)=>y<=terrainHeight(x,z,seed)?1:0;
  return {seed,edits,rotations,naturalAndLandmarkBlock:baseline,
    get(x,y,z){return edits.get(`${x},${y},${z}`)??baseline(x,y,z);},
    rotationAt:()=>0};
}
function view(world,witness){
  return createSurfaceBiomeWorldView(world,{
    enabled:true,profileIsFresh:true,isProtected:()=>false,
    hasDurableEditIntent:witness.hasDurableEditIntent,maxCachedColumns:16
  });
}
function findOverlay(v,w){
  for(let x=490;x<=534;x++) for(let z=-22;z<=22;z++){
    const top=terrainHeight(x,z,seed);
    for(let y=top-2;y<=top+12;y++){
      if(v.get(x,y,z)!==w.get(x,y,z))return {x,y,z};
    }
  }
  assert.fail('source producer did not generate an overlay in fixed-seed region');
}
test('cached source overlay yields to a late edit and stays suppressed after natural restoration', {skip: producerUnavailable || false},()=>{
  const w=fixture(), touched=new Set();
  const witness=createDurableIntentWitness({historyComplete:true});
  // Mutable durable history callback is a test stand-in for a trusted persistence source.
  const v=createSurfaceBiomeWorldView(w,{
    enabled:true,profileIsFresh:true,isProtected:()=>false,
    hasDurableEditIntent:(x,y,z)=>touched.has(`${x},${y},${z}`)||
      witness.hasDurableEditIntent(x,y,z)
  });
  const c=findOverlay(v,w), k=`${c.x},${c.y},${c.z}`;
  assert.ok(v.cachedColumns>0,'exercise already cached source column');
  w.edits.set(k,77);
  assert.equal(v.get(c.x,c.y,c.z),77,'late edit overrides cached overlay');
  w.edits.delete(k);
  touched.add(k);
  assert.equal(v.get(c.x,c.y,c.z),w.get(c.x,c.y,c.z),
    'restoring natural value cannot resurrect cached overlay');
  assert.equal(w.edits.size,0);
});
test('incomplete history suppresses every overlay even after cache warming', {skip: producerUnavailable || false},()=>{
  const w=fixture(), complete=view(w,createDurableIntentWitness({historyComplete:true}));
  const c=findOverlay(complete,w);
  const unknown=view(w,createDurableIntentWitness({historyComplete:false}));
  assert.equal(unknown.get(c.x,c.y,c.z),w.get(c.x,c.y,c.z));
  assert.equal(unknown.cachedColumns,0,'fail closed before materializing overlay plan');
});
