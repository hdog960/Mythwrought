import test from 'node:test';
import assert from 'node:assert/strict';
import {allM1} from '../../../src/building-pool/roadmap-4a/m1-blueprints.mjs';
import {allM2Exemplars} from '../../../src/building-pool/roadmap-4a/m2-blueprints.mjs';
import {allM2Additional} from '../../../src/building-pool/roadmap-4a/m2-additional.mjs';
import {allM2Regional} from '../../../src/building-pool/roadmap-4a/m2-regional.mjs';
import {allM2Expansion} from '../../../src/building-pool/roadmap-4a/m2-expansion.mjs';
import {allM2Tranche,buildM2Tranche,M2_TRANCHE_IDS} from '../../../src/building-pool/roadmap-4a/m2-tranche.mjs';
import {validateBlueprint,validateCollection,geometrySignature,serializeBlueprint} from '../../../src/building-pool/roadmap-4a/schema.mjs';
import {auditBlueprintMaterials} from '../../../src/building-pool/roadmap-4a/m1-material-audit.mjs';
import manifest from '../../../src/building-pool/roadmap-4a/manifest.json' with {type:'json'};
const EXPECTED_IDS=["r4:civic-hall:desert:small:02","r4:civic-hall:snow:large:02","r4:civic-hall:enchanted-forest:medium:02","r4:civic-hall:mountain:large:02","r4:guildhall:temperate:large:01","r4:guildhall:desert:medium:01","r4:guildhall:enchanted-forest:large:01","r4:guildhall:mountain:large:01"];
const old=()=>[...allM1(),...allM2Exemplars(),...allM2Additional(),...allM2Regional(),...allM2Expansion()];
const fresh=()=>allM2Tranche();
const xyz=arr=>arr.join(',');
const map=b=>new Map(b.cells.map(c=>[xyz(c.at),c]));
function d4(b){
 const cells=b.cells.map(({at:[x,y,z],role})=>[x,z,y,role]),choices=[];
 for(let flip=0;flip<=1;flip++)for(let turn=0;turn<4;turn++){
  const transformed=cells.map(([ix,iz,y,role])=>{
   let x=flip?-ix:ix,z=iz;
   for(let i=0;i<turn;i++){const prev=x;x=-z;z=prev;}
   return [x,z,y,role];
  });
  const lowX=Math.min(...transformed.map(c=>c[0])),lowZ=Math.min(...transformed.map(c=>c[1]));
  choices.push(transformed.map(([x,z,y,role])=>[x-lowX,z-lowZ,y,role].join('/')).sort().join('|'));
 }
 return choices.sort()[0];
}
test('all eight source-specific new IDs occupy unused 4A quota slots; inherited 30 and earlier 14 M2 designs are retained',()=>{
 const current=fresh(),all=[...old(),...current];
 assert.deepEqual(M2_TRANCHE_IDS,EXPECTED_IDS);
 assert.equal(old().length,44);
 assert.equal(current.length,8);
 assert.equal(all.length,52);
 assert.equal(validateCollection(all).verified,52);
 assert.equal(new Set(all.map(x=>x.id)).size,52);
 assert.equal(new Set(all.map(geometrySignature)).size,52);
 assert.equal(manifest.counts.legacyAuthored,30);
 assert.equal(manifest.counts.newlyAuthored,128);
 assert.equal(manifest.counts.totalAuthored,158);
 assert.equal(manifest.counts.remaining,157);
 assert.equal(manifest.counts.creatorAccepted,0);
 assert.equal(manifest.counts.integratedBuildings,0);
 assert.equal(manifest.categories.find(c=>c.type==='civic-hall').remaining,0);
 assert.equal(manifest.categories.find(c=>c.type==='guildhall').remaining,0);
});
test('all 52 whole-volume source fingerprints are unique under 90-degree rotation, reflection and translation',()=>{
 const signatures=new Map();
 for(const b of [...old(),...fresh()]){
  const fingerprint=d4(b);
  assert.ok(!signatures.has(fingerprint),b.id+' duplicates '+signatures.get(fingerprint));
  signatures.set(fingerprint,b.id);
 }
 assert.equal(signatures.size,52);
});
test('new regional civic and trade spaces are occupied 3D rooms with two-cell head clearance and navigable public circulation',()=>{
 const all=fresh();
 assert.equal(all.reduce((n,b)=>n+b.cells.length,0),27068);
 assert.equal(all.reduce((n,b)=>n+b.navigation.length,0),6519);
 assert.equal(all.reduce((n,b)=>n+b.spaces.length,0),35);
 for(const b of all){
  const v=validateBlueprint(b),cells=map(b);
  assert.equal(v.theoreticalOnly,true);
  assert.ok(v.occupiedCells>1000&&v.walkableCells>200&&v.rooms>=3);
  assert.ok(b.openings.filter(o=>o.kind==='window').length>=6);
  assert.equal(b.openings.filter(o=>o.kind==='entrance').length,1);
  for(const s of b.spaces){
   assert.ok(s.footprint.length>=12,b.id+' '+s.id);
   assert.equal(cells.get(xyz([s.access[0],0,s.access[2]]))?.role,'floor');
  }
  assert.ok(b.cells.some(c=>c.role==='fixture'));
  assert.ok(b.navigation.some(n=>n.at[2]===b.openings.find(o=>o.kind==='entrance').at[2]-1));
 }
});
test('real exterior windows occupy masonry sockets and each doorway retains supported two-cell head clearance',()=>{
 const move={north:[0,1],south:[0,-1],west:[-1,0],east:[1,0]};
 for(const b of fresh()){
  const cells=map(b);
  for(const o of b.openings){
   if(o.kind==='window'){
    assert.equal(cells.get(xyz(o.at))?.role,'window',b.id+' '+xyz(o.at));
    const [dx,dz]=move[o.facing],beyond=cells.get(xyz([o.at[0]+dx,2,o.at[2]+dz]));
    assert.ok(!beyond||!['wall','partition','window'].includes(beyond.role),b.id+' facing into masonry '+xyz(o.at));
   }else{
    assert.ok(!cells.has(xyz(o.at)));
    assert.ok(!cells.has(xyz([o.at[0],2,o.at[2]])));
    assert.equal(cells.get(xyz([o.at[0],0,o.at[2]]))?.role,'floor');
    assert.ok(b.navigation.some(n=>xyz(n.at)===xyz(o.at)),b.id+' disconnected door '+xyz(o.at));
   }
  }
 }
});
test('every raised roof tile has authored support immediately below; main roofs have short purlin bearing spans',()=>{
 for(const b of fresh()){
  const cells=map(b);
  for(const c of b.cells.filter(c=>c.role==='roof')){
   const [x,y,z]=c.at;
   if(y===6){
    assert.equal(cells.get(xyz([x,5,z]))?.role,'beam',b.id+' roof ridge '+xyz(c.at));
    assert.ok(['beam','wall'].includes(cells.get(xyz([x,4,z]))?.role),b.id+' unsupported raised ridge '+xyz(c.at));
   }else if(y===5){
    let bearing=false;
    for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
     if(Math.abs(dx)+Math.abs(dz)>2)continue;
     if(['beam','wall','column'].includes(cells.get(xyz([x+dx,4,z+dz]))?.role))bearing=true;
    }
    assert.ok(bearing,b.id+' unsupported roof span '+xyz(c.at));
   }
  }
 }
});
test('merged physical five-pack geometry remains read-only, explicit yaw and support requirements remain unresolved',()=>{
 for(const b of fresh()){
  const audit=auditBlueprintMaterials(b);
  assert.ok(audit.symbolicCells>50&&audit.entries.length>=3);
  assert.equal(audit.productionReady,false);
  assert.equal(audit.worldPlaced,false);
  assert.equal(audit.saveWritten,false);
  assert.equal(audit.realIphoneTested,false);
  assert.ok(audit.entries.every(e=>e.chosenNumericId===null&&e.blockedBy.length>0));
  assert.ok(b.dependencies.every(d=>d.unresolved.length>0&&!Object.hasOwn(d,'numericId')));
 }
});
test('all authored structures are deterministic and lack any world writer, save mutation or fictional approval',()=>{
 for(const b of fresh()){
  assert.equal(serializeBlueprint(b),serializeBlueprint(buildM2Tranche(b.id)));
  assert.equal(b.architecturalNotes.worldPlacement,false);
  assert.equal(b.architecturalNotes.creatorAccepted,false);
  assert.ok(!('savedPlayer' in b)&&!('worldEdits' in b));
 }
});
