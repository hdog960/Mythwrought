import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rotateLocalBox,rotateCellOffset,orientedParts,validatePhysicalDescriptor,makePack5Fixture,PACK5_FIXTURE_FORMAT} from '../../../src/block-packs/pack-5/fixture.mjs';
import {SPECIALTY_FIXTURES,SPECIALTY_FAMILIES,SPECIALTY_PALETTE,SPECIALTY_VARIANTS,getSpecialtyFixture,specialtyBoxMesh} from '../../../src/block-packs/pack-5/fortified-specialties.mjs';
const base=JSON.parse(readFileSync(new URL('../../../src/block-packs/pack-5/manifest.json',import.meta.url)));
const sample=(id='pack5:079',overrides={})=>({symbolicId:id,name:'Synthetic test block',attachment:'floor',
  parts:[{cell:[0,0,0],boxes:[[.1,0,.2,.7,.6,.8]],collisionBoxes:[[.1,0,.2,.7,.6,.8]]}],...overrides});
const bed=sample('pack5:082',{name:'Synthetic two-cell bed',parts:[
  {cell:[0,0,0],boxes:[[.1,.2,.1,.9,.7,.9]],collisionBoxes:[[.1,.2,.1,.9,.7,.9]]},
  {cell:[0,0,1],boxes:[[.1,.2,.1,.9,.5,.9]],collisionBoxes:[[.1,.2,.1,.9,.5,.9]]}]});
