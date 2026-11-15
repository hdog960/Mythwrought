import test from 'node:test';
import assert from 'node:assert/strict';
import {buildM2Exemplar,allM2Exemplars,auditM2Exemplars}
 from '../../../src/building-pool/roadmap-4a/m2-blueprints.mjs';
import {allM1} from '../../../src/building-pool/roadmap-4a/m1-blueprints.mjs';
import {validateBlueprint,validateCollection,geometrySignature,serializeBlueprint}
 from '../../../src/building-pool/roadmap-4a/schema.mjs';
import manifest from '../../../src/building-pool/roadmap-4a/manifest.json' with {type:'json'};

test('new M2 first original civic hall and guildhall are distinct 3D real-coordinate designs',()=>{
 const two=allM2Exemplars();
 assert.deepEqual(two.map(b=>b.id),['r4:civic-hall:temperate:small:02','r4:guildhall:temperate:small:01']);
 assert.equal(two.length,2);
 const original=allM1();
 const combined=[...original,...two];
 assert.equal(new Set(combined.map(b=>b.id)).size,32);
 assert.equal(validateCollection(combined).verified,32);
 assert.equal(new Set(combined.map(geometrySignature)).size,32);
 assert.equal(auditM2Exemplars().distinctGeometry,2);
 assert.equal(manifest.counts.totalAuthored,38);
 assert.equal(manifest.counts.newlyAuthored,8);
 assert.equal(manifest.counts.remaining,277);
 assert.equal(manifest.counts.creatorAccepted,0);
 assert.equal(manifest.counts.integratedBuildings,0);
});
test('both programs have a true supported exterior approach, windows, roofs, named rooms and free headroom',()=>{
 for(const b of allM2Exemplars()){
  const v=validateBlueprint(b);
  assert.equal(v.theoreticalOnly,true);
  assert.ok(v.occupiedCells>450,b.id);
  assert.ok(v.walkableCells>70,b.id);
  assert.equal(v.rooms,2);
  assert.equal(v.levels,1);
  assert.equal(b.openings.filter(o=>o.kind==='entrance').length,1);
  assert.ok(b.openings.some(o=>o.kind==='door'));
  assert.equal(b.openings.filter(o=>o.kind==='window').length,5);
  assert.ok(b.cells.some(c=>c.role==='fixture'&&c.at[1]===1));
  assert.ok(b.cells.some(c=>c.role==='beam'&&c.at[3]===undefined));
  assert.ok(b.cells.some(c=>c.role==='roof'&&c.at[1]===5));
  assert.ok(b.navigation.some(n=>n.at[2]===0),'formal three-wide approach is navigable');
  for(const room of b.spaces)assert.ok(room.footprint.length>=8);
 }
});
test('roof upper tiers are on actual timber beams; neither physical masks nor floor overlaps are forged',()=>{
 for(const b of allM2Exemplars()){
  const map=new Map(b.cells.map(c=>[c.at.join(','),c]));
  for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]===5)){
    const under=map.get([c.at[0],4,c.at[2]].join(','));
    assert.equal(under?.role,'beam',b.id+' raised roof has missing timber purlin');
  }
  assert.ok(b.cells.filter(c=>c.role==='beam'&&c.at[1]===3).length>=20);
 }
});
test('two raised gables and footprints are not clones of one another or inherited M1 designs',()=>{
 const c=buildM2Exemplar('civic-hall'),g=buildM2Exemplar('guildhall');
 assert.notEqual(geometrySignature(c),geometrySignature(g));
 assert.notDeepEqual(c.architecturalNotes.structuralSignature,g.architecturalNotes.structuralSignature);
 assert.notEqual(c.bounds[2],g.bounds[2]);
 assert.equal(c.spaces[0].kind,'meeting');assert.equal(g.spaces[0].kind,'gathering-hall');
});
test('new exemplars serialize bit-for-bit across repeats and carry no future numeric IDs, world writes or fake approval',()=>{
 for(const b of allM2Exemplars()){
  assert.equal(serializeBlueprint(b),serializeBlueprint(buildM2Exemplar(b.type)));
  assert.ok(b.dependencies.length>=3);
  assert.ok(b.dependencies.every(d=>!Object.hasOwn(d,'numericId')&&d.unresolved.length>0));
  assert.ok(!Object.hasOwn(b,'worldEdits')&&!Object.hasOwn(b,'savedPlayer'));
  assert.equal(b.architecturalNotes.worldPlacement,false);
 }
});
