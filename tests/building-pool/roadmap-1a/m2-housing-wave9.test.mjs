// Builder 1A M2 wave9: hard-fail 150-house acceptance, source identity preservation,
// real physical voids/room paths/roof backing/bed reservations and producer Pack1–5 footprints.
// Candidate-only: never infer production, real iPhone, art approval or game integration.
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
import {getM2HousingWave5} from '../../../src/building-pool/roadmap-1a/m2-housing-wave5.mjs';
import {getM2HousingWave6} from '../../../src/building-pool/roadmap-1a/m2-housing-wave6.mjs';
import {getM2HousingWave7} from '../../../src/building-pool/roadmap-1a/m2-housing-wave7.mjs';
import {getM2HousingWave8} from '../../../src/building-pool/roadmap-1a/m2-housing-wave8.mjs';
import {getM2HousingWave9,M2_HOUSING_WAVE9_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave9.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';

const prior=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),
 ...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),
 ...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8()];
const fresh=getM2HousingWave9(),all=[...prior,...fresh],key=v=>v.join(',');
const fixture=JSON.parse(readFileSync(new URL('./m2-wave9-baseline149.json',import.meta.url),'utf8'));
const fnv=s=>{let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h.toString(16).padStart(8,'0')};
const plan=b=>new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1)
 .map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));
function silhouette(b){
 const {width:w,depth:d}=b.footprint,notches=b.architecturalIdentity.exteriorNotches??[],set=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){
  const a=Math.min(w-1,Math.floor((x+.5)*w/16)),c=Math.min(d-1,Math.floor((z+.5)*d/16));
  if(notches.every(n=>a<n[0]||a>n[2]||c<n[1]||c>n[3]))set.add(x+','+z);
 }return set;
}
const iou=(a,b)=>{let n=0;for(const k of a)if(b.has(k))n++;return n/(a.size+b.size-n||1)};