test('manifest tracks exactly 18 unique symbolic IDs with independent candidate status',()=>{
  assert.equal(base.entries.length,18);assert.equal(base.completedFamilies,0);assert.equal(base.candidateFamilies,18);assert.equal(base.numericIdAllocation,null);
  assert.deepEqual(base.entries.map(x=>x.roster),Array.from({length:18},(_,i)=>i+79));
  assert.deepEqual(base.entries.map(x=>x.symbolicId),Array.from({length:18},(_,i)=>`pack5:${String(i+79).padStart(3,'0')}`));
  assert.equal(new Set(base.entries.map(x=>x.symbolicId)).size,18);
  for(const e of base.entries){assert.equal(e.status,e.roster<=96?'CANDIDATE':'NOT STARTED');assert.equal(e.persistentNumericId,null);assert.equal(e.integrated,false);}
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
  const f=makePack5Fixture([bed,sample('pack5:083')]);f.setSupport([4,0,4]);f.setSupport([4,0,5]);
  assert.equal(f.place('pack5:082',[4,1,4]).ok,true);assert.equal(f.cell([4,1,5]).symbolicId,'pack5:082');
  f.setSupport([4,0,5]);assert.equal(f.place('pack5:083',[4,1,5]).ok,false);
  assert.equal(f.remove([4,1,5]),true);assert.equal(f.cell([4,1,4]),null);
  assert.equal(f.cell([4,1,5]),null);
});
test('rotated beds use different occupied cardinal cells without allocating IDs',()=>{
  const f=makePack5Fixture([bed]);f.setSupport([2,-1,2]);f.setSupport([1,-1,2]);
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

test('M5 has three original symbolic physical families, two nonidentical geometry variants each',()=>{
  assert.deepEqual(SPECIALTY_FAMILIES.map(x=>x.symbolicId),['pack5:094','pack5:095','pack5:096']);
  assert.equal(SPECIALTY_FIXTURES.length,6);
  assert.equal(new Set(SPECIALTY_FIXTURES.map(x=>JSON.stringify(x.parts))).size,6);
});
test('M5 parts are true box colliders and never allocate IDs or gameplay mechanisms',()=>{
  for(const d of SPECIALTY_FIXTURES){validatePhysicalDescriptor(d);assert.equal(d.numericId,undefined);assert.equal(d.integrated,false);
    for(const k of ['opening','lighting','water','inventory','animals'])assert.equal(d[k],false);
    for(const p of d.parts){assert.ok(p.boxes.length>8&&p.boxes.length<=64);assert.deepEqual(p.boxes,p.collisionBoxes);}
  }
});
test('citadel and portcullis require floor support beneath both real gate cells',()=>{
  const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([2,-1,2]);
  assert.deepEqual(f.place('pack5:094',[2,0,2],0,'citadel-ironbound-leaves'),{ok:false,reason:'Missing attachment'});
  f.setSupport([3,-1,2]);assert.equal(f.place('pack5:094',[2,0,2],0,'citadel-ironbound-leaves').ok,true);
  assert.equal(f.cell([3,0,2]).symbolicId,'pack5:094');assert.equal(f.remove([3,0,2]),true);assert.equal(f.count(),0);
});
test('rotated portcullis reserves rotated adjacent cell and leaves true air gaps between iron bars',()=>{
  const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([0,-1,0]);f.setSupport([0,-1,1]);
  assert.equal(f.place('pack5:094',[0,0,0],1,'falling-portcullis-grille').ok,true);
  assert.equal(f.cell([0,0,1]).rotation,1);
  assert.equal(f.remove([0,0,1]),true);assert.equal(f.count(),0);
  const g=makePack5Fixture(SPECIALTY_FAMILIES);g.setSupport([0,-1,0]);g.setSupport([1,-1,0]);
  g.place('pack5:094',[0,0,0],0,'falling-portcullis-grille');
  assert.equal(g.collides([.115,.43,.45,.15,.54,.54]),true);
  assert.equal(g.collides([.35,.44,.45,.39,.50,.53]),false);
});
test('ironbound heavy gate occupies its solid plank area and is fully removed by ray',()=>{
  const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([0,-1,0]);f.setSupport([1,-1,0]);
  f.place('pack5:094',[0,0,0],0,'citadel-ironbound-leaves');
  assert.equal(f.collides([.35,.44,.45,.39,.50,.53]),true);
  assert.equal(f.raycast([1.5,.5,3],[0,0,-1])?.symbolicId,'pack5:094');
  assert.equal(f.removeRay([1.5,.5,3],[0,0,-1]),true);assert.equal(f.count(),0);
});
test('both original chandeliers require ceiling above anchor, never floor or lighting state',()=>{
  const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([1,-1,2]);
  assert.deepEqual(f.place('pack5:095',[1,0,2],0,'suncrown-eightarm'),{ok:false,reason:'Missing attachment'});
  f.setSupport([1,1,2]);assert.equal(f.place('pack5:095',[1,0,2],0,'suncrown-eightarm').ok,true);
  assert.equal(f.raycast([1.5,1.8,2.5],[0,-1,0])?.symbolicId,'pack5:095');
  assert.equal(getSpecialtyFixture('pack5:095','prismatic-starrack').lighting,false);
});
test('chandelier arm geometries have separate candles and crystal droplets',()=>{
  const a=getSpecialtyFixture('pack5:095','suncrown-eightarm');
  const b=getSpecialtyFixture('pack5:095','prismatic-starrack');
  assert.ok(a.art[0].details.filter(x=>x.material==='linen').length>=6);
  assert.ok(b.art[0].details.filter(x=>x.material==='crystal').length>=4);
});
test('stable partition is two floor-supported cells with opaque kickboard below open upper rails',()=>{
  const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([0,-1,0]);
  assert.equal(f.place('pack5:096',[0,0,0],0,'oak-stall-divider').ok,false);
  f.setSupport([0,-1,1]);assert.equal(f.place('pack5:096',[0,0,0],0,'oak-stall-divider').ok,true);
  assert.equal(f.collides([.45,.2,.30,.55,.29,.39]),true);
  assert.equal(f.collides([.2,.55,.3,.3,.64,.39]),false);
  assert.equal(f.remove([0,0,1]),true);assert.equal(f.count(),0);
});
test('dry feeding trough has modeled exterior slats and solid bottom but empty central basin',()=>{
  const t=getSpecialtyFixture('pack5:096','stone-feed-trough');
  assert.ok(t.art[0].details.filter(x=>x.material==='cedar').length>=8);
  const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([0,-1,0]);f.place('pack5:096',[0,0,0],0,'stone-feed-trough');
  assert.equal(f.collides([.4,.4,.4,.6,.55,.6]),false);
  assert.equal(f.collides([.4,.13,.4,.6,.17,.6]),true);
  assert.ok(f.raycast([.5,1.8,.5],[0,-1,0])?.distance>1.55);
});
test('all six specialty variants preserve bounded geometry and both outward triangles per quad over four rotations',()=>{
  const axes=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  for(const d of SPECIALTY_FIXTURES)for(let r=0;r<4;r++){
    const mesh=specialtyBoxMesh(d,{rotation:r});
    const boxes=d.parts.reduce((n,p)=>n+p.boxes.length,0);
    assert.equal(mesh.triangles,boxes*12);assert.ok(mesh.vertexCount<=6144);
    assert.deepEqual(orientedParts(d,r).map(p=>p.collisionBoxes.length),d.parts.map(p=>p.boxes.length));
    for(let q=0;q<mesh.vertexCount;q+=4){
      const P=i=>Array.from(mesh.positions.subarray(3*(q+i),3*(q+i+1)));
      const p=[P(0),P(1),P(2),P(3)],normal=(a,b,c)=>{
        const u=p[b].map((v,k)=>v-p[a][k]),v=p[c].map((x,k)=>x-p[a][k]);
        return [u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
      };
      const axis=axes[(q/4)%6],dot=n=>n.reduce((sum,v,k)=>sum+v*axis[k],0);
      assert.ok(dot(normal(0,1,2))>1e-10);assert.ok(dot(normal(0,2,3))>1e-10);
    }
  }
});
test('M5 ceiling, two-cell gates and trough variants restore atomically in test-only snapshots',()=>{
  const f=makePack5Fixture(SPECIALTY_FAMILIES);
  for(const c of [[0,-1,0],[0,-1,1],[4,1,0],[7,-1,0]])f.setSupport(c);
  assert.equal(f.place('pack5:094',[0,0,0],1,'falling-portcullis-grille').ok,true);
  assert.equal(f.place('pack5:095',[4,0,0],2,'prismatic-starrack').ok,true);
  assert.equal(f.place('pack5:096',[7,0,0],3,'stone-feed-trough').ok,true);
  const before=f.snapshot();assert.equal(before.entries.length,3);assert.equal(before.schema,undefined);
  f.restore(structuredClone(before));assert.deepEqual(f.snapshot(),before);
  assert.throws(()=>f.restore({format:before.format,entries:[[0,0,0,'pack5:095',0,'invalid']] }));
  assert.deepEqual(f.snapshot(),before);
});
test('all 18 symbolic candidate families remain outside registry with production saves untouched',()=>{
  assert.equal(base.entries.length,18);assert.equal(base.candidateFamilies,18);assert.equal(base.completedFamilies,0);
  assert.ok(base.entries.every(e=>e.status==='CANDIDATE'&&e.persistentNumericId===null&&e.integrated===false));
  assert.equal(base.numericIdAllocation,null);
});
