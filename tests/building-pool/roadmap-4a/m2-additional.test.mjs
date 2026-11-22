import test from 'node:test';
import assert from 'node:assert/strict';
import {buildM2Additional,allM2Additional}
 from '../../../src/building-pool/roadmap-4a/m2-additional.mjs';
import {allM1} from '../../../src/building-pool/roadmap-4a/m1-blueprints.mjs';
import {allM2Exemplars} from '../../../src/building-pool/roadmap-4a/m2-blueprints.mjs';
import {validateBlueprint,validateCollection,geometrySignature,serializeBlueprint}
 from '../../../src/building-pool/roadmap-4a/schema.mjs';
import {auditBlueprintMaterials}
 from '../../../src/building-pool/roadmap-4a/m1-material-audit.mjs';
import manifest from '../../../src/building-pool/roadmap-4a/manifest.json' with {type:'json'};

test('two new independently authored plans fill genuine additional biome/size quota slots',()=>{
 const plans=allM2Additional();
 assert.deepEqual(plans.map(b=>b.id),[
  'r4:civic-hall:desert:medium:02','r4:guildhall:mountain:small:01'
 ]);
 const all=[...allM1(),...allM2Exemplars(),...plans];
 assert.equal(all.length,34);
 assert.equal(validateCollection(all).verified,34);
 assert.equal(new Set(all.map(geometrySignature)).size,34);
 assert.equal(manifest.counts.totalAuthored,158);
 assert.equal(manifest.counts.newlyAuthored,128);
 assert.equal(manifest.counts.remaining,157);
 assert.equal(manifest.counts.creatorAccepted,0);
 assert.equal(manifest.counts.integratedBuildings,0);
});
test('courtyard open to sky, structural eave support and two properly pierced office wings',()=>{
 const b=buildM2Additional('civic-hall'),m=new Map(b.cells.map(c=>[c.at.join(','),c]));
 assert.equal(b.size,'medium');assert.equal(b.biome,'desert');
 assert.ok(b.cells.length>1300);
 for(let x=14;x<=21;x++)for(let z=13;z<=20;z++){
  assert.equal(m.get([x,5,z].join(',')),undefined,'desert court must stay sky-open');
  assert.equal(m.get([x,0,z].join(','))?.role,'floor');
 }
 assert.equal(b.openings.filter(x=>x.kind==='window').length,5);
 assert.equal(b.openings.filter(x=>x.kind==='door').length,2);
 assert.equal(b.openings.filter(x=>x.kind==='entrance').length,1);
 assert.deepEqual(b.spaces.map(r=>r.kind),['meeting','administration']);
 assert.ok(b.navigation.length>250);
});
test('mountain guildhouse has four original unequal arms and independent workroom/council use',()=>{
 const b=buildM2Additional('guildhall'),m=new Map(b.cells.map(c=>[c.at.join(','),c]));
 assert.equal(b.biome,'mountain');assert.equal(b.size,'small');
 assert.ok(m.has('4,0,15')&&m.has('26,0,15')&&m.has('15,0,24')&&m.has('15,0,4'));
 assert.equal(b.openings.filter(x=>x.kind==='window').length,5);
 assert.deepEqual(b.spaces.map(r=>r.kind),['gathering-hall','shared-facility']);
 assert.ok(b.navigation.length>100);
});
test('all raised roof tiles have actual immediately supporting source-authored timber beams',()=>{
 for(const b of allM2Additional()){
  const m=new Map(b.cells.map(c=>[c.at.join(','),c]));
  assert.ok(b.cells.some(c=>c.role==='roof'&&c.at[1]===6));
  for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]===6))
   assert.equal(m.get([c.at[0],5,c.at[2]].join(','))?.role,'beam',
    b.id+' raised roof is unsupported');
  for(const c of b.openings.filter(o=>o.kind==='entrance'||o.kind==='door')){
   assert.equal(m.has(c.at.join(',')),false);
   assert.equal(m.has([c.at[0],2,c.at[2]].join(',')),false);
   assert.equal(m.get([c.at[0],0,c.at[2]].join(','))?.role,'floor');
  }
 }
});
test('true physical catalog audit remains fail-closed and serialization deterministic, not game placement',()=>{
 for(const b of allM2Additional()){
  const audit=auditBlueprintMaterials(b);
  assert.ok(audit.symbolicCells>0&&audit.entries.length>=3);
  assert.equal(audit.worldPlaced,false);assert.equal(audit.productionReady,false);
  assert.ok(b.dependencies.every(d=>d.ref.startsWith('pack')&&!Object.hasOwn(d,'numericId')));
  assert.equal(serializeBlueprint(b),serializeBlueprint(buildM2Additional(b.type)));
  assert.equal(validateBlueprint(b).levels,1);
 }
});
