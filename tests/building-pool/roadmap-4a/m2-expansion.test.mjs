import test from 'node:test';
import assert from 'node:assert/strict';
import {allM1} from '../../../src/building-pool/roadmap-4a/m1-blueprints.mjs';
import {allM2Exemplars} from '../../../src/building-pool/roadmap-4a/m2-blueprints.mjs';
import {allM2Additional} from '../../../src/building-pool/roadmap-4a/m2-additional.mjs';
import {allM2Regional} from '../../../src/building-pool/roadmap-4a/m2-regional.mjs';
import {allM2Expansion,buildM2Expansion,M2_EXPANSION_IDS} from '../../../src/building-pool/roadmap-4a/m2-expansion.mjs';
import {validateBlueprint,validateCollection,geometrySignature,serializeBlueprint}
 from '../../../src/building-pool/roadmap-4a/schema.mjs';
import {auditBlueprintMaterials} from '../../../src/building-pool/roadmap-4a/m1-material-audit.mjs';
import manifest from '../../../src/building-pool/roadmap-4a/manifest.json' with {type:'json'};
const old=()=>[...allM1(),...allM2Exemplars(),...allM2Additional(),...allM2Regional()];
const fresh=()=>allM2Expansion();
const map=b=>new Map(b.cells.map(c=>[c.at.join(','),c]));

