import test from 'node:test';
import assert from 'node:assert/strict';
import {M2_REGIONAL_IDS,allM2Regional,buildM2Regional}
 from '../../../src/building-pool/roadmap-4a/m2-regional.mjs';
import {allM1} from '../../../src/building-pool/roadmap-4a/m1-blueprints.mjs';
import {allM2Exemplars} from '../../../src/building-pool/roadmap-4a/m2-blueprints.mjs';
import {allM2Additional} from '../../../src/building-pool/roadmap-4a/m2-additional.mjs';
import {validateBlueprint,validateCollection,geometrySignature,serializeBlueprint}
 from '../../../src/building-pool/roadmap-4a/schema.mjs';
import {auditBlueprintMaterials} from '../../../src/building-pool/roadmap-4a/m1-material-audit.mjs';
import manifest from '../../../src/building-pool/roadmap-4a/manifest.json' with {type:'json'};

const all=()=>allM2Regional();
const positions=b=>new Map(b.cells.map(c=>[c.at.join(','),c]));
test('four original new regional designs fill unused explicit biome/size/variant slots',()=>{
 assert.deepEqual(M2_REGIONAL_IDS,[
 'r4:civic-hall:snow:medium:02','r4:guildhall:enchanted-forest:medium:01',
 'r4:guildhall:desert:small:01','r4:civic-hall:mountain:medium:02'
 ]);
 const produced=all(),combined=[...allM1(),...allM2Exemplars(),...allM2Additional(),...produced];
 assert.equal(produced.length,4);
 assert.equal(combined.length,38);
 assert.equal(validateCollection(combined).verified,38);
 assert.equal(new Set(combined.map(geometrySignature)).size,38);
 assert.equal(manifest.counts.planned,315);
 assert.equal(manifest.counts.legacyAuthored,30);
 assert.equal(manifest.counts.newlyAuthored,62);
 assert.equal(manifest.counts.totalAuthored,92);
 assert.equal(manifest.counts.remaining,223);
 assert.equal(manifest.counts.creatorAccepted,0);
 assert.equal(manifest.counts.integratedBuildings,0);
});
test('all new plans validate occupied walls, supported public floors, full source routes and actual rooms',()=>{
 for(const b of all()){
  const state=validateBlueprint(b),map=positions(b);
  assert.equal(state.theoreticalOnly,true);
  assert.ok(state.occupiedCells>650,b.id);
  assert.ok(state.walkableCells>120,b.id);
  assert.ok(state.rooms>=3,b.id);
  assert.equal(state.levels,1);
  assert.equal(b.openings.filter(x=>x.kind==='entrance').length,1);
  assert.ok(b.openings.filter(x=>x.kind==='window').length>=6);
  assert.ok(b.openings.some(x=>x.kind==='door'));
  assert.ok(b.cells.some(c=>c.role==='fixture'));
  assert.ok(b.cells.some(c=>c.role==='roof'&&c.at[1]===6));
  assert.ok(b.navigation.some(n=>n.at[2]===b.openings.find(o=>o.kind==='entrance').at[2]-1));
  for(const room of b.spaces){
   assert.ok(room.footprint.length>=12);
   assert.ok(map.get([room.access[0],0,room.access[2]].join(','))?.role==='floor');
  }
 }
});
test('each raised ridge roof cell has immediate timber support; portico is actually attached and clear',()=>{
 for(const b of all()){
  const map=positions(b);
  for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]===6)){
   assert.equal(map.get([c.at[0],5,c.at[2]].join(','))?.role,'beam',b.id+' missing ridge purlin');
   assert.ok(['beam','wall'].includes(map.get([c.at[0],4,c.at[2]].join(','))?.role),b.id+' upper beam not backed');
  }
  for(const o of b.openings.filter(o=>o.kind==='entrance'||o.kind==='door')){
   assert.equal(map.has(o.at.join(',')),false,b.id);
   assert.equal(map.has([o.at[0],2,o.at[2]].join(',')),false,b.id);
   assert.equal(map.get([o.at[0],0,o.at[2]].join(','))?.role,'floor',b.id);
  }
 }
});
test('every main roof tile has source-bearing material within two horizontal cells',()=>{
 for(const b of all()){
  const m=positions(b);
  for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]===5)){
   let bearing=false;
   for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
    if(Math.abs(dx)+Math.abs(dz)>2)continue;
    const below=m.get([c.at[0]+dx,4,c.at[2]+dz].join(','));
    if(below&&['beam','wall','column'].includes(below.role))bearing=true;
   }
   assert.ok(bearing,b.id+' roof has unsupported source span at '+c.at);
  }
 }
});
test('each civic and guild design has its own signed program and is not a rotated/mirrored original',()=>{
 const b=all(),keys=new Set(b.map(x=>x.architecturalNotes.structuralSignature.join('|')));
 assert.equal(keys.size,4);
 assert.deepEqual(b.map(x=>x.spaces.map(s=>s.kind).slice(0,2)),[
  ['meeting','administration'],['gathering-hall','shared-facility'],
  ['gathering-hall','shared-facility'],['meeting','administration']
 ]);
 assert.notEqual(b[0].bounds[0],b[1].bounds[0]);
 assert.notEqual(b[1].bounds[2],b[2].bounds[2]);
});
test('merged physical catalog audit never pretends chosen numeric IDs, rotation save or world placement',()=>{
 for(const b of all()){
  const audit=auditBlueprintMaterials(b);
  assert.ok(audit.entries.length>=4&&audit.symbolicCells>0);
  assert.equal(audit.worldPlaced,false);
  assert.equal(audit.productionReady,false);
  assert.equal(audit.saveWritten,false);
  for(const e of audit.entries){
   assert.equal(e.chosenNumericId,null);
   assert.ok(e.blockedBy.length>0);
  }
  assert.ok(b.dependencies.every(d=>!Object.hasOwn(d,'numericId')&&d.unresolved.length>=1));
  assert.equal(serializeBlueprint(b),serializeBlueprint(buildM2Regional(b.id)));
  assert.equal(b.architecturalNotes.worldPlacement,false);
 }
});
