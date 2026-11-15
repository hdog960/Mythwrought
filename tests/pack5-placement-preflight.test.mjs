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

test('registered biome blocks in occupied cells are reported, not misread as invalid legacy IDs',()=>{
  const p=plan(),w=makeWorld();
  for(const s of p.placements[0].physical.requiredSupports)w.put(s);
  const target=p.placements[0].physical.occupiedCells[0];
  w.put(target,256);
  const r=preflightPack5BuilderPlan(p,{world:w.world,
    foreignOccupiedCells:[],existingPack5Cells:[]});
  assert.ok(r.issues.some(i=>i.kind==='registered-world-occupied'));
  assert.equal(r.pack5OnlyDryRunClear,false);
});
test('registered decorative IDs require separately certified support, never generic occupancy',()=>{
  const p=plan(),w=makeWorld();
  const backing=p.placements[0].physical.requiredSupports;
  for(const cell of backing)w.put(cell,312);
  const r=preflightPack5BuilderPlan(p,{
    world:w.world,foreignOccupiedCells:backing,existingPack5Cells:[]});
  assert.ok(r.issues.some(i=>i.kind==='unverified-registered-support'));
  assert.equal(r.pack5OnlyDryRunClear,false);
  const certified=preflightPack5BuilderPlan(p,{
    world:w.world,foreignOccupiedCells:backing,existingPack5Cells:[],
    verifiedStructuralSupports:backing});
  assert.equal(certified.issues.length,0);
  assert.equal(certified.pack5OnlyDryRunClear,true);
  assert.equal(certified.integrationReady,false);
});
test('physical placement refuses unknown registered support until host certifies it',async()=>{
  const {createPack5ConstructionLayer}=await import('../src/pack5-integration/construction-layer.mjs');
  const p=plan(),w=makeWorld(),required=p.placements[0].physical.requiredSupports;
  const keyOf=v=>v.join(','),valid=new Set(required.map(keyOf));
  for(const cell of required)w.put(cell,256);
  let layer=createPack5ConstructionLayer(w.world);
  const opts=[family.symbolicId,[3,5,4],1,family.variants[0]];
  const rejected=layer.place(...opts);
  assert.equal(rejected.ok,false);
  assert.equal(rejected.reason,'Missing world attachment');
  assert.equal(layer.count(),0);
  w.world.pack5StructuralSupport=(cell,id)=>id===256&&valid.has(keyOf(cell));
  layer=createPack5ConstructionLayer(w.world);
  const accepted=layer.place(...opts);
  assert.equal(accepted.ok,true);
  assert.equal(layer.count(),1);
  assert.equal(w.world.get(...required[0]),256);
});

test('registered decorative shapes do not turn into invented full-cube collisions',async()=>{
  const {createPack5ConstructionLayer}=await import('../src/pack5-integration/construction-layer.mjs');
  const w=makeWorld();
  w.put([2,4,0],312);
  w.world.pack5StructuralSupport=()=>true;
  const layer=createPack5ConstructionLayer(w.world);
  assert.equal(layer.collides([2.1,4.1,.1,2.9,4.9,.9]),false);
  assert.equal(layer.collidesPack5([2.1,4.1,.1,2.9,4.9,.9]),false);
  assert.equal(layer.count(),0);
});

