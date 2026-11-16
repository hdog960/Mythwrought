import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {getM1InnExemplars} from '../../../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {getM2Originals} from '../../../src/building-pool/roadmap-1a/m2-originals.mjs';
import {getM2HousingTranche} from '../../../src/building-pool/roadmap-1a/m2-housing-tranche.mjs';
import {getM2HousingWave2} from '../../../src/building-pool/roadmap-1a/m2-housing-wave2.mjs';
import {getM2HousingWave3} from '../../../src/building-pool/roadmap-1a/m2-housing-wave3.mjs';
import {getM2HousingWave4} from '../../../src/building-pool/roadmap-1a/m2-housing-wave4.mjs';
import {getM2HousingWave5,M2_HOUSING_WAVE5_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave5.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
const old=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4()];
const next=getM2HousingWave5(),pool=[...old,...next],key=p=>p.join(',');
const fixture=JSON.parse(readFileSync(new URL('./m2-wave5-baseline99.json',import.meta.url),'utf8'));
function fnv(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h.toString(16).padStart(8,'0');}
test('complete original 99 blueprint objects, including all 30 inherited and 84 original authored baseline, have unchanged exact serialized fingerprints',()=>{
 assert.equal(old.length,99);assert.equal(fixture.count,99);
 assert.deepEqual(old.map(b=>{const s=JSON.stringify(b);return {id:b.id,chars:s.length,fnv:fnv(s)}}),fixture.records);
});
test('new concave authoring: all 15 region x size slots, 52,722 source placement records and 2455 removed exterior cells',()=>{
 assert.equal(next.length,15);assert.deepEqual(next.map(b=>b.id),M2_HOUSING_WAVE5_IDS);
 assert.equal(next.reduce((n,b)=>n+b.placements.length,0),52722);
 assert.equal(next.reduce((n,b)=>n+b.architecturalIdentity.exteriorVoidFootprintCells,0),2455);
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])for(const size of ['small','medium','large'])
  assert.equal(next.filter(b=>b.category==='house'&&b.biome===biome&&b.size===size).length,1,biome+'/'+size);
});
test('all 114 authored blueprints unique: schema, IDs, D4 rotations and reflected geometry',()=>{
 assert.equal(validatePool(pool).authored,114);assert.equal(new Set(pool.map(x=>x.id)).size,114);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,114);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
 assert.deepEqual(pool.reduce((o,b)=>(o[b.category]=(o[b.category]??0)+1,o),{}),{house:93,tavern:17,inn:4});
 assert.ok(pool.every(b=>b.status==='candidate'&&!b.worldPlacement&&!b.liveIntegration));
});
const normalized=b=>new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>
 Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));