test('all 149 protected historical complete 3D candidate blueprints are source-exact and unmodified',()=>{
 assert.equal(prior.length,149);assert.equal(fixture.count,149);
 assert.deepEqual(prior.map(b=>{const s=JSON.stringify(b);return {id:b.id,chars:s.length,fnv:fnv(s)};}),fixture.records);
});
test('22 new individually authored houses complete 150-house M2 milestone, 171 total',()=>{
 assert.equal(fresh.length,22);assert.deepEqual(fresh.map(b=>b.id),M2_HOUSING_WAVE9_IDS);
 assert.equal(new Set(fresh.map(b=>b.architecturalIdentity.plan)).size,22,'no duplicated authored design plans');
 assert.equal(fresh.reduce((s,b)=>s+b.placements.length,0),108715);
 assert.equal(fresh.reduce((s,b)=>s+b.architecturalIdentity.exteriorVoidFootprintCells,0),6759);
 assert.equal(fresh.reduce((s,b)=>s+b.rooms.length,0),93);
 assert.equal(fresh.reduce((s,b)=>s+b.footprintReservations.length,0),22);
 const summary=validatePool(all);
 assert.equal(summary.authored,171);assert.equal(summary.remaining,279);
 assert.deepEqual(all.reduce((o,b)=>(o[b.category]=(o[b.category]??0)+1,o),{}),
  {house:150,tavern:17,inn:4});
 assert.equal(new Set(all.map(b=>b.id)).size,171);
 assert.equal(new Set(all.map(structuralFingerprint)).size,171);
 assert.deepEqual(findMirroredOrRotatedDuplicates(all),[]);
 assert.ok(all.every(b=>b.status==='candidate'&&b.worldPlacement===false&&b.liveIntegration===false));
 assert.ok(fresh.every(b=>b.biome&&b.size&&b.category==='house'));
});
test('all new actual partition and exterior-source footprints pass strict full-pool near-duplicate rejection',()=>{
 const pp=all.map(plan),oo=all.map(silhouette);
 for(let j=prior.length;j<all.length;j++)for(let i=0;i<j;i++){
  assert.ok(iou(pp[i],pp[j])<.88,'near duplicate room partitions '+all[j].id+' / '+all[i].id);
  assert.ok(iou(oo[i],oo[j])<.975,'near duplicate true L/U/T exterior '+all[j].id+' / '+all[i].id);
 }
});
test('new homes distribute across five named biomes and all three relative size slots',()=>{
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
  assert.ok(fresh.filter(b=>b.biome===biome).length>=3,'underdeveloped biome '+biome);
 for(const size of ['small','medium','large'])assert.ok(fresh.some(b=>b.size===size));
});
for(const b of fresh){
 test('full-height real voids, connected rooms, real source Pack AABB, supported roof and bed: '+b.id,()=>{
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>2000);
  const {width:w,depth:d,height:h}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches;
  assert.ok(Array.isArray(cuts)&&cuts.length>=1&&cuts.length<=3);
  assert.equal(b.architecturalIdentity.exteriorOutline,'genuine-concave-perimeter');
  const active=(x,z)=>x>=0&&z>=0&&x<w&&z<d&&cuts.every(n=>x<n[0]||x>n[2]||z<n[1]||z>n[3]);
  const inside=(x,z)=>x>=1&&z>=1&&x<w-1&&z<d-1&&active(x,z);
  const occ=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
  assert.equal(occ.size,b.placements.length,'duplicate occupancy');
  let emptyColumns=0,notchWalls=0;
  for(let x=0;x<w;x++)for(let z=0;z<d;z++){
   if(!active(x,z)){
    emptyColumns++;
    for(let y=0;y<h;y++)assert.ok(!occ.has(key([x,y,z])),'ghost structural source inside the outside void');
    assert.ok(!walk.has(key([x,1,z])),'false walkable outdoor cell');
   }else assert.equal(occ.get(key([x,0,z]))?.role,'foundation','missing real floor');
   if(inside(x,z)&&[[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,c])=>!inside(a,c))){
    assert.equal(occ.get(key([x,4,z]))?.role,'wall','unprotected real exterior');
    if([[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,c])=>a>=0&&c>=0&&a<w&&c<d&&!active(a,c)))notchWalls++;
   }
  }
  assert.equal(emptyColumns,b.architecturalIdentity.exteriorVoidFootprintCells);
  assert.ok(emptyColumns>=100&&notchWalls>=8,'no substantial source-authored concavity');
  assert.equal(b.portals.length,b.rooms.length);
  const entrance=b.portals[0].at,q=[entrance],seen=new Set([key(entrance)]);
  for(let i=0;i<q.length;i++)for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){
   const a=[q[i][0]+dx,1,q[i][2]+dz],k=key(a);
   if(walk.has(k)&&!seen.has(k)){seen.add(k);q.push(a);}
  }
  assert.equal(seen.size,walk.size,'isolated interior voxels');
  for(const room of b.rooms)
   assert.ok(b.walkable.some(a=>a.every((v,i)=>v>=room.min[i]&&v<room.max[i])),room.id+' not walkable');
  for(const portal of b.portals){
   const [x,y,z]=portal.at;
   assert.ok(walk.has(key(portal.at))&&!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])),'blocked door opening');
  }
  const roofs=b.placements.filter(p=>p.role==='roof');
  assert.ok(b.architecturalIdentity.roofWings.length>=2);
  assert.ok(new Set(roofs.map(p=>p.at[1])).size>1,'flat or unsupported roof mass');
  for(const p of roofs){
   assert.ok(occ.has(key([p.at[0],p.at[1]-1,p.at[2]])),'roof-bearing support missing');
   assert.equal(p.weatherSealApproved,false,'unearned production weather certification');
  }
  assert.equal(b.footprintReservations.length,1);
  for(const r of b.footprintReservations){
   assert.equal(r.asset,'pack5:082');assert.equal(r.approval,'unresolved');
   assert.equal(occ.get(key(r.anchor))?.variant,'wanderer-quilt');
   for(const [x,y,z] of r.extraCells){
    assert.ok(active(x,z)&&!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z]))&&!walk.has(key([x,y,z])),'Pack5 occupied foot blocked');
    assert.equal(occ.get(key([x,y-1,z]))?.role,'foundation');
   }
  }
  for(const role of ['foundation','wall','partition','roof','support','door','window','furnishing'])
   assert.ok(b.placements.some(p=>p.role===role),'missing '+role);
  const audit=auditM1PhysicalSources(b);
  assert.equal(audit.catalog.families,96);assert.equal(audit.catalog.numericVariants,106);
  assert.deepEqual(audit.errors,[],b.id+' producer physical geometry failure');
  assert.deepEqual(audit.unresolved,[],b.id+' missing physical family/variant');
  assert.equal(audit.roofTiles,audit.roofBackingCells);
  assert.equal(audit.bedHeads,audit.bedFeet);
  assert.equal(audit.productionReady,false);assert.equal(audit.worldPlaced,false);
  assert.equal(audit.physicalIPhoneTested,false);
 });
}
