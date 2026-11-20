import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_C_4B_153_ALL} from '../../../src/building-pool/roadmap-4b/m3-research-wave7-roadmap-c.mjs';
import {ROADMAP_D_WAVE1_BUILDINGS,ROADMAP_D_WAVE1_IDS,ROADMAP_D_WAVE1_PLANS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave1.mjs';
import {validateBlueprint,validateCollection,expectedIds,geometrySignature} from '../../../src/building-pool/roadmap-4b/schema.mjs';
const key=(x,z)=>x+','+z;
function orientedFloor(b,turn){
 const floor=b.cells.filter(c=>c.role==='floor').map(c=>[c.at[0],c.at[2]]);
 const transformed=floor.map(([x,z])=>{let a=turn&1?-x:x,v=z;if(turn&2)[a,v]=[v,a];if(turn&4)v=-v;return [a,v];});
 let minX=Infinity,minZ=Infinity;for(const [x,z] of transformed){minX=Math.min(minX,x);minZ=Math.min(minZ,z)}
 return new Set(transformed.map(([x,z])=>key(x-minX,z-minZ)));
}
function maxD4(a,b){const reference=orientedFloor(b,0);let max=0;for(let t=0;t<8;t++){const v=orientedFloor(a,t);let overlap=0;for(const cell of v)if(reference.has(cell))overlap++;max=Math.max(max,overlap/(v.size+reference.size-overlap));}return max;}
test('Builder D six real new institution IDs occupy six still-vacant 4B slots; all 153 protected objects stay intact',()=>{
 const old=new Set(ROADMAP_C_4B_153_ALL.map(x=>x.id)),expected=new Set(expectedIds());
 assert.equal(ROADMAP_C_4B_153_ALL.length,153);assert.equal(new Set(ROADMAP_C_4B_153_ALL.map(x=>x.id)).size,153);
 assert.equal(ROADMAP_D_WAVE1_IDS.length,6);assert.equal(new Set(ROADMAP_D_WAVE1_IDS).size,6);
 for(const id of ROADMAP_D_WAVE1_IDS){assert.ok(expected.has(id),'not a canonical 4B slot '+id);assert.ok(!old.has(id),'historical 4B ID collision '+id)}
 const census=validateCollection([...ROADMAP_C_4B_153_ALL,...ROADMAP_D_WAVE1_BUILDINGS]);
 assert.deepEqual(census,{authored:159,remaining:126,creatorApproved:0,integrated:0});
 assert.equal(new Set([...ROADMAP_C_4B_153_ALL,...ROADMAP_D_WAVE1_BUILDINGS].map(geometrySignature)).size,159);
});
test('Builder D original source is physically present, connected, room-complete and bearing-supported',()=>{
 assert.deepEqual(ROADMAP_D_WAVE1_BUILDINGS.map(x=>x.type).sort(),['arcane-academy','arcane-academy','magical-research-institute','magical-research-institute','magical-research-institute','schoolhouse'].sort());
 for(const b of ROADMAP_D_WAVE1_BUILDINGS){
  const check=validateBlueprint(b);assert.equal(check.id,b.id);assert.ok(check.physicalCells>1000,'too little source geometry '+b.id);assert.ok(check.walkableCells>250,'missing navigable interiors '+b.id);assert.ok(b.spaces.length>=5,'missing specialized rooms '+b.id);
  assert.deepEqual([b.worldPlaced,b.creatorApproved,b.integrated],[false,false,false]);
  assert.ok(b.openings.some(x=>x.kind==='entrance'));assert.ok(b.openings.filter(x=>x.kind==='window').length>=6);
  const positions=new Map(b.cells.map(c=>[c.at.join(','),c]));
  for(const c of b.cells.filter(x=>x.role==='roof'&&x.at[1]>7)){const [x,y,z]=c.at;assert.ok(positions.has([x,y-1,z].join(',')),'floating roof at '+b.id+' '+c.at)}
  assert.ok(b.spaces.every(x=>b.navigation.some(n=>n.at.join(',')===x.access.join(','))),'unreachable room '+b.id);
  assert.ok(b.dependencies.every(x=>x.unresolved?.length>0));
  assert.ok(b.provenance.historicalSourcesUnchanged);
 }
});
test('No recolored/mirrored historical near-clones: same-category eight-way original ground IoU remains below 0.89',()=>{
 for(const fresh of ROADMAP_D_WAVE1_BUILDINGS){let worst=0;for(const older of [...ROADMAP_C_4B_153_ALL,...ROADMAP_D_WAVE1_BUILDINGS]){
  if(older===fresh||older.type!==fresh.type)continue;
  const score=maxD4(fresh,older);worst=Math.max(worst,score);
  assert.ok(score<0.89,'original ground-space IoU '+score+' between '+fresh.id+' and '+older.id);
 }assert.ok(worst<0.89)}
});
test('D1 original plans physically reserve their open-to-sky courts instead of fake texture courtyards',()=>{
 for(let i=0;i<ROADMAP_D_WAVE1_PLANS.length;i++){
  const p=ROADMAP_D_WAVE1_PLANS[i],b=ROADMAP_D_WAVE1_BUILDINGS[i];const occupied=new Set(b.cells.map(c=>c.at.join(',')));
  for(const [cx,cz] of p.holes||[])for(let y=0;y<=7;y++)assert.ok(!occupied.has([cx,y,cz].join(',')),'non-open skylight '+b.id+' at '+[cx,y,cz]);
 }
});
