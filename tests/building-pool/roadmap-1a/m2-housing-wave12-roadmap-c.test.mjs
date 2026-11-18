// Roadmap C 1A original house Wave10: all 265 historical sources preserved; real geometry and physical audit.
import test from 'node:test';import assert from 'node:assert/strict';
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
import {getHospitalityWave4} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave4.mjs';
import {getHospitalityWave5} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave5.mjs';
import {getHospitalityWave6} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave6.mjs';
import {getHospitalityWave7} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave7.mjs';
import {getHospitalityWave8} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave8.mjs';
import {getHospitalityWave9} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave9.mjs';
import {getRoadmapC1AHousesWave10,ROADMAP_C_1A_WAVE10_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave10-roadmap-c.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
import {getRoadmapC1AInnWave11,ROADMAP_C_1A_WAVE11_IDS} from '../../../src/building-pool/roadmap-1a/m3-inn-wave11-roadmap-c.mjs';
import {getRoadmapC1AHousesWave12,ROADMAP_C_1A_WAVE12_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave12-roadmap-c.mjs';
const historical=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave4(),...getHospitalityWave5(),...getHospitalityWave6(),...getHospitalityWave7(),...getHospitalityWave8(),...getHospitalityWave9(),...getRoadmapC1AHousesWave10(),...getRoadmapC1AInnWave11()],fresh=getRoadmapC1AHousesWave12(),pool=[...historical,...fresh];
const k=a=>a.join(',');
const partitions=b=>new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));
const silhouette=b=>{const {width:w,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches??[],out=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){const a=Math.min(w-1,Math.floor((x+.5)*w/16)),c=Math.min(d-1,Math.floor((z+.5)*d/16));
  if(cuts.every(n=>a<n[0]||a>n[2]||c<n[1]||c>n[3]))out.add(x+','+z);
 }return out;};
const iou=(a,b)=>{let common=0;for(const x of a)if(b.has(x))common++;return common/(a.size+b.size-common||1);};


test('all 267 previously accepted 1A original blueprints preserved; Highmoss original mountain house occupies unused 268th ID',()=>{
 assert.equal(historical.length,267);assert.equal(fresh.length,1);
 assert.deepEqual(fresh.map(b=>b.id),ROADMAP_C_1A_WAVE12_IDS);
 assert.deepEqual(ROADMAP_C_1A_WAVE12_IDS,['r1:house:mountain:large:015']);
 assert.equal(new Set(pool.map(b=>b.id)).size,268);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,268);
 assert.deepEqual([validatePool(pool).authored,validatePool(pool).target,validatePool(pool).remaining],[268,450,182]);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
 assert.ok(historical.every(b=>b.worldPlacement===false&&b.liveIntegration===false));
});
test('Highmoss original six-room mountain fork footprint and interior partition fail-closed uniqueness against 267 historical sources',()=>{
 const b=fresh[0],P=partitions(b),S=silhouette(b);
 let maxP=0,maxS=0;
 for(const old of historical){
  const p=iou(P,partitions(old)),s=iou(S,silhouette(old));
  maxP=Math.max(maxP,p);maxS=Math.max(maxS,s);
  assert.ok(p<.88,'partition overlap '+old.id+': '+p);
  assert.ok(s<.975,'silhouette near clone '+old.id+': '+s);
 }
 assert.ok(maxP<.88&&maxS<.975);
});
test('Highmoss genuine three-terrace source 7294 cells has 6 connected rooms, 6 portals, 6 supported roofs, real Pack5 foot reservations',()=>{
 const b=fresh[0];assert.equal(validateBlueprint(b),true);
 assert.deepEqual([b.category,b.biome,b.size,b.index],['house','mountain','large',15]);
 assert.equal(b.rooms.length,6);assert.equal(b.portals.length,6);
 assert.equal(b.architecturalIdentity.exteriorNotches.length,3);assert.equal(b.architecturalIdentity.roofWings.length,6);
 const {width:w,height:h,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches;
 const active=(x,z)=>cuts.every(c=>x<c[0]||x>c[2]||z<c[1]||z>c[3]);
 const occ=new Map(b.placements.map(p=>[k(p.at),p])),walk=new Set(b.walkable.map(k));assert.equal(occ.size,b.placements.length);
 let removed=0;
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(!active(x,z)){removed++;for(let y=0;y<h;y++)assert.ok(!occ.has(k([x,y,z])),'fake structural notch');}
  else assert.equal(occ.get(k([x,0,z]))?.role,'foundation');
 }
 assert.ok(removed>250);assert.equal(removed,b.architecturalIdentity.exteriorVoidFootprintCells);
 const q=[b.portals[0].at],seen=new Set([k(q[0])]);
 for(let i=0;i<q.length;i++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const p=[q[i][0]+dx,1,q[i][2]+dz],keyp=k(p);if(walk.has(keyp)&&!seen.has(keyp)){seen.add(keyp);q.push(p);}
 }
 assert.equal(seen.size,walk.size,'disconnected mountain gallery');
 for(const room of b.rooms)assert.ok(b.walkable.some(p=>p.every((v,i)=>v>=room.min[i]&&v<room.max[i])),room.id+' inaccessible');
 for(const portal of b.portals){const [x,y,z]=portal.at;assert.ok(walk.has(k(portal.at))&&!occ.has(k([x,y,z]))&&!occ.has(k([x,y+1,z])),'blocked two-high portal');}
 const roofs=b.placements.filter(p=>p.role==='roof');assert.ok(new Set(roofs.map(x=>x.at[1])).size>=3);
 for(const t of roofs)assert.ok(occ.has(k([t.at[0],t.at[1]-1,t.at[2]])),'roof floating');
 assert.equal(b.footprintReservations.length,2);
 for(const bed of b.footprintReservations){
  assert.equal(bed.asset,'pack5:082');assert.equal(bed.approval,'unresolved');
  for(const p of bed.extraCells)assert.ok(active(p[0],p[2])&&!occ.has(k(p))&&!walk.has(k(p)),'Pack5 foot overlaps');
 }
 const producer=auditM1PhysicalSources(b);
 assert.deepEqual(producer.errors,[]);assert.deepEqual(producer.unresolved,[]);
 assert.deepEqual([producer.catalog.families,producer.catalog.numericVariants],[96,106]);
 assert.equal(producer.roofTiles,producer.roofBackingCells);assert.equal(producer.bedHeads,producer.bedFeet);
 assert.equal(producer.worldPlaced,false);assert.equal(producer.productionReady,false);assert.equal(producer.physicalIPhoneTested,false);
});
