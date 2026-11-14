import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validatePhysicalDescriptor,makePack5Fixture,orientedParts} from '../../../src/block-packs/pack-5/fixture.mjs';
import {RESIDENTIAL_PALETTE,RESIDENTIAL_VARIANTS,RESIDENTIAL_FURNITURE,RESIDENTIAL_FAMILIES,getResidentialFurniture,furnitureBoxMesh} from '../../../src/block-packs/pack-5/residential-furnishings.mjs';
const ids=['pack5:082','pack5:083','pack5:084','pack5:085'];
const manifest=JSON.parse(readFileSync(new URL('../../../src/block-packs/pack-5/manifest.json',import.meta.url)));
const p=(id,variant)=>getResidentialFurniture(id,variant);
const sig=d=>JSON.stringify(d.parts.map(x=>x.boxes));

test('four exclusive M2 furniture families, eight authored material/geometric variants',()=>{
  assert.deepEqual(RESIDENTIAL_FAMILIES.map(d=>d.symbolicId),ids);
  assert.equal(RESIDENTIAL_FURNITURE.length,8);
  assert.equal(new Set(RESIDENTIAL_FURNITURE.map(sig)).size,8);
  assert.equal(new Set(RESIDENTIAL_FURNITURE.map(d=>`${d.symbolicId}:${d.variant}`)).size,8);
});
test('all eight descriptors have actual original multi-box occupancy, not asset-name aliases',()=>{
  for(const d of RESIDENTIAL_FURNITURE){
    assert.equal(validatePhysicalDescriptor(d),true);
    assert.ok(d.parts.every(r=>r.boxes.length>6));
    assert.ok(d.parts.reduce((n,r)=>n+r.boxes.length,0)<256);
    assert.ok(d.art.every((a,i)=>a.details.length===d.parts[i].boxes.length));
    assert.ok(d.attachment==='floor'&&d.integrated===false&&d.inventory===false&&d.interaction===false);
    assert.equal(d.numericId,undefined);
  }
});
test('beds have real head and foot cells and differentiated mattress/headboard details',()=>{
  for(const v of RESIDENTIAL_VARIANTS['pack5:082']){
    const d=p('pack5:082',v);
    assert.equal(d.parts.length,2);assert.deepEqual(d.parts.map(x=>x.cell),[[0,0,0],[0,0,1]]);
    assert.ok(d.parts[0].boxes.some(b=>b[4]>.85));
    assert.ok(d.parts[1].boxes.some(b=>b[1]>.40));
    assert.ok(d.parts.every(x=>x.collisionBoxes.length>=2));
  }
  assert.notEqual(sig(p('pack5:082','wanderer-quilt')),sig(p('pack5:082','moonwatch-canopy')));
});
test('canopy has actual tall four-post rails, standard bed does not',()=>{
  const canopy=p('pack5:082','moonwatch-canopy'),normal=p('pack5:082','wanderer-quilt');
  assert.ok(canopy.parts.flatMap(x=>x.boxes).filter(x=>x[4]>=.97).length>=8);
  assert.ok(normal.parts.flatMap(x=>x.boxes).filter(x=>x[4]>=.97).length===0);
});
test('single-seat chair has a physically raised back and stool has no back',()=>{
  const chair=p('pack5:083','hearthside-highback'),stool=p('pack5:083','riveted-round-stool');
  assert.equal(chair.parts.length,1);assert.equal(stool.parts.length,1);
  assert.ok(chair.parts[0].boxes.some(x=>x[4]>.95&&x[5]<.30));
  assert.ok(stool.parts[0].boxes.every(x=>x[4]<.65));
  assert.ok(chair.parts[0].collisionBoxes.length>1);
  assert.ok(stool.parts[0].collisionBoxes.every(x=>x[4]<.65));
});
test('bookshelves contain individually modeled books, scrolls, shelf tiers and open front',()=>{
  for(const v of RESIDENTIAL_VARIANTS['pack5:084']){
    const d=p('pack5:084',v),detail=d.art[0].details;
    assert.ok(detail.filter(x=>x.material.startsWith('book')).length>=12);
    assert.ok(d.parts[0].boxes.filter(x=>x[5]>.72&&x[2]<.2).length>=3);
    assert.ok(new Set(detail.map(x=>x.material)).size>=4);
    assert.ok(d.parts[0].collisionBoxes.length>=1);
  }
});
test('cabinets have independent left/right closed panels, hardware and distinct full heights',()=>{
  const low=p('pack5:085','pantry-cupboard'),tall=p('pack5:085','heritage-wardrobe');
  for(const d of [low,tall]){
    const details=d.art[0].details;
    assert.ok(details.filter(x=>x.material==='bronze').length>=3);
    assert.ok(details.some(x=>x.box[0]<.2&&x.box[3]<.5&&x.box[5]>.95));
    assert.ok(details.some(x=>x.box[0]>.5&&x.box[3]>.8&&x.box[5]>.95));
  }
  assert.ok(low.parts[0].collisionBoxes[0][4]<.75);
  assert.ok(tall.parts[0].collisionBoxes[0][4]>.90);
});
test('all eight palettes are finite opaque original material entries',()=>{
  assert.ok(Object.keys(RESIDENTIAL_PALETTE).length>=12);
  for(const d of RESIDENTIAL_FURNITURE)for(const part of d.art)for(const detail of part.details){
    const c=RESIDENTIAL_PALETTE[detail.material];assert.ok(c);
    assert.equal(c.length,4);assert.equal(c[3],1);assert.ok(c.every(x=>x>=0&&x<=1&&Number.isFinite(x)));
  }
});
test('all 32 furniture/rotation mesh combinations are within preview budget and finite',()=>{
  for(const d of RESIDENTIAL_FURNITURE)for(let rotation=0;rotation<4;rotation++){
    const m=furnitureBoxMesh(d,{rotation});
    assert.ok(m.triangles>=100&&m.triangles<=1400);
    assert.equal(m.indices.length,m.triangles*3);
    assert.equal(m.positions.length,m.vertexCount*3);
    assert.equal(m.colors.length,m.vertexCount*4);
    assert.ok(m.positions.every(Number.isFinite));assert.ok(m.colors.every(Number.isFinite));
    assert.ok(m.indices.every(x=>x<m.vertexCount));
  }
});
test('beds change multi-cell occupancy orientation without consuming new block IDs',()=>{
  const d=p('pack5:082','wanderer-quilt');
  assert.deepEqual(orientedParts(d,0).map(x=>x.cell),[[0,0,0],[0,0,1]]);
  assert.deepEqual(orientedParts(d,1).map(x=>x.cell),[[0,0,0],[-1,0,0]]);
  assert.deepEqual(orientedParts(d,2).map(x=>x.cell),[[0,0,0],[0,0,-1]]);
  assert.deepEqual(orientedParts(d,3).map(x=>x.cell),[[0,0,0],[1,0,0]]);
});
test('two-cell bed placement refuses floating unsupported foot cell',()=>{
  const f=makePack5Fixture(RESIDENTIAL_FAMILIES);
  f.setSupport([2,0,2]);
  assert.deepEqual(f.place('pack5:082',[2,1,2],0,'wanderer-quilt'),{ok:false,reason:'Missing attachment'});
  assert.equal(f.count(),0);
  f.setSupport([2,0,3]);assert.equal(f.place('pack5:082',[2,1,2],0,'wanderer-quilt').ok,true);
  assert.equal(f.cell([2,1,3]).symbolicId,'pack5:082');
});
test('rotated bed requires support beneath rotated second cell',()=>{
  const f=makePack5Fixture(RESIDENTIAL_FAMILIES);f.setSupport([5,0,5]);
  assert.equal(f.place('pack5:082',[5,1,5],1,'moonwatch-canopy').ok,false);
  f.setSupport([4,0,5]);assert.equal(f.place('pack5:082',[5,1,5],1,'moonwatch-canopy').ok,true);
  assert.equal(f.cell([4,1,5]).rotation,1);
});
test('overlapping furniture cannot occupy another placed bed foot cell',()=>{
  const f=makePack5Fixture(RESIDENTIAL_FAMILIES);
  for(const cell of [[0,-1,0],[0,-1,1]])f.setSupport(cell);
  assert.equal(f.place('pack5:082',[0,0,0],0,'wanderer-quilt').ok,true);
  assert.deepEqual(f.place('pack5:083',[0,0,1],0,'riveted-round-stool'),{ok:false,reason:'Occupied cell'});
  assert.equal(f.count(),1);
});
test('select any bed part and remove the whole atomic two-cell fixture',()=>{
  const f=makePack5Fixture(RESIDENTIAL_FAMILIES);
  f.setSupport([2,-1,3]);f.setSupport([2,-1,4]);f.place('pack5:082',[2,0,3],0,'wanderer-quilt');
  assert.equal(f.raycast([2.5,.47,6],[0,0,-1],6)?.cell[2],4);
  assert.equal(f.remove([2,0,4]),true);
  assert.equal(f.count(),0);assert.equal(f.cell([2,0,3]),null);
});
test('partial chair collision leaves true empty air above stool seat',()=>{
  const f=makePack5Fixture(RESIDENTIAL_FAMILIES);
  f.setSupport([0,-1,0]);f.place('pack5:083',[0,0,0],0,'riveted-round-stool');
  assert.equal(f.collides([.3,.53,.3,.5,.60,.5]),true);
  assert.equal(f.collides([.3,.72,.3,.5,.90,.5]),false);
});
test('bookshelf and wardrobe selection/removal is physical, no inventory/gameplay state',()=>{
  const f=makePack5Fixture(RESIDENTIAL_FAMILIES);
  f.setSupport([2,-1,0]);f.setSupport([4,-1,0]);
  f.place('pack5:084',[2,0,0],0,'scholar-oak-stack');
  f.place('pack5:085',[4,0,0],0,'heritage-wardrobe');
  assert.equal(f.raycast([2.5,.5,3],[0,0,-1])?.symbolicId,'pack5:084');
  assert.equal(f.raycast([4.5,.5,3],[0,0,-1])?.symbolicId,'pack5:085');
  assert.equal(f.removeRay([4.5,.5,3],[0,0,-1]),true);
  assert.equal(f.count(),1);
});
test('four families two distinct variants can coexist in reversible isolated save',()=>{
  const f=makePack5Fixture(RESIDENTIAL_FAMILIES);
  const setup=[['pack5:082','wanderer-quilt',[0,0,0]],['pack5:083','riveted-round-stool',[3,0,0]],['pack5:084','starbound-scrollcase',[5,0,0]],['pack5:085','heritage-wardrobe',[7,0,0]]];
  for(const [id,v,cell] of setup){
    f.setSupport([cell[0],-1,cell[2]]);
    if(id==='pack5:082')f.setSupport([cell[0],-1,cell[2]+1]);
    assert.equal(f.place(id,cell,0,v).ok,true);
  }
  const before=f.snapshot();assert.equal('schema' in before,false);assert.equal(before.entries.length,4);
  f.restore(JSON.parse(JSON.stringify(before)));assert.deepEqual(f.snapshot(),before);
  assert.equal(f.cell([0,0,1]).variant,'wanderer-quilt');
});
test('invalid variant/corrupt snapshot rejection does not damage existing furniture',()=>{
  const f=makePack5Fixture(RESIDENTIAL_FAMILIES);f.setSupport([0,-1,0]);f.place('pack5:085',[0,0,0],0,'pantry-cupboard');
  const before=f.snapshot();
  assert.throws(()=>f.restore({format:before.format,entries:[[0,0,0,'pack5:085',0,'invented-wardrobe']]}));
  assert.deepEqual(f.snapshot(),before);
  assert.throws(()=>f.place('pack5:085',[1,0,0],0,'invented-wardrobe'));
});
test('no numeric IDs, weapon, sleep, storage, NPC or other non-asset gameplay added',()=>{
  const s=readFileSync(new URL('../../../src/block-packs/pack-5/residential-furnishings.mjs',import.meta.url),'utf8');
  assert.ok(!/from\s+['"]\.{1,2}\/(?:\.\.\/)*?(?:voxel|blocks|main|physics|persistence)/.test(s));
  for(const d of RESIDENTIAL_FURNITURE){
    assert.equal(d.integrated,false);assert.equal(d.inventory,false);assert.equal(d.interaction,false);
    assert.equal(Object.hasOwn(d,'persistentNumericId'),false);
  }
});
test('M2 source variants correspond only to planned Pack 5 roster names',()=>{
  const names={'pack5:082':'Beds','pack5:083':'Chairs & Stools','pack5:084':'Bookshelves','pack5:085':'Cabinets & Wardrobes'};
  for(const d of RESIDENTIAL_FAMILIES){
    const r=manifest.entries.find(x=>x.symbolicId===d.symbolicId);
    assert.equal(r.name,names[d.symbolicId]);assert.equal(r.milestone,2);assert.equal(r.status,'CANDIDATE');assert.equal(r.persistentNumericId,null);
  }
});
test('original bookshelf/cabinet joinery is physical on rear and exposed side, not a painted cube',()=>{
 for(const id of ['pack5:084','pack5:085'])for(const variant of RESIDENTIAL_VARIANTS[id]){
   const d=p(id,variant),boxes=d.parts[0].boxes;
   const rear=boxes.filter(b=>b[2]<.08&&b[5]<.15);
   const side=boxes.filter(b=>b[0]>.88&&b[3]>.92);
   assert.ok(rear.length>=3,`${id} ${variant}: reverse joinery missing`);
   assert.ok(side.length>=3,`${id} ${variant}: side joinery missing`);
 }
});
test('all physical furniture parts individually honor the 64-box / 768-triangle mobile preview ceiling',()=>{
 for(const d of RESIDENTIAL_FURNITURE){
   for(const part of d.parts){assert.ok(part.boxes.length<=64);
     assert.ok(part.boxes.length*12<=768);}
 }
});
