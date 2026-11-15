import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK1_BUILDER_CATALOG} from '../../../src/block-packs/pack-1/builder-handoff.mjs';
import {inspectPack1Construction,removePack1Construction} from '../../../src/block-packs/pack-1/construction-stress.mjs';
import {PACK1_BUILDER_SYMBOLS,PACK1_BUILDER_IDS,PACK1_BUILDER_AVAILABILITY,
  resolvePack1BuilderAsset,planPack1BuilderStructure,
  compilePack1BuilderSnapshot} from '../../../src/block-packs/pack-1/structure-handoff.mjs';
// The source-pinned candidate runner intentionally checks out Pack 1-owned files
// only. Verify the shared, documented {boxes:[unit-cell AABB]} ABI by value;
// true shared-runtime validation remains a separate coordinated integration gate.
const validateShape=shape=>!!shape&&Array.isArray(shape.boxes)&&
  shape.boxes.length>0&&shape.boxes.length<=32&&shape.boxes.every(b=>
    Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
    [0,1,2].every(i=>b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1));

test('source-authoritative builder ABI maps 21 roster families to 30 unique physical IDs',()=>{
  assert.equal(PACK1_BUILDER_SYMBOLS.length,21);
  assert.deepEqual(PACK1_BUILDER_IDS,Array.from({length:30},(_,i)=>9+i));
  assert.equal(PACK1_BUILDER_AVAILABILITY.worldPlacement,false);
  assert.equal(PACK1_BUILDER_AVAILABILITY.liveGameRegistry,false);
  assert.equal(PACK1_BUILDER_AVAILABILITY.physicalIPhoneVerified,false);
  for(const d of PACK1_BUILDER_CATALOG){
    const resolved=resolvePack1BuilderAsset(d.symbolicRef,'north',{candidateId:d.id});
    assert.equal(resolved.blockId,d.id);
    assert.equal(resolved.livePlaceable,false);
    assert.equal(resolved.parts.length,resolved.shape.boxes.length);
    assert.ok(validateShape(resolved.shape));
  }
});
test('source builder bridge understands actual cardinal builder orientations and fails closed on ambiguous families',()=>{
  const stair=resolvePack1BuilderAsset('pack1:008','west');
  assert.equal(stair.blockId,16);
  assert.equal(stair.yaw,3);
  assert.ok(stair.requiresOrientationSidecar);
  const upper=resolvePack1BuilderAsset('pack1:008','south',{variant:'upper'});
  assert.equal(upper.yaw,2);assert.equal(upper.requiresVariantPersistence,true);
  assert.throws(()=>resolvePack1BuilderAsset('pack1:053'),/Ambiguous/);
  assert.equal(resolvePack1BuilderAsset('pack1:053','north',{candidateId:33}).blockId,33);
  assert.throws(()=>resolvePack1BuilderAsset('pack1:053','north',{candidateId:36}),/not part/);
  assert.throws(()=>resolvePack1BuilderAsset('pack1:008','up'),/orientation/);
});
test('real part geometry is translated into world-space multi-family blueprint without world edits',()=>{
  const plan=planPack1BuilderStructure([
    {asset:'pack1:001',at:[0,0,0]},
    {asset:'pack1:008',at:[1,0,0],orientation:'east',variant:'upper'},
    {asset:'pack1:053',candidateId:35,at:[2,0,0]},
    {asset:'pack1:054',candidateId:37,at:[3,0,0]}
  ],{origin:[100,5,-12]});
  assert.equal(plan.cells.length,4);
  assert.equal(plan.cells[1].blockId,16);
  assert.equal(plan.cells[1].yaw,1);
  assert.equal(plan.cells[1].requiresVariantPersistence,true);
  assert.deepEqual(plan.cells[0].at,[100,5,-12]);
  assert.equal(plan.worldBoxes.length,
    plan.cells.reduce((n,c)=>n+resolvePack1BuilderAsset(c.asset,c.yaw,{candidateId:c.blockId,variant:c.variant}).parts.length,0));
  assert.ok(plan.worldBoxes.every(p=>p.box.length===6&&p.box.every(Number.isFinite)));
  assert.equal(plan.livePlaced,false);assert.equal(plan.saveWritten,false);
});
test('builder blueprint compiles to isolated schema-1 save preview preserving current biome rotations',()=>{
  const original={schema:1,seed:179,
    edits:[[10,4,0,256],[11,4,0,315],[12,4,0,8]],
    rotations:[[10,4,0,1],[11,4,0,3]]};
  const before=JSON.stringify(original);
  const blueprint=planPack1BuilderStructure([
    {asset:'pack1:001',at:[0,0,0]},
    {asset:'pack1:008',at:[1,0,0],orientation:'west',variant:'upper'},
    {asset:'pack1:053',candidateId:34,at:[2,0,0]}
  ],{origin:[20,4,0]});
  const bundle=compilePack1BuilderSnapshot(blueprint,{existingSave:original});
  const result=inspectPack1Construction(JSON.parse(JSON.stringify(bundle)));
  assert.equal(result.pack1Count,3);assert.equal(result.otherCount,3);
  assert.deepEqual(bundle.world.rotations,original.rotations);
  assert.deepEqual(bundle.pack1State.turns,[{cell:[21,4,0],blockId:16,turns:3}]);
  assert.deepEqual(bundle.pack1State.variants,[{cell:[21,4,0],blockId:16,variant:'upper'}]);
  assert.equal(JSON.stringify(original),before);
  const removed=removePack1Construction(bundle,[21,4,0]);
  assert.equal(inspectPack1Construction(removed).pack1Count,2);
  assert.deepEqual(removed.world.rotations,original.rotations);
});
test('wall-mounted vines require supported cubes in simulated blueprint, not just a decorative preview',()=>{
  const blueprint=planPack1BuilderStructure([
    {asset:'pack1:001',at:[0,0,0]},
    {asset:'pack1:052',candidateId:27,at:[1,0,0],wallFace:'west'}
  ],{origin:[40,8,20]});
  assert.equal(blueprint.cells[1].requiresSupportValidation,true);
  assert.equal(inspectPack1Construction(compilePack1BuilderSnapshot(blueprint)).pack1Count,2);
  const unsupported=planPack1BuilderStructure([
    {asset:'pack1:052',candidateId:27,at:[1,0,0],wallFace:'west'}
  ],{origin:[40,8,20]});
  assert.throws(()=>compilePack1BuilderSnapshot(unsupported),/supporting cube/);
  assert.throws(()=>planPack1BuilderStructure([
    {asset:'pack1:052',candidateId:27,at:[1,0,0]}
  ]),/supporting face/);
});
test('blueprint rejects duplicate coordinates, invalid offsets, unknown symbols and unsupported orientations',()=>{
  assert.throws(()=>planPack1BuilderStructure([
    {asset:'pack1:001',at:[0,0,0]},{asset:'pack1:002',at:[0,0,0]}
  ]),/Duplicate/);
  assert.throws(()=>planPack1BuilderStructure([{asset:'pack1:001',at:[0,0,0]}],{origin:[1000001,0,0]}),/Invalid/);
  assert.throws(()=>planPack1BuilderStructure([{asset:'pack1:001',at:[.2,0,0]}]),/local cell/);
  assert.throws(()=>planPack1BuilderStructure([{asset:'pack2:001',at:[0,0,0]}]),/Unknown/);
  assert.throws(()=>planPack1BuilderStructure([{asset:'pack1:001',at:[0,0,0],orientation:'up'}]),/orientation/);
  assert.throws(()=>planPack1BuilderStructure([{asset:'pack1:001',at:[0,0,0],wallFace:'west'}]),/non-mounted/);
  assert.throws(()=>planPack1BuilderStructure([{asset:'pack1:001',at:[0,0,0]}],{maxCells:0}),/blueprint/);
  assert.throws(()=>compilePack1BuilderSnapshot({kind:'not-pack1',cells:[]}),/valid Pack 1/);
});
test('256-cell multi-room preview keeps exact geometry, occupancy and save state without register/deploy',()=>{
  const placements=[];
  let n=0;
  const choices=PACK1_BUILDER_CATALOG.filter(x=>x.support==='none');
  for(let z=0;z<16;z++)for(let x=0;x<16;x++){
    const id=choices[(n*3)%choices.length].id;
    const e=choices[(n*3)%choices.length];
    placements.push({asset:e.symbolicRef,candidateId:id,at:[x,0,z],
      orientation:n%4,variant:id===15&&n%3===0?'upper':'lower'});
    n++;
  }
  const plan=planPack1BuilderStructure(placements,{origin:[32,5,32]});
  assert.equal(plan.cells.length,256);
  const snapshot=compilePack1BuilderSnapshot(plan,{seed:179});
  const check=inspectPack1Construction(JSON.parse(JSON.stringify(snapshot)));
  assert.equal(check.pack1Count,256);
  assert.ok(plan.worldBoxes.length>256);
  assert.equal(plan.livePlaced,false);
  assert.equal(plan.saveWritten,false);
  assert.equal(plan.requiresSharedEngineRegistration,true);
});
