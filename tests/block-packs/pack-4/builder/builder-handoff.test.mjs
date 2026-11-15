import test from 'node:test';
import assert from 'node:assert/strict';
import {
 PACK4_BUILDER_CATALOG,PACK4_BUILDER_FAMILIES,pack4BuildingVariants,
 pack4BuilderAsset,pack4BuilderPlacement,resolvePack4BuilderBlueprint
} from '../../../../src/block-packs/pack-4/builder-handoff.mjs';

test('all 22 builder families and all 23 actual physical IDs are available without duplicates',()=>{
 assert.equal(PACK4_BUILDER_FAMILIES.length,22);
 assert.equal(PACK4_BUILDER_CATALOG.length,23);
 assert.deepEqual(PACK4_BUILDER_CATALOG.map(x=>x.id),Array.from({length:23},(_,i)=>159+i));
 assert.ok(PACK4_BUILDER_CATALOG.every(x=>x.hasRealPhysicalGeometry&&
   x.usableForIsolatedConstruction&&!x.registeredInLiveGame));
 assert.deepEqual(pack4BuildingVariants('pack4:031').map(x=>x.id),[160,161]);
 assert.equal(PACK4_BUILDER_FAMILIES.find(x=>x.ref==='pack4:031').defaultCandidateId,160);
});
test('92 original rotated physical shapes expose real collision, selection and GPU mesh',()=>{
 for(const row of PACK4_BUILDER_CATALOG)for(let r=0;r<4;r++){
  const part=pack4BuilderAsset(row.ref,{candidateId:row.id,rotation:r});
  assert.equal(part.id,row.id);assert.equal(part.rotation,r);
  assert.ok(part.visible.length>0&&part.collision.length>0&&part.selection.length>0);
  assert.ok(part.collision.length<=32&&part.selection.length<=32);
  assert.ok(part.visible.every(p=>p.bounds.length===6&&typeof p.material==='string'));
  assert.equal(part.previewMesh.stride,10);
  assert.ok(part.previewMesh.opaque instanceof Float32Array);
  assert.ok(part.previewMesh.translucent instanceof Float32Array);
  assert.ok((part.previewMesh.opaque.length+part.previewMesh.translucent.length)>0);
  assert.equal(part.registeredInLiveGame,false);
 }
});
test('building-facing compass orientation is the same quarter-turn convention as original Pack4',()=>{
 for(const [facing,turn] of [['north',0],['east',1],['south',2],['west',3]]){
  const cell=pack4BuilderPlacement({at:[10,3,20],asset:'pack4:033',orientation:facing});
  assert.equal(cell.rotation,turn);assert.equal(cell.candidateId,163);
  assert.deepEqual(cell.supportAt,[
   [10,3,21],[9,3,20],[10,3,19],[11,3,20]
  ][turn]);
  assert.deepEqual(cell.state,{id:163,rotation:turn});
 }
});
test('floor, ceiling, opening, and wall mounts are physical and remain independent',()=>{
 assert.deepEqual(pack4BuilderPlacement({at:[4,2,4],asset:'pack4:056'}).supportAt,[4,1,4]);
 assert.deepEqual(pack4BuilderPlacement({at:[4,2,4],asset:'pack4:061'}).supportAt,[4,3,4]);
 assert.equal(pack4BuilderPlacement({at:[4,2,4],asset:'pack4:030'}).supportAt,null);
 assert.deepEqual(pack4BuilderPlacement({at:[4,2,4],asset:'pack4:067',facing:'west'}).supportAt,[5,2,4]);
});
test('real symbolic builder blueprints resolve actual material and mesh with explicit stained-glass choice',()=>{
 const original={id:'r1:house:temperate:small:001',placements:[
  {at:[3,2,1],role:'window',asset:'pack4:030',orientation:'north'},
  {at:[6,2,1],role:'window',asset:'pack4:031',orientation:'east'},
  {at:[4,1,4],role:'furnishing',asset:'pack4:059',orientation:'south'},
  {at:[2,0,2],role:'foundation',asset:'live:wood',orientation:'none'}
 ]};
 const resolved=resolvePack4BuilderBlueprint(original,{
  variantByRef:{'pack4:031':161},
  fixedSupportCells:[[4,0,4]],requireSupport:true
 });
 assert.equal(resolved.resolvedCount,3);
 assert.deepEqual(resolved.placements.map(x=>x.candidateId),[159,161,172]);
 assert.ok(resolved.placements.every(x=>x.supportVerified));
 assert.equal(original.placements[1].candidateId,undefined);
 assert.equal(resolved.registeredInLiveGame,false);
});
test('all 23 pieces can be assembled as construction candidates with explicit fixed mounts',()=>{
 const rows=PACK4_BUILDER_CATALOG.map((a,i)=>({
  at:[10+i*3,4,10],asset:a.ref,candidateId:a.id,
  orientation:['north','east','south','west'][i%4]
 }));
 const supports=rows.map(x=>pack4BuilderPlacement(x).supportAt).filter(Boolean);
 const plan=resolvePack4BuilderBlueprint({id:'settlement:test',cells:rows},{
   fixedSupportCells:supports,requireSupport:true
 });
 assert.equal(plan.resolvedCount,23);
 assert.equal(plan.allMountsSupported,true);
 assert.equal(new Set(plan.placements.map(x=>x.candidateId)).size,23);
});
test('unsupported fixtures, invalid variants and stale IDs fail closed',()=>{
 assert.throws(()=>pack4BuilderAsset('pack4:030',{candidateId:161}),/does not belong/);
 assert.throws(()=>pack4BuilderAsset('pack4:031',{candidateId:255}),/does not belong/);
 assert.throws(()=>pack4BuilderAsset('pack4:999'),/Unrecognized/);
 assert.throws(()=>pack4BuilderAsset('pack4:030',{rotation:'up'}),/facing/);
 assert.throws(()=>pack4BuilderPlacement({at:[1,2,3.5],asset:'pack4:030'}),/safe-integer/);
 assert.throws(()=>resolvePack4BuilderBlueprint({cells:[
  {at:[0,1,0],asset:'pack4:060',orientation:'north'}
 ]},{requireSupport:true}),/Missing real fixed support/);
 assert.throws(()=>resolvePack4BuilderBlueprint({cells:[
  {at:[0,1,0],asset:'pack4:030'},
  {at:[0,1,0],asset:'pack4:031'}
 ]}),/Duplicate/);
});
test('open chimney, fireplace and well-rim collision voids remain real after builder handoff',()=>{
 const occupied=(boxes,p)=>boxes.some(b=>p.every((x,i)=>x>=b[i]&&x<b[i+3]));
 for(const [ref,id,air] of [
  ['pack4:063',176,[.5,.5,.5]],
  ['pack4:064',177,[.5,.52,.26]],
  ['pack4:065',178,[.63,.32,.63]]
 ]){
  const p=pack4BuilderAsset(ref,{candidateId:id,rotation:0});
  assert.equal(occupied(p.collision,air),false,'no fake solid cube for '+ref);
  assert.ok(p.collision.length>0);
 }
});
