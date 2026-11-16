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
import {getM2HousingWave6,M2_HOUSING_WAVE6_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave6.mjs';
import {validatePool,validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
const preserved=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5()];
const fresh=getM2HousingWave6(),pool=[...preserved,...fresh],key=a=>a.join(',');
const baseline=JSON.parse(readFileSync(new URL('./m2-wave6-baseline114.json',import.meta.url),'utf8'));
function fnv(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h.toString(16).padStart(8,'0');}
function norm(b){return new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));}
function silhouette(b){
 const {width:w,depth:d}=b.footprint,notches=b.architecturalIdentity.exteriorNotches??[],out=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){
  const xx=Math.min(w-1,Math.floor((x+.5)*w/16)),zz=Math.min(d-1,Math.floor((z+.5)*d/16));
  if(notches.every(c=>xx<c[0]||xx>c[2]||zz<c[1]||zz>c[3]))out.add(x+','+z);
 }
 return out;
}
const iou=(a,b)=>{const n=[...a].filter(x=>b.has(x)).length;return n/(a.size+b.size-n||1);};
test('all protected 114 complete objects have original source-exact JSON including 30 inherited records',()=>{
 assert.equal(preserved.length,114);assert.equal(baseline.count,114);
 assert.deepEqual(preserved.map(b=>{const s=JSON.stringify(b);return {id:b.id,chars:s.length,fnv:fnv(s)};}),baseline.records);
});
test('15 independent new original houses cover all biome × size slots with exact 54,251 placements and 3,069 absent external cells',()=>{
 assert.equal(fresh.length,15);assert.deepEqual(fresh.map(b=>b.id),M2_HOUSING_WAVE6_IDS);
 assert.equal(fresh.reduce((n,b)=>n+b.placements.length,0),54251);
 assert.equal(fresh.reduce((n,b)=>n+b.architecturalIdentity.exteriorVoidFootprintCells,0),3069);
 assert.equal(new Set(fresh.map(b=>b.architecturalIdentity.plan)).size,15);
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])for(const size of ['small','medium','large'])
  assert.equal(fresh.filter(b=>b.category==='house'&&b.biome===biome&&b.size===size).length,1,biome+'/'+size);
});
test('129 authored candidate records: valid physical schema, unique source identities and D4 mirror/rotation',()=>{
 assert.equal(validatePool(pool).authored,129);
 assert.equal(new Set(pool.map(b=>b.id)).size,129);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,129);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
 assert.deepEqual(pool.reduce((o,b)=>(o[b.category]=(o[b.category]??0)+1,o),{}),{house:108,tavern:17,inn:4});
 assert.ok(pool.every(b=>b.status==='candidate'&&!b.worldPlacement&&!b.liveIntegration));
});
test('new houses reject normalized partition near-duplicates and identical/near-identical exterior silhouettes against ALL protected 114',()=>{
 const oldPlans=preserved.map(norm),oldShapes=preserved.map(silhouette),newPlans=fresh.map(norm),newShapes=fresh.map(silhouette);
 for(let j=0;j<fresh.length;j++)for(let i=0;i<preserved.length+j;i++){
  const p=i<preserved.length?oldPlans[i]:newPlans[i-preserved.length];
  const s=i<preserved.length?oldShapes[i]:newShapes[i-preserved.length];
  assert.ok(iou(p,newPlans[j])<.88,'source plan too similar '+pool[i].id+' / '+fresh[j].id);
  assert.ok(iou(s,newShapes[j])<.975,'source outline too similar '+pool[i].id+' / '+fresh[j].id);
 }
});
for(const b of fresh){
 test('literal L/U/T VOID perimeter, 4-high wall, real rooms/doorways, roof supports and two-cell bed source '+b.id,()=>{
  assert.equal(validateBlueprint(b),true);assert.ok(b.placements.length>1000);
  const {width:w,depth:d}=b.footprint,notches=b.architecturalIdentity.exteriorNotches;
  assert.equal(b.architecturalIdentity.exteriorOutline,'genuine-concave-perimeter');
  assert.ok(Array.isArray(notches)&&notches.length>=1);
  const active=(x,z)=>x>=0&&z>=0&&x<w&&z<d&&notches.every(c=>x<c[0]||x>c[2]||z<c[1]||z>c[3]);
  const inside=(x,z)=>x>=1&&z>=1&&x<w-1&&z<d-1&&active(x,z);
  const occ=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
  assert.equal(occ.size,b.placements.length);
  let absent=0,notchExterior=0;
  for(let x=0;x<w;x++)for(let z=0;z<d;z++){
   if(!active(x,z)){
    absent++;for(let y=0;y<b.footprint.height;y++)assert.ok(!occ.has(key([x,y,z])),'fake exterior void');
    assert.ok(!walk.has(key([x,1,z])),'false outdoor walkable floor');
   }else assert.equal(occ.get(key([x,0,z]))?.role,'foundation','missing source floor');
   if(inside(x,z)&&[[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,c])=>!inside(a,c))){
    assert.equal(occ.get(key([x,4,z]))?.role,'wall','unprotected external notch');
    if([[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,c])=>a>=0&&c>=0&&a<w&&c<d&&!active(a,c)))notchExterior++;
   }
  }
  assert.equal(absent,b.architecturalIdentity.exteriorVoidFootprintCells);
  assert.ok(absent>60&&absent/(w*d)>.09);
  assert.ok(notchExterior>=8,'notch faces are not authored exterior walls');
  const entry=b.portals[0].at,q=[entry],seen=new Set([key(entry)]);
  for(let i=0;i<q.length;i++)for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){
   const v=[q[i][0]+dx,1,q[i][2]+dz],k=key(v);
   if(walk.has(k)&&!seen.has(k)){seen.add(k);q.push(v)}
  }
  assert.equal(seen.size,walk.size,'unreachable interiors');assert.equal(b.portals.length,b.rooms.length);
  for(const room of b.rooms)assert.ok(b.walkable.some(p=>p.every((v,i)=>v>=room.min[i]&&v<room.max[i])),room.id+' inaccessible');
  for(const portal of b.portals){const [x,y,z]=portal.at;
   assert.ok(walk.has(key(portal.at))&&!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])),'blocked door throat');
  }
  for(const p of b.placements.filter(p=>p.role==='roof')){
   assert.ok(occ.has(key([p.at[0],p.at[1]-1,p.at[2]])),'unsupported roof');
   assert.equal(p.weatherSealApproved,false);
  }
  for(const r of b.footprintReservations){
   assert.equal(r.asset,'pack5:082');assert.equal(r.approval,'unresolved');
   assert.equal(occ.get(key(r.anchor))?.variant,'wanderer-quilt');
   for(const [x,y,z] of r.extraCells){
    assert.ok(active(x,z)&&!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z]))&&!walk.has(key([x,y,z])));
    assert.equal(occ.get(key([x,y-1,z]))?.role,'foundation');
   }
  }
  for(const role of ['foundation','wall','partition','roof','support','door','window','furnishing'])
   assert.ok(b.placements.some(p=>p.role===role),'missing role '+role);
  assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.at[1])).size>=2,'flat roof');
  assert.ok(b.architecturalIdentity.roofWings.length>=2);
  assert.deepEqual([...new Set(b.placements.filter(p=>p.occupancy.kind==='unresolved').map(p=>p.asset))].sort(),b.dependencies.map(d=>d.asset));
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 });
}
test('actual integrated source five-pack family visibleBoxes, support offsets and bed AABBs audited read-only',()=>{
 for(const b of fresh){
  const a=auditM1PhysicalSources(b);
  assert.equal(a.catalog.families,96);assert.equal(a.catalog.numericVariants,106);
  assert.deepEqual(a.errors,[],b.id+' producer physical errors');
  assert.deepEqual(a.unresolved,[],b.id+' unresolved physical symbols');
  assert.equal(a.roofTiles,a.roofBackingCells);assert.equal(a.bedHeads,a.bedFeet);
  assert.equal(a.productionReady,false);assert.equal(a.worldPlaced,false);assert.equal(a.physicalIPhoneTested,false);
 }
});
