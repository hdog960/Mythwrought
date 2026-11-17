// Builder 1A source-only M3 hospitality wave: literal physical 3D tavern and inn acceptance.
// No live registration, world placement, save migration, creator artwork or iPhone certification.
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
import {getM2HousingWave9} from '../../../src/building-pool/roadmap-1a/m2-housing-wave9.mjs';
import {getHospitalityWave1} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave1.mjs';
import {getHospitalityWave2} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave2.mjs';
import {getHospitalityWave3} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave3.mjs';
import {getHospitalityWave4,HOSPITALITY_WAVE4_IDS} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave4.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
const protectedPool=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),
 ...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),
 ...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3()];
const hospitality=getHospitalityWave4(),pool=[...protectedPool,...hospitality],baseline=JSON.parse(readFileSync(new URL('./m3-hospitality-baseline214.json',import.meta.url),'utf8'));
const key=v=>v.join(',');
function fnv(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h.toString(16).padStart(8,'0');}
function normPlan(b){return new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1)
 .map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));}
function silhouette(b){
 const {width:w,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches??[],set=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){
  const a=Math.min(w-1,Math.floor((x+.5)*w/16)),c=Math.min(d-1,Math.floor((z+.5)*d/16));
  if(cuts.every(n=>a<n[0]||a>n[2]||c<n[1]||c>n[3]))set.add(x+','+z);
 }
 return set;
}
function iou(a,b){let both=0;for(const k of a)if(b.has(k))both++;return both/(a.size+b.size-both||1);}
test('all 214 prior complete original source objects including the 150-house milestone remain exactly unchanged',()=>{
 assert.equal(protectedPool.length,214);assert.equal(baseline.count,214);
 assert.deepEqual(protectedPool.map(b=>{const s=JSON.stringify(b);return {id:b.id,chars:s.length,fnv:fnv(s)};}),baseline.records);
});
test('10 original wave4 hospitality source buildings, four taverns and six inns, enlarge 214 to 224',()=>{
 assert.equal(hospitality.length,10);assert.deepEqual(hospitality.map(b=>b.id),HOSPITALITY_WAVE4_IDS);
 assert.equal(hospitality.filter(b=>b.category==='tavern').length,4);
 assert.equal(hospitality.filter(b=>b.category==='inn').length,6);
 assert.equal(new Set(hospitality.map(b=>b.architecturalIdentity.plan)).size,10);
 assert.equal(hospitality.reduce((s,b)=>s+b.placements.length,0),92724);
 assert.equal(hospitality.reduce((s,b)=>s+b.architecturalIdentity.exteriorVoidFootprintCells,0),6334);
 assert.equal(hospitality.reduce((s,b)=>s+b.rooms.length,0),53);
 assert.equal(hospitality.reduce((s,b)=>s+b.footprintReservations.length,0),24);
 assert.deepEqual(pool.reduce((o,b)=>(o[b.category]=(o[b.category]??0)+1,o),{}),{house:150,tavern:42,inn:32});
 assert.equal(validatePool(pool).authored,224);assert.equal(validatePool(pool).remaining,226);
 assert.equal(new Set(pool.map(b=>b.id)).size,224);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,224);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
 assert.ok(pool.every(b=>b.status==='candidate'&&b.worldPlacement===false&&b.liveIntegration===false));
});
test('wave4 source cohort reaches all five biomes and all three overall size classes',()=>{
 assert.deepEqual([...new Set(hospitality.map(b=>b.biome))].sort(),['desert','enchanted-forest','mountain','snow','temperate']);
 assert.deepEqual(hospitality.filter(b=>b.category==='tavern').map(b=>b.biome).sort(),['enchanted-forest','snow','temperate','temperate']);
 assert.deepEqual(hospitality.filter(b=>b.category==='inn').map(b=>b.biome).sort(),['desert','enchanted-forest','mountain','snow','temperate','temperate']);
 for(const size of ['small','medium','large'])
  assert.ok(hospitality.some(b=>b.size===size),size+' missing from new source cohort');
});
test('10 hospitality wave4 buildings have strict original source partition AND full concave exterior signatures versus all 214 original and new',()=>{
 const plans=pool.map(normPlan),shapes=pool.map(silhouette);
 for(let j=protectedPool.length;j<pool.length;j++)for(let i=0;i<j;i++){
  assert.ok(iou(plans[i],plans[j])<.88,'too similar partition geometry '+pool[i].id+' / '+pool[j].id);
  assert.ok(iou(shapes[i],shapes[j])<.975,'too similar physical outline '+pool[i].id+' / '+pool[j].id);
 }
});
for(const b of hospitality){
 test('individual physical full-height concavity, roof, guest accessibility and producer family AABB: '+b.id,()=>{
  assert.equal(validateBlueprint(b),true);
  const {width:w,depth:d,height:h}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches;
  assert.ok(Array.isArray(cuts)&&cuts.length>=1&&cuts.length<=3);
  assert.equal(b.architecturalIdentity.exteriorOutline,'genuine-concave-perimeter');
  assert.ok(b.placements.length>2000&&b.rooms.length>=5);
  const active=(x,z)=>x>=0&&z>=0&&x<w&&z<d&&cuts.every(n=>x<n[0]||x>n[2]||z<n[1]||z>n[3]);
  const inside=(x,z)=>x>=1&&z>=1&&x<w-1&&z<d-1&&active(x,z);
  const occupied=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
  assert.equal(occupied.size,b.placements.length,'duplicate physical cell');
  let absent=0,notchFaces=0;
  for(let x=0;x<w;x++)for(let z=0;z<d;z++){
   if(!active(x,z)){
    absent++;for(let y=0;y<h;y++)assert.ok(!occupied.has(key([x,y,z])),'fake outside: roof/floor inside notch');
    assert.ok(!walk.has(key([x,1,z])),'impossible outside walkable tile');
   }else assert.equal(occupied.get(key([x,0,z]))?.role,'foundation','missing foundation');
   if(inside(x,z)&&[[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,c])=>!inside(a,c))){
    assert.equal(occupied.get(key([x,4,z]))?.role,'wall','missing 4-high exterior notch face');
    if([[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,c])=>a>=0&&c>=0&&a<w&&c<d&&!active(a,c)))notchFaces++;
   }
  }
  assert.equal(absent,b.architecturalIdentity.exteriorVoidFootprintCells);
  assert.ok(absent>120&&notchFaces>=8,'small or fake concavity');
  assert.equal(b.portals.length,b.rooms.length);
  const q=[b.portals[0].at],seen=new Set([key(q[0])]);
  for(let i=0;i<q.length;i++)for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){
   const a=[q[i][0]+dx,1,q[i][2]+dz],k=key(a);
   if(walk.has(k)&&!seen.has(k)){seen.add(k);q.push(a);}
  }
  assert.equal(seen.size,walk.size,'unreachable rooms/disconnected walking');
  for(const room of b.rooms)
   assert.ok(b.walkable.some(a=>a.every((v,i)=>v>=room.min[i]&&v<room.max[i])),room.id+' inaccessible');
  for(const p of b.portals){
   const [x,y,z]=p.at;
   assert.ok(walk.has(key(p.at))&&!occupied.has(key([x,y,z]))&&!occupied.has(key([x,y+1,z])),'blocked portal throat');
  }
  const roofs=b.placements.filter(p=>p.role==='roof');
  assert.ok(b.architecturalIdentity.roofWings.length>=2);
  assert.ok(new Set(roofs.map(p=>p.at[1])).size>=2,'flat/undifferentiated roof');
  for(const p of roofs){
   assert.ok(occupied.has(key([p.at[0],p.at[1]-1,p.at[2]])),'floating roof');
   assert.equal(p.weatherSealApproved,false);
  }
  const expectedBeds=b.category==='tavern'?1:(b.rooms.length===6?4:3);
  assert.equal(b.footprintReservations.length,expectedBeds);
  for(const r of b.footprintReservations){
   assert.equal(r.asset,'pack5:082');assert.equal(r.approval,'unresolved');
   assert.equal(occupied.get(key(r.anchor))?.variant,'wanderer-quilt');
   for(const [x,y,z] of r.extraCells){
    assert.ok(active(x,z)&&!occupied.has(key([x,y,z]))&&!occupied.has(key([x,y+1,z]))&&!walk.has(key([x,y,z])),'bad two-cell bed source');
    assert.equal(occupied.get(key([x,y-1,z]))?.role,'foundation');
   }
  }
  for(const role of ['foundation','wall','partition','roof','support','door','window','furnishing'])
   assert.ok(b.placements.some(p=>p.role===role),'missing physical role '+role);
  for(const f of b.placements.filter(p=>p.role==='furnishing')){
   const room=b.rooms.find(r=>r.id===f.room);
   assert.ok(room&&f.at.every((v,i)=>v>=room.min[i]&&v<room.max[i]),'fixture misassigned to room');
  }
  const audit=auditM1PhysicalSources(b);
  assert.equal(audit.catalog.families,96);assert.equal(audit.catalog.numericVariants,106);
  assert.deepEqual(audit.errors,[],b.id+' physical Pack source occupancy/support failure');
  assert.deepEqual(audit.unresolved,[],b.id+' producer physical source missing');
  assert.equal(audit.roofTiles,audit.roofBackingCells);
  assert.equal(audit.bedHeads,audit.bedFeet);
  assert.equal(audit.productionReady,false);assert.equal(audit.worldPlaced,false);assert.equal(audit.physicalIPhoneTested,false);
 });
}
