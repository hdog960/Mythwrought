import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rotateLocalBox,rotateCellOffset,orientedParts,validatePhysicalDescriptor,makePack5Fixture,PACK5_FIXTURE_FORMAT} from '../../../src/block-packs/pack-5/fixture.mjs';
const base=JSON.parse(readFileSync(new URL('../../../src/block-packs/pack-5/manifest.json',import.meta.url)));
const sample=(id='pack5:079',overrides={})=>({symbolicId:id,name:'Synthetic test block',attachment:'floor',
  parts:[{cell:[0,0,0],boxes:[[.1,0,.2,.7,.6,.8]],collisionBoxes:[[.1,0,.2,.7,.6,.8]]}],...overrides});
const bed=sample('pack5:082',{name:'Synthetic two-cell bed',parts:[
  {cell:[0,0,0],boxes:[[.1,.2,.1,.9,.7,.9]],collisionBoxes:[[.1,.2,.1,.9,.7,.9]]},
  {cell:[0,0,1],boxes:[[.1,.2,.1,.9,.5,.9]],collisionBoxes:[[.1,.2,.1,.9,.5,.9]]}]});
test('manifest tracks exactly 18 unique symbolic IDs with independent candidate status',()=>{
  assert.equal(base.entries.length,18);assert.equal(base.completedFamilies,0);assert.equal(base.candidateFamilies,3);assert.equal(base.numericIdAllocation,null);
  assert.deepEqual(base.entries.map(x=>x.roster),Array.from({length:18},(_,i)=>i+79));
  assert.deepEqual(base.entries.map(x=>x.symbolicId),Array.from({length:18},(_,i)=>`pack5:${String(i+79).padStart(3,'0')}`));
  assert.equal(new Set(base.entries.map(x=>x.symbolicId)).size,18);
  for(const e of base.entries){assert.equal(e.status,e.roster<=81?'CANDIDATE':'NOT STARTED');assert.equal(e.persistentNumericId,null);assert.equal(e.integrated,false);}
});
test('unit boxes accept true partial volumes and reject overlaps with empty/invalid geometry',()=>{
  assert.equal(validatePhysicalDescriptor(sample()),true);
  for(const b of [[0,0,0,1,1,2],[0,0,0,0,1,1],[0,0,0,1,NaN,1]])
    assert.throws(()=>validatePhysicalDescriptor(sample('pack5:079',{parts:[{cell:[0,0,0],boxes:[b],collisionBoxes:[b]}]})));
});
test('invalid IDs and numeric allocations are rejected',()=>{
  for(const id of ['pack5:078','pack5:097','biome130:001','pack5:0799'])assert.throws(()=>validatePhysicalDescriptor(sample(id)));
  assert.throws(()=>validatePhysicalDescriptor(sample('pack5:079',{numericId:209})));
  assert.throws(()=>validatePhysicalDescriptor(sample('pack5:079',{integrated:true})));
});
test('one cell cannot appear twice in a descriptor',()=>{
  assert.throws(()=>validatePhysicalDescriptor(sample('pack5:079',{parts:[bed.parts[0],bed.parts[0]]})));
});
test('four rotations preserve exact unit bounds and return identity after quarter turns',()=>{
  const b=[.1,.2,.3,.4,.8,.9];let q=b;
  for(let i=0;i<4;i++)q=rotateLocalBox(q,1);
  assert.ok(q.every((v,i)=>Math.abs(v-b[i])<1e-12));assert.deepEqual(rotateCellOffset([2,1,3],2),[-2,1,-3]);
  assert.deepEqual(orientedParts(bed,1).map(p=>p.cell),[[0,0,0],[-1,0,0]]);
  assert.throws(()=>rotateLocalBox(b,4));
});
test('placement requires actual support and physical cell vacancy',()=>{
  const f=makePack5Fixture([sample()]);
  assert.deepEqual(f.place('pack5:079',[2,4,3]),{ok:false,reason:'Missing attachment'});
  f.setSupport([2,3,3]);assert.equal(f.place('pack5:079',[2,4,3]).ok,true);
  assert.equal(f.place('pack5:079',[2,4,3]).ok,false);assert.equal(f.count(),1);
  assert.deepEqual(f.cell([2,4,3]).anchor,[2,4,3]);
});
test('multi-cell bed reserves both cells, can remove by far end',()=>{
  const f=makePack5Fixture([bed,sample('pack5:083')]);f.setSupport([4,0,4]);
  assert.equal(f.place('pack5:082',[4,1,4]).ok,true);assert.equal(f.cell([4,1,5]).symbolicId,'pack5:082');
  f.setSupport([4,0,5]);assert.equal(f.place('pack5:083',[4,1,5]).ok,false);
  assert.equal(f.remove([4,1,5]),true);assert.equal(f.cell([4,1,4]),null);
  assert.equal(f.cell([4,1,5]),null);
});
test('rotated beds use different occupied cardinal cells without allocating IDs',()=>{
  const f=makePack5Fixture([bed]);f.setSupport([2,-1,2]);
  assert.equal(f.place('pack5:082',[2,0,2],1).ok,true);
  assert.equal(f.cell([1,0,2]).rotation,1);assert.equal(f.cell([2,0,3]),null);
});
test('thin selectables may have no solid cube collision',()=>{
  const rug=sample('pack5:092',{name:'Synthetic flat rug',parts:[{cell:[0,0,0],boxes:[[0,.015,0,1,.035,1]],collisionBoxes:[]}]});
  const f=makePack5Fixture([rug]);f.setSupport([0,-1,0]);assert.equal(f.place('pack5:092',[0,0,0]).ok,true);
  assert.equal(f.collides([0,0,0,1,.3,1]),false);
  assert.equal(f.raycast([.5,1,.5],[0,-1,0])?.symbolicId,'pack5:092');
  assert.equal(f.removeRay([.5,1,.5],[0,-1,0]),true);
});
test('true partial collision does not pretend to occupy entire cube',()=>{
  const f=makePack5Fixture([sample()]);f.setSupport([0,-1,0]);f.place('pack5:079',[0,0,0]);
  assert.equal(f.collides([.2,.1,.3,.3,.3,.4]),true);
  assert.equal(f.collides([.8,.1,.3,.9,.3,.4]),false);
});
test('raycast selects physical union bounds, not empty surrounding unit cube',()=>{
  const f=makePack5Fixture([sample()]);f.setSupport([0,-1,0]);f.place('pack5:079',[0,0,0]);
  assert.equal(f.raycast([.9,.3,-1],[0,0,1],4),null);
  assert.equal(f.raycast([.3,.3,-1],[0,0,1],4)?.symbolicId,'pack5:079');
});
test('wall support rotates to different cardinal face',()=>{
  const wall=sample('pack5:095',{name:'Wall test',attachment:'wall'}),f=makePack5Fixture([wall]);
  f.setSupport([0,0,-1]);assert.equal(f.place('pack5:095',[0,0,0],1).ok,false);
  f.setSupport([1,0,0]);assert.equal(f.place('pack5:095',[0,0,0],1).ok,true);
});
test('ceiling attachment is independent of solid collision',()=>{
  const lamp=sample('pack5:095',{name:'Ceiling fixture',attachment:'ceiling'}),f=makePack5Fixture([lamp]);
  f.setSupport([1,2,1]);assert.equal(f.place('pack5:095',[1,1,1]).ok,true);
});
test('test-only snapshots are deterministic and do NOT have schema-1 field',()=>{
  const f=makePack5Fixture([sample()]);f.setSupport([1,-1,0]);f.setSupport([0,-1,0]);
  f.place('pack5:079',[1,0,0]);f.place('pack5:079',[0,0,0]);
  const snap=f.snapshot();assert.equal(snap.format,PACK5_FIXTURE_FORMAT);assert.equal('schema' in snap,false);
  assert.deepEqual(snap.entries.map(x=>x[0]),[0,1]);
  assert.equal(f.restore(snap),true);assert.deepEqual(f.snapshot(),snap);
});
test('failed restore rolls back atomically and rejects schema-1 payloads',()=>{
  const f=makePack5Fixture([sample()]);f.setSupport([0,-1,0]);f.place('pack5:079',[0,0,0]);
  const prior=f.snapshot();
  assert.throws(()=>f.restore({schema:1,seed:179,edits:[]}));
  assert.throws(()=>f.restore({format:PACK5_FIXTURE_FORMAT,entries:[[1,0,0,'pack5:079',0],[0,0,0,'pack5:079',0]]}));
  assert.deepEqual(f.snapshot(),prior);
});
test('duplicate symbolic identities cannot be registered',()=>{
  assert.throws(()=>makePack5Fixture([sample(),sample()]));
});
