// Builder 1A M2 wave8: independent original regional homes, nonrectangular source 3D physical acceptance.
// No production registration, city placement, save-schema mutations, integration or art signoff.
import test from 'node:test';
import assert from 'node:assert/strict';
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
import {getM2HousingWave8,M2_HOUSING_WAVE8_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave8.mjs';
import {validatePool,validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';

const prior=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7()];
const fresh=getM2HousingWave8(),all=[...prior,...fresh],key=a=>a.join(',');
const normalizedPartitions=b=>new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1)
 .map(p=>Math.floor(p.at[0]*16/b.footprint.width)+','+Math.floor(p.at[2]*16/b.footprint.depth)));
function silhouette(b){
 const {width:w,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches??[],out=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){
  const a=Math.min(w-1,Math.floor((x+.5)*w/16)),c=Math.min(d-1,Math.floor((z+.5)*d/16));
  if(cuts.every(n=>a<n[0]||a>n[2]||c<n[1]||c>n[3]))out.add(x+','+z);
 }return out;
}
const overlap=(a,b)=>{let n=0;for(const x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1);};

test('five individually authored source houses expand protected 144 to 149 distinct candidates',()=>{
 assert.equal(prior.length,144);
 assert.equal(fresh.length,5);
 assert.deepEqual(fresh.map(b=>b.id),M2_HOUSING_WAVE8_IDS);
 assert.equal(validatePool(all).authored,149);
 assert.deepEqual(all.reduce((o,b)=>(o[b.category]=(o[b.category]??0)+1,o),{}),{house:128,tavern:17,inn:4});
 assert.equal(new Set(all.map(b=>b.id)).size,149);
 assert.equal(new Set(all.map(structuralFingerprint)).size,149);
 assert.deepEqual(findMirroredOrRotatedDuplicates(all),[]);
 assert.equal(new Set(fresh.map(b=>b.architecturalIdentity.plan)).size,5);
 assert.deepEqual(fresh.map(b=>b.biome),['temperate','desert','snow','enchanted-forest','mountain']);
 assert.ok(all.every(b=>b.status==='candidate'&&!b.liveIntegration&&!b.worldPlacement));
});
test('new coordinate-authored partition and external outline differ from all 144 prior designs and one another',()=>{
 const prevP=prior.map(normalizedPartitions),prevO=prior.map(silhouette),newP=fresh.map(normalizedPartitions),newO=fresh.map(silhouette);
 for(let j=0;j<fresh.length;j++)for(let i=0;i<prior.length+j;i++){
  const p=i<prior.length?prevP[i]:newP[i-prior.length],s=i<prior.length?prevO[i]:newO[i-prior.length];
  assert.ok(overlap(newP[j],p)<.88,'near-duplicate floor plan '+all[i].id+' '+fresh[j].id);
  assert.ok(overlap(newO[j],s)<.975,'near-duplicate exterior silhouette '+all[i].id+' '+fresh[j].id);
 }
});
for(const b of fresh){
 test('real L/U/T exterior and supported multi-roof, reachable rooms, five-pack physical QA: '+b.id,()=>{
  assert.equal(validateBlueprint(b),true);
  assert.ok(b.placements.length>1200);
  const n=b.architecturalIdentity.exteriorNotches,{width:w,depth:d,height:h}=b.footprint;
  assert.ok(n.length>=1&&n.length<=2);
  const active=(x,z)=>x>=0&&z>=0&&x<w&&z<d&&n.every(c=>x<c[0]||x>c[2]||z<c[1]||z>c[3]);
  const inside=(x,z)=>x>=1&&z>=1&&x<w-1&&z<d-1&&active(x,z);
  const occ=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
  assert.equal(occ.size,b.placements.length);
  let absent=0,notchWalls=0;
  for(let x=0;x<w;x++)for(let z=0;z<d;z++){
   if(!active(x,z)){
    absent++;for(let y=0;y<h;y++)assert.ok(!occ.has(key([x,y,z])),'ghost geometry inside outdoors');
    assert.ok(!walk.has(key([x,1,z])));
   }else assert.equal(occ.get(key([x,0,z]))?.role,'foundation');
   if(inside(x,z)&&[[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,c])=>!inside(a,c))){
    assert.equal(occ.get(key([x,4,z]))?.role,'wall');
    if([[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,c])=>a>=0&&c>=0&&a<w&&c<d&&!active(a,c)))notchWalls++;
   }
  }
  assert.equal(absent,b.architecturalIdentity.exteriorVoidFootprintCells);
  assert.ok(absent>100&&notchWalls>8);
  const walkQueue=[b.portals[0].at],seen=new Set([key(walkQueue[0])]);
  for(let i=0;i<walkQueue.length;i++)for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){
   const next=[walkQueue[i][0]+dx,1,walkQueue[i][2]+dz],k=key(next);
   if(walk.has(k)&&!seen.has(k)){seen.add(k);walkQueue.push(next);}
  }
  assert.equal(seen.size,walk.size,'physical walking connectivity');
  assert.equal(b.portals.length,b.rooms.length);
  for(const room of b.rooms)assert.ok(b.walkable.some(p=>p.every((v,i)=>v>=room.min[i]&&v<room.max[i])),'blocked '+room.id);
  for(const p of b.portals){
   assert.ok(walk.has(key(p.at))&&!occ.has(key(p.at))&&!occ.has(key([p.at[0],2,p.at[2]])),'blocked door');
  }
  const roof=b.placements.filter(p=>p.role==='roof');
  assert.ok(new Set(roof.map(p=>p.at[1])).size>1&&b.architecturalIdentity.roofWings.length>=2);
  for(const p of roof){assert.ok(occ.has(key([p.at[0],p.at[1]-1,p.at[2]])),'floating roof');assert.equal(p.weatherSealApproved,false);}
  for(const r of b.footprintReservations){
   assert.equal(r.asset,'pack5:082');assert.equal(r.approval,'unresolved');
   for(const [x,y,z] of r.extraCells)assert.ok(active(x,z)&&!occ.has(key([x,y,z]))&&!walk.has(key([x,y,z])),'bad bed foot');
  }
  for(const role of ['foundation','wall','partition','door','window','roof','support','furnishing'])
   assert.ok(b.placements.some(p=>p.role===role),'missing physical '+role);
  const audit=auditM1PhysicalSources(b);
  assert.equal(audit.catalog.families,96);assert.equal(audit.catalog.numericVariants,106);
  assert.deepEqual(audit.errors,[]);assert.deepEqual(audit.unresolved,[]);
  assert.equal(audit.roofTiles,audit.roofBackingCells);assert.equal(audit.bedHeads,audit.bedFeet);
  assert.equal(audit.productionReady,false);assert.equal(audit.worldPlaced,false);assert.equal(audit.physicalIPhoneTested,false);
 });
}