test('overhanging external source geometry is detected independently of coarse cell occupancy',()=>{
  const p=plan(),w=makeWorld(),rec=p.placements[0];
  for(const s of rec.physical.requiredSupports)w.put(s);
  const b=rec.physical.collision[0];
  assert.ok(b,'Pack 5 physical fixture has a real collision box');
  const foreign=[[b[0]+.01,b[1]+.01,b[2]+.01,
    Math.min(b[3],b[0]+.08),Math.min(b[4],b[1]+.08),Math.min(b[5],b[2]+.08)]];
  const at=rec.physical.occupiedCells[0];
  const otherCell=[at[0]+3,at[1],at[2]];
  const coarse=preflightPack5BuilderPlan(p,{
    world:w.world,foreignOccupiedCells:[otherCell],existingPack5Cells:[]});
  assert.equal(coarse.pack5OnlyDryRunClear,true);
  assert.equal(coarse.shapeAwareDryRunClear,false);
  const exact=preflightPack5BuilderPlan(p,{
    world:w.world,foreignOccupiedCells:[otherCell],existingPack5Cells:[],
    foreignCollisionBoxes:foreign,existingPack5CollisionBoxes:[]});
  assert.ok(exact.issues.some(i=>i.kind==='foreign-shape-overlap'));
  assert.equal(exact.shapeAwareDryRunClear,false);
  assert.equal(exact.integrationReady,false);
});
test('placed Pack 5 objects can supply exact read-only existing collider boxes',async()=>{
  const {createPack5ConstructionLayer}=await import('../src/pack5-integration/construction-layer.mjs');
  const {collectPack5PlacedCollisionBoxes}=await import('../src/pack5-integration/placement-preflight.mjs');
  const p=plan(),w=makeWorld(),rec=p.placements[0];
  for(const at of rec.physical.requiredSupports)w.put(at);
  const layer=createPack5ConstructionLayer(w.world);
  assert.equal(layer.place(rec.asset,rec.anchor,rec.rotation,rec.variant).ok,true);
  const boxes=collectPack5PlacedCollisionBoxes(layer);
  assert.ok(boxes.length>0&&Object.isFrozen(boxes)&&boxes.every(Object.isFrozen));
  const result=preflightPack5BuilderPlan(p,{
    world:w.world,foreignOccupiedCells:[],existingPack5Cells:[],
    foreignCollisionBoxes:[],existingPack5CollisionBoxes:boxes});
  assert.ok(result.issues.some(i=>i.kind==='existing-pack5-shape-overlap'));
  assert.equal(result.shapeAwareDryRunClear,false);
  assert.equal(layer.count(),1);
});
test('shape-aware clearance fails closed when either independent collider registry is omitted',()=>{
  const p=plan(),w=makeWorld();
  for(const s of p.placements[0].physical.requiredSupports)w.put(s);
  const coarse=preflightPack5BuilderPlan(p,{world:w.world,
    foreignOccupiedCells:[],existingPack5Cells:[]});
  assert.equal(coarse.pack5OnlyDryRunClear,true);
  assert.equal(coarse.shapeAwareDryRunClear,false);
  const partial=preflightPack5BuilderPlan(p,{world:w.world,
    foreignOccupiedCells:[],existingPack5Cells:[],foreignCollisionBoxes:[]});
  assert.equal(partial.shapeAwareDryRunClear,false);
  const complete=preflightPack5BuilderPlan(p,{world:w.world,
    foreignOccupiedCells:[],existingPack5Cells:[],foreignCollisionBoxes:[],
    existingPack5CollisionBoxes:[]});
  assert.equal(complete.shapeAwareDryRunClear,true);
  assert.equal(complete.integrationReady,false);
  assert.equal(complete.crossPackPhysicalAcceptance,false);
});
test('malformed or excessive external boxes fail closed before shape planning',()=>{
  const p=plan(),w=makeWorld();
  assert.throws(()=>preflightPack5BuilderPlan(p,{world:w.world,
    foreignCollisionBoxes:[[0,0,0,5000,2,2]]}),/bounded spatial proof/);
  assert.throws(()=>preflightPack5BuilderPlan(p,{world:w.world,
    foreignCollisionBoxes:[[0,0,0,NaN,1,1]]}),/Invalid source-external/);
});
test('declared future supports without corresponding foreign occupied cells cannot pass',()=>{
  const p=plan(),w=makeWorld(),supports=p.placements[0].physical.requiredSupports;
  const missing=preflightPack5BuilderPlan(p,{world:w.world,
    foreignOccupiedCells:[],existingPack5Cells:[],verifiedStructuralSupports:supports,
    foreignCollisionBoxes:[],existingPack5CollisionBoxes:[]});
  assert.ok(missing.issues.some(i=>i.kind==='certified-support-not-occupied'));
  assert.equal(missing.shapeAwareDryRunClear,false);
  const supplied=preflightPack5BuilderPlan(p,{world:w.world,
    foreignOccupiedCells:supports,existingPack5Cells:[],
    verifiedStructuralSupports:supports,foreignCollisionBoxes:[],
    existingPack5CollisionBoxes:[]});
  assert.equal(supplied.issues.length,0);
  assert.equal(supplied.shapeAwareDryRunClear,true);
  assert.equal(supplied.integrationReady,false);
});