test('zero superficial floorplan duplication between 60 previous new houses and 15 genuine concave houses',()=>{
 const previous=[...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4()];
 const all=[...previous,...next],sets=all.map(normalized);
 for(let j=60;j<all.length;j++)for(let i=0;i<j;i++){
  const a=sets[i],b=sets[j],intersection=[...a].filter(k=>b.has(k)).length;
  const score=intersection/(a.size+b.size-intersection||1);
  assert.ok(score<.88,'too similar: '+all[i].id+' to '+all[j].id+' '+score);
 }
});
for(const b of next){
 test('actual L/U cut-away foundations, exterior walls, supported roof, walking corridors and double-cell beds '+b.id,()=>{
  assert.equal(validateBlueprint(b),true);
  const [w,d]=[b.footprint.width,b.footprint.depth];
  assert.ok(b.placements.length>1000);
  const occ=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
  assert.equal(occ.size,b.placements.length);
  const notches=b.architecturalIdentity.exteriorNotches;
  assert.equal(b.architecturalIdentity.exteriorOutline,'genuine-concave-perimeter');
  assert.ok(Array.isArray(notches)&&notches.length>=1);
  const active=(x,z)=>x>=0&&z>=0&&x<w&&z<d&&notches.every(c=>x<c[0]||x>c[2]||z<c[1]||z>c[3]);
  const inner=(x,z)=>x>=1&&z>=1&&x<w-1&&z<d-1&&active(x,z);
  let notchCount=0,exposedNotchEdges=0,foundations=0;
  for(let x=0;x<w;x++)for(let z=0;z<d;z++){
   if(!active(x,z)){
    notchCount++;
    for(let y=0;y<b.footprint.height;y++)assert.equal(occ.has(key([x,y,z])),false,'fake cut-out voxel');
    assert.equal(walk.has(key([x,1,z])),false,'fake exterior walking floor');
   }else{
    foundations++;assert.equal(occ.get(key([x,0,z]))?.role,'foundation','unsupported real source floor');
   }
   if(inner(x,z)&&[[x+1,z],[x-1,z],[x,z+1],[x,z-1]].some(([a,c])=>!inner(a,c))){
    assert.equal(occ.get(key([x,4,z]))?.role,'wall','missing notch-facing wall');
    if([[x+1,z],[x-1,z],[x,z+1],[x,z-1]].some(([a,c])=>a>=0&&c>=0&&a<w&&c<d&&!active(a,c)))exposedNotchEdges++;
   }
  }
  assert.equal(notchCount,b.architecturalIdentity.exteriorVoidFootprintCells);
  assert.equal(foundations,w*d-notchCount);
  assert.ok(notchCount>=60&&notchCount/(w*d)>.09,'notches too small to affect silhouette');
  assert.ok(exposedNotchEdges>8,'notch not a genuine supported perimeter');
  const entry=b.portals[0].at,queue=[entry],seen=new Set([key(entry)]);
  for(let i=0;i<queue.length;i++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const v=[queue[i][0]+dx,1,queue[i][2]+dz],k=key(v);
   if(walk.has(k)&&!seen.has(k)){seen.add(k);queue.push(v)}
  }
  assert.equal(seen.size,walk.size,'disconnected real walking corridors');
  assert.equal(b.portals.length,b.rooms.length);
  for(const room of b.rooms)assert.ok(b.walkable.some(v=>v.every((n,i)=>n>=room.min[i]&&n<room.max[i])),room.id+' inaccessible');
  for(const portal of b.portals){const [x,y,z]=portal.at;assert.ok(walk.has(key(portal.at)));
   assert.ok(!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])),'door throat blocked');
  }
  for(const p of b.placements.filter(p=>p.role==='roof')){
   const [x,y,z]=p.at;
   assert.ok(occ.has(key([x,y-1,z])),'roof without actual authored backing');
   assert.equal(p.weatherSealApproved,false);
  }
  for(const reservation of b.footprintReservations){
   assert.equal(reservation.asset,'pack5:082');
   assert.equal(occ.get(key(reservation.anchor))?.variant,'wanderer-quilt');
   for(const [x,y,z] of reservation.extraCells){
    assert.ok(active(x,z));assert.ok(!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z]))&&!walk.has(key([x,y,z])));
    assert.equal(occ.get(key([x,y-1,z]))?.role,'foundation');
   }
  }
  for(const role of ['foundation','wall','partition','door','window','roof','support','furnishing'])
   assert.ok(b.placements.some(p=>p.role===role),'missing role '+role);
  assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.at[1])).size>=2);
  assert.ok(b.architecturalIdentity.roofWings.length>=2);
  assert.deepEqual([...new Set(b.placements.filter(p=>p.occupancy.kind==='unresolved').map(p=>p.asset))].sort(),b.dependencies.map(d=>d.asset));
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
 });
}
test('physical Pack1-5 producer source ABI, extra-cell collision and roof material support for all 15 concave houses',()=>{
 for(const b of next){
  const a=auditM1PhysicalSources(b);
  assert.equal(a.catalog.families,96);assert.equal(a.catalog.numericVariants,106);
  assert.deepEqual(a.errors,[],b.id+' invalid physical source');
  assert.deepEqual(a.unresolved,[],b.id+' producer reference unresolved');
  assert.equal(a.roofTiles,a.roofBackingCells);
  assert.equal(a.bedHeads,a.bedFeet);
  assert.equal(a.productionReady,false);assert.equal(a.worldPlaced,false);
  assert.equal(a.roofLoadCertified,false);
 }
});