const normalizedD4=blueprint=>{
 const cells=blueprint.cells.map(({at:[x,y,z],role})=>[x,z,y,role]);
 const options=[];
 for(let reflect=0;reflect<=1;reflect++)for(let turn=0;turn<4;turn++){
   const transformed=cells.map(([initialX,initialZ,y,role])=>{
     let x=reflect?-initialX:initialX,z=initialZ;
     for(let n=0;n<turn;n++){const before=x;x=-z;z=before;}
     return [x,z,y,role];
   });
   let minX=Infinity,minZ=Infinity;
   for(const [x,z] of transformed){minX=Math.min(x,minX);minZ=Math.min(z,minZ);}
   options.push(transformed.map(([x,z,y,role])=>[x-minX,z-minZ,y,role].join('/')).sort().join('|'));
 }
 return options.sort()[0];
};
test('six new genuine regional authoring slots, 44 source-validated identities and correct fixed inherited counts',()=>{
 const newOnes=fresh();
 assert.deepEqual(M2_EXPANSION_IDS,[
 'r4:civic-hall:temperate:medium:02','r4:civic-hall:snow:small:02',
 'r4:civic-hall:enchanted-forest:small:02','r4:guildhall:temperate:medium:01',
 'r4:guildhall:snow:medium:01','r4:guildhall:mountain:medium:01']);
 assert.equal(newOnes.length,6);
 const all=[...old(),...newOnes];
 assert.equal(all.length,44);
 assert.equal(validateCollection(all).verified,44);
 assert.equal(new Set(all.map(x=>x.id)).size,44);
 assert.equal(new Set(all.map(geometrySignature)).size,44);
 assert.equal(manifest.counts.legacyAuthored,30);
 assert.equal(manifest.counts.newlyAuthored,62);
 assert.equal(manifest.counts.totalAuthored,92);
 assert.equal(manifest.counts.remaining,223);
 assert.equal(manifest.counts.creatorAccepted,0);
 assert.equal(manifest.counts.integratedBuildings,0);
 assert.equal(manifest.categories.find(x=>x.type==='civic-hall').remaining,29);
 assert.equal(manifest.categories.find(x=>x.type==='guildhall').remaining,29);
});
test('all 44 original architectural signatures remain distinct under full D4 reflections, rotations and translation',()=>{
 const designs=[...old(),...fresh()];
 const fingerprints=new Map();
 for(const b of designs){
   const hash=normalizedD4(b);
   assert.ok(!fingerprints.has(hash),b.id+' duplicates '+fingerprints.get(hash));
   fingerprints.set(hash,b.id);
 }
 assert.equal(fingerprints.size,44);
});
test('all six occupied volumetric originals have 2-high circulation and meaningful independent room programs',()=>{
 const batch=fresh();
 assert.equal(batch.reduce((n,x)=>n+x.cells.length,0),11017);
 assert.equal(batch.reduce((n,x)=>n+x.navigation.length,0),2401);
 assert.equal(batch.reduce((n,x)=>n+x.spaces.length,0),20);
 for(const b of batch){
  const x=validateBlueprint(b),m=map(b);
  assert.equal(x.theoreticalOnly,true);
  assert.ok(x.occupiedCells>=1300);
  assert.ok(x.walkableCells>=250);
  assert.ok(x.rooms>=3);
  assert.equal(x.levels,1);
  assert.ok(b.cells.some(c=>c.role==='fixture'&&c.at[1]===1));
  for(const room of b.spaces){
   assert.ok(room.footprint.length>=16,b.id+' '+room.id);
   assert.equal(m.get([room.access[0],0,room.access[2]].join(','))?.role,'floor');
  }
 }
});
test('six actual window sockets face outward and supported 3-wide doorways remain genuinely empty',()=>{
 const offsets={west:[-1,0],east:[1,0],north:[0,1],south:[0,-1]};
 for(const b of fresh()){
  const m=map(b);
  const plan=new Set(b.cells.filter(c=>c.role==='floor'&&c.at[1]===0).map(c=>[c.at[0],c.at[2]].join(',')));
  assert.equal(b.openings.filter(o=>o.kind==='window').length,6,b.id);
  assert.equal(b.openings.filter(o=>o.kind==='entrance').length,1,b.id);
  for(const o of b.openings.filter(o=>o.kind==='window')){
   const [dx,dz]=offsets[o.facing];
   assert.equal(m.get(o.at.join(','))?.role,'window',b.id+' '+o.at);
   const beyond=m.get([o.at[0]+dx,2,o.at[2]+dz].join(','));
   assert.ok(!beyond||!['wall','partition','window'].includes(beyond.role),
     b.id+' pane looks directly into another enclosed wall '+o.at);
   // A supported porch may have a walkable floor outside a public window;
   // a floor tile alone is not proof that a pane is an interior wall.
  }
  for(const door of b.openings.filter(o=>['entrance','door'].includes(o.kind))){
   assert.equal(m.has(door.at.join(',')),false,b.id+' '+door.kind);
   assert.equal(m.has([door.at[0],2,door.at[2]].join(',')),false,b.id+' '+door.kind);
   assert.equal(m.get([door.at[0],0,door.at[2]].join(','))?.role,'floor');
   assert.ok(b.navigation.some(n=>n.at.join(',')===door.at.join(',')),b.id+' '+door.at+' inaccessible opening');
  }
 }
});
test('main and raised roof tiers have source-bearing walls/beam/columns without invented masks',()=>{
 for(const b of fresh()){
  const m=map(b);
  for(const c of b.cells.filter(c=>c.role==='roof')){
   if(c.at[1]===6){
     assert.equal(m.get([c.at[0],5,c.at[2]].join(','))?.role,'beam',b.id+' ridge support '+c.at);
     assert.ok(['beam','wall'].includes(m.get([c.at[0],4,c.at[2]].join(','))?.role),b.id+' ridge load '+c.at);
   }
   if(c.at[1]===5){
     let supported=false;
     for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
       if(Math.abs(dx)+Math.abs(dz)>2)continue;
       const support=m.get([c.at[0]+dx,4,c.at[2]+dz].join(','));
       if(support&&['beam','wall','column'].includes(support.role))supported=true;
     }
     assert.ok(supported,b.id+' roof unsupported '+c.at);
   }
  }
 }
});
test('every new source family resolves only to catalog-review samples or explicit blockers, never placement',()=>{
 for(const b of fresh()){
  const a=auditBlueprintMaterials(b);
  assert.ok(a.entries.length>=3&&a.symbolicCells>50);
  assert.equal(a.worldPlaced,false);assert.equal(a.productionReady,false);
  assert.equal(a.saveWritten,false);assert.equal(a.realIphoneTested,false);
  assert.ok(a.entries.every(e=>e.chosenNumericId===null&&e.blockedBy.length>0));
  assert.ok(b.dependencies.every(d=>d.unresolved.length>0&&!Object.hasOwn(d,'numericId')));
  assert.equal(b.architecturalNotes.worldPlacement,false);
 }
});
test('all six authored candidates are deterministic at their exact IDs and never emit world/save edits',()=>{
 for(const b of fresh()){
   assert.equal(serializeBlueprint(b),serializeBlueprint(buildM2Expansion(b.id)));
   assert.ok(!Object.hasOwn(b,'worldEdits')&&!Object.hasOwn(b,'savedPlayer'));
 }
});
