// Opt-in source-driven contract: imports the actual :24 producer, not a copied mock.
// No runtime wiring or persistence mutation. Run with:
// node --test tests/auto-integration-support/surface-view-source-contract.test.mjs
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
const baseline=(x,y,z)=>y<=terrainHeight(x,z,seed)?1:0;
const world=()=>({
  seed, edits:new Map(), rotations:new Map(),
  naturalAndLandmarkBlock:baseline,
  get:baseline,
  rotationAt:()=>0
});
const options=(witness)=>({
  enabled:true, profileIsFresh:true, isProtected:()=>false,
  hasDurableEditIntent:witness.hasDurableEditIntent
});

test('actual :24 world-view export refuses incomplete touched-cell history', {skip: producerUnavailable || false},()=>{
  const w=world();
  const witness=createDurableIntentWitness({historyComplete:false});
  const view=createSurfaceBiomeWorldView(w,options(witness));
  assert.ok(view,'producer contract must expose the opt-in view');
  for(let x=500;x<=524;x+=4) for(let z=-12;z<=12;z+=4) {
    const y=terrainHeight(x,z,seed);
    assert.equal(view.get(x,y,z),w.get(x,y,z));
  }
});

test('actual :24 view preserves restored-natural touched cell and rejects stale overlay', {skip: producerUnavailable || false},()=>{
  const w=world();
  const clear=createDurableIntentWitness({historyComplete:true});
  const pristine=createSurfaceBiomeWorldView(w,options(clear));
  assert.ok(pristine);
  let changed=null;
  for(let x=490;x<=534&&!changed;x++) for(let z=-22;z<=22&&!changed;z++) {
    const top=terrainHeight(x,z,seed);
    for(let y=top-2;y<=top+12;y++) {
      if(pristine.get(x,y,z)!==w.get(x,y,z)) {changed={x,y,z};break;}
    }
  }
  assert.ok(changed,'fixed seed should produce at least one source-generated overlay');
  // A restored block can equal natural baseline and leave edits.size === 0.
  const touched=createDurableIntentWitness({historyComplete:true,touchedCells:[changed]});
  const protectedView=createSurfaceBiomeWorldView(w,options(touched));
  assert.ok(protectedView);
  assert.equal(protectedView.get(changed.x,changed.y,changed.z),w.get(changed.x,changed.y,changed.z));
  assert.notEqual(pristine.get(changed.x,changed.y,changed.z),w.get(changed.x,changed.y,changed.z));
  assert.equal(w.edits.size,0,'test must not mutate the authoritative world');
});
