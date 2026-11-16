import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {getM1InnExemplars} from '../../../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {getM2Originals} from '../../../src/building-pool/roadmap-1a/m2-originals.mjs';
import {getM2HousingTranche} from '../../../src/building-pool/roadmap-1a/m2-housing-tranche.mjs';
import {getM2HousingWave2} from '../../../src/building-pool/roadmap-1a/m2-housing-wave2.mjs';
import {getM2HousingWave3} from '../../../src/building-pool/roadmap-1a/m2-housing-wave3.mjs';
import {getM2HousingWave4,M2_HOUSING_WAVE4_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave4.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
const previous=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3()];
const wave=getM2HousingWave4(),all=[...previous,...wave],key=a=>a.join(',');
const history=JSON.parse(readFileSync(new URL('./m2-wave4-baseline84.json',import.meta.url),'utf8'));
function fnv(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h.toString(16).padStart(8,'0');}
test('protected 84 pre-wave4 objects preserve full authored JSON including every voxel coordinate',()=>{
 assert.equal(previous.length,84);
 assert.deepEqual(previous.map(b=>{const s=JSON.stringify(b);return {id:b.id,chars:s.length,fnv:fnv(s)}}),history.entries);
});
test('15 original new plans cover five regions and three sizes, 56,658 voxel anchors, 37 roof wings',()=>{
 assert.equal(wave.length,15);assert.deepEqual(wave.map(b=>b.id),M2_HOUSING_WAVE4_IDS);
 assert.equal(wave.reduce((n,b)=>n+b.placements.length,0),56658);
 assert.equal(wave.reduce((n,b)=>n+b.architecturalIdentity.roofWings.length,0),37);
 assert.equal(new Set(wave.map(b=>b.architecturalIdentity.plan)).size,15);
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
  for(const size of ['small','medium','large'])
   assert.equal(wave.filter(b=>b.category==='house'&&b.biome===biome&&b.size===size).length,1);
});
test('99 fully instantiated source blueprints have unique ID, geometry and D4 equivalence class',()=>{
 assert.equal(validatePool(all).authored,99);
 assert.equal(new Set(all.map(b=>b.id)).size,99);
 assert.equal(new Set(all.map(structuralFingerprint)).size,99);
 assert.deepEqual(findMirroredOrRotatedDuplicates(all),[]);
 assert.deepEqual(all.reduce((o,b)=>(o[b.category]=(o[b.category]??0)+1,o),{}),{house:78,tavern:17,inn:4});
});
function partition(b){return new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>
 Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));}
test('new houses have no near-identical normalized partition plan against prior 45 or each other',()=>{
 const older=[...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3()];
 const full=[...older,...wave],points=full.map(partition);
 for(let j=45;j<full.length;j++)for(let i=0;i<j;i++){
  const a=points[i],b=points[j],inter=[...a].filter(k=>b.has(k)).length;
  const overlap=inter/(a.size+b.size-inter||1);
  assert.ok(overlap<.88,'near duplicate '+full[i].id+' vs '+full[j].id+' '+overlap);
 }
});
for(const b of wave){
 test('source-authentic physical floor/rooms, access, roof supports, bed-foot reservations '+b.id,()=>{
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>=1500);
  const occ=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
  const queue=[b.portals[0].at],seen=new Set([key(queue[0])]);
  for(let i=0;i<queue.length;i++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const p=[queue[i][0]+dx,1,queue[i][2]+dz],k=key(p);
   if(walk.has(k)&&!seen.has(k)){seen.add(k);queue.push(p);}
  }
  assert.equal(seen.size,walk.size,'unreachable walking tile');assert.equal(occ.size,b.placements.length);
  assert.equal(b.portals.length,b.rooms.length);assert.ok(b.rooms.length>=4);
  for(const r of b.rooms)assert.ok(b.walkable.some(a=>a.every((n,i)=>n>=r.min[i]&&n<r.max[i])),r.id+' empty room');
  for(const p of b.portals){const [x,y,z]=p.at;
   assert.ok(walk.has(key(p.at))&&!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])),'blocked opening');
  }
  for(const role of ['foundation','wall','partition','support','roof','door','window','furnishing'])
   assert.ok(b.placements.some(p=>p.role===role),'missing '+role);
  const roofHeights=new Set();
  for(const p of b.placements.filter(p=>p.role==='roof')){
   roofHeights.add(p.at[1]);assert.ok(occ.has(key([p.at[0],p.at[1]-1,p.at[2]])),'roof without backing');
   assert.equal(p.weatherSealApproved,false);
  }
  assert.ok(roofHeights.size>1,'identical flat roof');
  assert.ok(b.architecturalIdentity.roofWings.length>=2);
  for(const r of b.footprintReservations){
   assert.equal(r.asset,'pack5:082');assert.equal(r.approval,'unresolved');
   assert.equal(occ.get(key(r.anchor))?.variant,'wanderer-quilt');
   for(const [x,y,z] of r.extraCells){
    assert.ok(!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z]))&&!walk.has(key([x,y,z])));
    assert.equal(occ.get(key([x,y-1,z]))?.role,'foundation');
   }
  }
  if(b.architecturalIdentity.outdoorCourtyard){
   const [x0,z0,x1,z1]=b.architecturalIdentity.outdoorCourtyard;
   for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)for(let y=4;y<b.footprint.height;y++)
    assert.ok(!occ.has(key([x,y,z])),'obstructed courtyard sky');
  }
  assert.deepEqual([...new Set(b.placements.filter(p=>p.occupancy.kind==='unresolved').map(p=>p.asset))].sort(),b.dependencies.map(d=>d.asset));
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
 });
}
test('15 house physical producer source audit is provisional and leaves all five packs unchanged',()=>{
 for(const b of wave){
  const a=auditM1PhysicalSources(b);
  assert.equal(a.catalog.families,96);assert.equal(a.catalog.numericVariants,106);
  assert.deepEqual(a.errors,[],b.id+' physical family errors');
  assert.deepEqual(a.unresolved,[],b.id+' unresolved family');
  assert.equal(a.roofTiles,a.roofBackingCells);assert.equal(a.bedHeads,a.bedFeet);
  assert.equal(a.productionReady,false);assert.equal(a.worldPlaced,false);
 }
});