test('owned-layer wrapper derives exact existing occupancy and collision inputs from the same sidecar',async()=>{
  const {preflightPack5BuilderAgainstOwnedLayer}=await import('../src/pack5-integration/placement-preflight.mjs');
  const {createPack5ConstructionLayer}=await import('../src/pack5-integration/construction-layer.mjs');
  const w=makeWorld(),layer=createPack5ConstructionLayer(w.world),p=plan(),rec=p.placements[0];
  for(const s of rec.physical.requiredSupports)w.put(s);
  assert.equal(layer.place(rec.asset,rec.anchor,rec.rotation,rec.variant).ok,true);
  const saved=JSON.stringify(layer.snapshot());
  const result=preflightPack5BuilderAgainstOwnedLayer(p,{
    world:w.world,existingLayer:layer,
    foreignOccupiedCells:[],foreignCollisionBoxes:[]
  });
  assert.equal(result.existingPack5SourceVerified,true);
  assert.ok(result.existingPack5CollisionBoxCount>0);
  assert.ok(result.existingPack5OccupiedCellCount>0);
  assert.ok(result.issues.some(i=>i.kind==='existing-pack5-occupied'));
  assert.ok(result.issues.some(i=>i.kind==='existing-pack5-shape-overlap'));
  assert.equal(result.shapeAwareDryRunClear,false);
  assert.equal(result.integrationReady,false);
  assert.equal(JSON.stringify(layer.snapshot()),saved,'Read-only preflight changed sidecar');
});
test('owned-layer wrapper clears a separate furnished room but keeps global release gates false',async()=>{
  const {preflightPack5BuilderAgainstOwnedLayer}=await import('../src/pack5-integration/placement-preflight.mjs');
  const {createPack5ConstructionLayer}=await import('../src/pack5-integration/construction-layer.mjs');
  const w=makeWorld(),layer=createPack5ConstructionLayer(w.world);
  const b=plan().placements[0];
  for(const s of b.physical.requiredSupports)w.put(s);
  assert.equal(layer.place(b.asset,b.anchor,b.rotation,b.variant).ok,true);
  const {planPack5BuilderBlueprint}=await import('../src/pack5-integration/blueprint-handoff.mjs');
  const candidate=planPack5BuilderBlueprint({placements:[{
    asset:b.asset,at:[45,5,45],orientation:b.rotation,variant:b.variant
  }]});
  for(const s of candidate.placements[0].physical.requiredSupports)w.put(s);
  const r=preflightPack5BuilderAgainstOwnedLayer(candidate,{
    world:w.world,existingLayer:layer,foreignOccupiedCells:[],foreignCollisionBoxes:[]
  });
  assert.equal(r.shapeAwareDryRunClear,true);
  assert.equal(r.existingPack5CollisionBoxCount,0);
  assert.equal(r.integrationReady,false);
  assert.equal(r.crossPackPhysicalAcceptance,false);
});
test('owned-layer preflight refuses cross-seed worlds and oversized multi-building regions',async()=>{
  const {preflightPack5BuilderAgainstOwnedLayer}=await import('../src/pack5-integration/placement-preflight.mjs');
  const {createPack5ConstructionLayer}=await import('../src/pack5-integration/construction-layer.mjs');
  const {planPack5BuilderBlueprint}=await import('../src/pack5-integration/blueprint-handoff.mjs');
  const w=makeWorld(),layer=createPack5ConstructionLayer(w.world),p=plan();
  assert.throws(()=>preflightPack5BuilderAgainstOwnedLayer(p,{
    world:{...w.world,seed:999},existingLayer:layer,foreignOccupiedCells:[],
    foreignCollisionBoxes:[]
  }),/cross-seed/);
  const f=PACK5_BUILDER_CATALOG.find(x=>x.symbolicId==='pack5:080');
  const spread=planPack5BuilderBlueprint({placements:[
    {asset:f.symbolicId,at:[0,5,0],orientation:0,variant:f.variants[0]},
    {asset:f.symbolicId,at:[300,5,0],orientation:0,variant:f.variants[1]}
  ]});
  assert.throws(()=>preflightPack5BuilderAgainstOwnedLayer(spread,{
    world:w.world,existingLayer:layer,foreignOccupiedCells:[],
    foreignCollisionBoxes:[]
  }),/region too large/);
});
