import test from 'node:test';
import assert from 'node:assert/strict';
import {resolvePack4BuilderBlueprint} from '../../../../src/block-packs/pack-4/builder-handoff.mjs';

test('Roadmap 2 original voxel records resolve concrete glass, furniture and frame geometry',()=>{
 const blueprint={id:'r2:fixture',extents:{x:9,y:6,z:9},voxels:[
  {x:0,y:3,z:4,material:'pack4:030',kind:'window'},
  {x:8,y:3,z:4,material:'pack4:032',kind:'window'},
  {x:4,y:2,z:4,material:'pack4:058',kind:'fixture'}
 ]};
 const p=resolvePack4BuilderBlueprint(blueprint);
 assert.deepEqual(p.placements.map(x=>x.candidateId),[159,162,171]);
 assert.deepEqual(p.placements.map(x=>x.rotation),[3,1,0]);
 assert.deepEqual(p.placements.map(x=>x.orientationProvenance),
  ['facade-derived','facade-derived','default-preview-only']);
 assert.equal(p.orientationReviewCount,1);
});
test('Roadmap 3 nested [x,y,z,ref] modules resolve hollow chimney and mounted fireplace',()=>{
 const p=resolvePack4BuilderBlueprint({id:'r3:fixture',modules:[
  {role:'structure',cells:[[2,6,3,'pack4:063'],[2,7,3,'pack4:063']]},
  {role:'fixture',cells:[[2,2,3,'pack4:064']]},
  {role:'roof',cells:[[5,9,5,'pack3:023']]}
 ]});
 assert.equal(p.resolvedCount,3);
 assert.deepEqual(p.placements.map(x=>x.candidateId),[176,176,177]);
 assert.equal(p.orientationReviewCount,3);
 assert.ok(p.placements.every(x=>x.physical.collision.length>0));
});
test('pre-existing none/unresolved builder orientation remains visibly unapproved, not an error or fake physical approval',()=>{
 const resolved=resolvePack4BuilderBlueprint({placements:[
  {at:[2,7,3],asset:'pack4:063',orientation:'none'},
  {at:[2,2,3],asset:'pack4:064',orientation:'unresolved'}
 ]});
 assert.equal(resolved.resolvedCount,2);
 assert.equal(resolved.orientationReviewCount,2);
 assert.deepEqual(resolved.placements.map(x=>x.rotation),[0,0]);
 assert.ok(resolved.placements.every(x=>x.orientationRequiresReview));
});
test('Roadmap 4 authored facing and Roadmap 1 authored orientation remain exact',()=>{
 const p=resolvePack4BuilderBlueprint({cells:[
  {at:[0,2,3],asset:'pack4:030',facing:'west'}
 ]});
 const r=resolvePack4BuilderBlueprint({placements:[
  {at:[2,2,0],asset:'pack4:031',orientation:'north'}
 ]},{variantByRef:{'pack4:031':161}});
 assert.equal(p.placements[0].rotation,3);
 assert.equal(r.placements[0].candidateId,161);
 assert.equal(p.orientationReviewCount+r.orientationReviewCount,0);
});
