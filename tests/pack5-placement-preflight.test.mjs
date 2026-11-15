import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../src/voxel.mjs';
import {PACK5_BUILDER_CATALOG} from '../src/pack5-integration/catalog.mjs';
import {planPack5BuilderBlueprint} from '../src/pack5-integration/blueprint-handoff.mjs';
import {preflightPack5BuilderPlan} from '../src/pack5-integration/placement-preflight.mjs';

const makeWorld=()=>{
  const blocks=new Map();
  const world={seed:731,edits:blocks,get(x,y,z){
    return blocks.get([x,y,z].join(','))??BLOCK.AIR;
  }};
  return {world,blocks,put(at,id=BLOCK.STONE){
    blocks.set(at.join(','),id);
  }};
};
const family=PACK5_BUILDER_CATALOG.find(f=>f.attachment==='floor');
assert.ok(family,'Expected at least one Pack 5 floor attachment');
const cellKey=v=>v.join(',');
function plan(){
  return planPack5BuilderBlueprint({id:'pack5:preflight',placements:[{
    asset:family.symbolicId,at:[3,5,4],variant:family.variants[0],
    orientation:'east'
  }]});
}
test('dry-run reproduces exact source geometry and passes when all legacy supports exist',()=>{
  const p=plan(),w=makeWorld();
  for(const s of p.placements[0].physical.requiredSupports)w.put(s);
  const before=JSON.stringify([...w.blocks]);
  const result=preflightPack5BuilderPlan(p,{
    world:w.world,foreignOccupiedCells:[],existingPack5Cells:[]});
  assert.equal(result.pack5OnlyDryRunClear,true);
  assert.equal(result.issues.length,0);
  assert.equal(result.verifiedForeignOccupancy,true);
  assert.equal(result.placementCount,1);
  assert.ok(result.occupiedCellChecks>=1&&result.supportCellChecks>=1);
  assert.equal(result.integrationReady,false);
  assert.equal(result.crossPackPhysicalAcceptance,false);
  assert.equal(JSON.stringify([...w.blocks]),before);
});
test('missing structural backing remains unresolved, even if an external pack occupies that cell',()=>{
  const p=plan(),w=makeWorld();
  const support=p.placements[0].physical.requiredSupports[0];
  const r=preflightPack5BuilderPlan(p,{world:w.world,foreignOccupiedCells:[support]});
  assert.ok(r.issues.some(i=>i.kind==='unverified-support'&&cellKey(i.cell)===cellKey(support)));
  assert.equal(r.pack5OnlyDryRunClear,false);
  assert.equal(r.integrationReady,false);
});
test('read-only preflight flags legacy and foreign occupancy without altering either',()=>{
  const p=plan(),w=makeWorld(),at=p.placements[0].physical.occupiedCells[0];
  for(const s of p.placements[0].physical.requiredSupports)w.put(s);
  w.put(at);
  const before=JSON.stringify([...w.blocks]);
  const r=preflightPack5BuilderPlan(p,{
    world:w.world,foreignOccupiedCells:[at],existingPack5Cells:[at]});
  assert.ok(r.issues.some(i=>i.kind==='legacy-occupied'));
  assert.ok(r.issues.some(i=>i.kind==='foreign-pack-occupied'));
  assert.ok(r.issues.some(i=>i.kind==='existing-pack5-occupied'));
  assert.equal(r.pack5OnlyDryRunClear,false);
  assert.equal(JSON.stringify([...w.blocks]),before);
});
test('tampered source physical geometry is rejected instead of trusted by the building integrator',()=>{
  const p=plan(),w=makeWorld();
  const original=p.placements[0];
  const bad={...original,physical:{...original.physical,
    occupiedCells:[[900,900,900]]}};
  const modified={...p,placements:[bad]};
  assert.throws(()=>preflightPack5BuilderPlan(modified,{world:w.world}),/differs from source/);
});
test('out-of-bounds placements are diagnosed and no save or ID allocation occurs',()=>{
  const bp=planPack5BuilderBlueprint({placements:[{
    asset:family.symbolicId,at:[1,30,1],
    variant:family.variants[0],orientation:'north'}]});
  const r=preflightPack5BuilderPlan(bp,{world:makeWorld().world});
  assert.ok(r.issues.some(i=>i.kind==='out-of-world-bounds'));
  assert.equal(r.globalNumericIdsAssigned,false);
  assert.equal(r.saveWritten,false);
});
test('up to 36 mixed authored variants can be preflighted without cross-pack ownership claims',()=>{
  const w=makeWorld(),placements=[];
  for(let i=0;i<PACK5_BUILDER_CATALOG.length*2;i++){
    const f=PACK5_BUILDER_CATALOG[Math.floor(i/2)];
    placements.push({asset:f.symbolicId,at:[i*8,5,0],variant:f.variants[i%2],
      orientation:i%4});
  }
  const p=planPack5BuilderBlueprint({placements});
  for(const rec of p.placements)
    for(const at of rec.physical.requiredSupports)w.put(at);
  const r=preflightPack5BuilderPlan(p,{world:w.world,
    foreignOccupiedCells:[],existingPack5Cells:[]});
  assert.equal(r.issues.length,0);
  assert.equal(r.placementCount,36);
  assert.ok(r.occupiedCellChecks>=36);
  assert.equal(r.crossPackPhysicalAcceptance,false);
  assert.equal(r.integrationReady,false);
});

test('omitted external occupancy indexes never become an implied cross-pack clearance',()=>{
  const p=plan(),w=makeWorld();
  for(const s of p.placements[0].physical.requiredSupports)w.put(s);
  const noRegistry=preflightPack5BuilderPlan(p,{world:w.world});
  assert.equal(noRegistry.issues.length,0);
  assert.equal(noRegistry.verifiedForeignOccupancy,false);
  assert.equal(noRegistry.verifiedExistingPack5Occupancy,false);
  assert.equal(noRegistry.pack5OnlyDryRunClear,false);
  const oneRegistry=preflightPack5BuilderPlan(p,{world:w.world,foreignOccupiedCells:[]});
  assert.equal(oneRegistry.pack5OnlyDryRunClear,false);
  const both=preflightPack5BuilderPlan(p,{
    world:w.world,foreignOccupiedCells:[],existingPack5Cells:[]});
  assert.equal(both.pack5OnlyDryRunClear,true);
  assert.equal(both.integrationReady,false);
});
