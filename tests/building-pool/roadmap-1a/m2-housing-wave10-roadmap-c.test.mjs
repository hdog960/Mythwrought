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
const historical=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave4(),...getHospitalityWave5(),...getHospitalityWave6(),...getHospitalityWave7(),...getHospitalityWave8(),...getHospitalityWave9()],fresh=getRoadmapC1AHousesWave10(),pool=[...historical,...fresh];
const k=a=>a.join(',');
const partitions=b=>new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));
const silhouette=b=>{const {width:w,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches??[],out=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){const a=Math.min(w-1,Math.floor((x+.5)*w/16)),c=Math.min(d-1,Math.floor((z+.5)*d/16));
  if(cuts.every(n=>a<n[0]||a>n[2]||c<n[1]||c>n[3]))out.add(x+','+z);
 }return out;};
const iou=(a,b)=>{let common=0;for(const x of a)if(b.has(x))common++;return common/(a.size+b.size-common||1);};
test('Wave10 preserves 265 historical 1A source-owned candidates and introduces one new original allocated house',()=>{
 assert.equal(historical.length,265);assert.equal(fresh.length,1);
 assert.deepEqual(fresh.map(b=>b.id),ROADMAP_C_1A_WAVE10_IDS);
 assert.deepEqual(ROADMAP_C_1A_WAVE10_IDS,['r1:house:temperate:small:015']);
 assert.equal(new Set(pool.map(x=>x.id)).size,266);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,266);
 assert.deepEqual(validatePool(pool),{authored:266,target:450,remaining:184,buckets:undefined});
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
 assert.ok(historical.every(b=>b.status==='candidate'&&b.worldPlacement===false&&b.liveIntegration===false));
});
test('new house has unique eight-orientation physical geometry and strictly dissimilar interior/exterior footprints',()=>{
 const b=fresh[0],P=partitions(b),S=silhouette(b);
 for(const previous of historical){
  assert.ok(iou(P,partitions(previous))<.88,'partition IoU '+previous.id);
  assert.ok(iou(S,silhouette(previous))<.975,'exterior silhouette IoU '+previous.id);
 }
 assert.equal(new Set(b.placements.map(p=>k(p.at))).size,b.placements.length);
});
test('Reedbank cottage has actual concave grounded exterior, connected rooms, supported roof and true Pack5 bed footprint',()=>{
 const b=fresh[0];assert.equal(validateBlueprint(b),true);
 assert.deepEqual([b.category,b.biome,b.size,b.index],['house','temperate','small',15]);
 assert.equal(b.rooms.length,4);assert.equal(b.portals.length,4);
 assert.equal(b.architecturalIdentity.exteriorNotches.length,2);
 const {width:w,height:h,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches;
 const active=(x,z)=>cuts.every(c=>x<c[0]||x>c[2]||z<c[1]||z>c[3]);
 const occ=new Map(b.placements.map(p=>[k(p.at),p])),walk=new Set(b.walkable.map(k));
 let voids=0;
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(!active(x,z)){voids++;for(let y=0;y<h;y++)assert.ok(!occ.has(k([x,y,z])),'void is cosmetic');}
  else assert.equal(occ.get(k([x,0,z]))?.role,'foundation','unsupported floor');
 }
 assert.ok(voids>150);assert.equal(voids,b.architecturalIdentity.exteriorVoidFootprintCells);
 const q=[b.portals[0].at],seen=new Set([k(q[0])]);
 for(let i=0;i<q.length;i++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const p=[q[i][0]+dx,1,q[i][2]+dz],s=k(p);if(walk.has(s)&&!seen.has(s)){seen.add(s);q.push(p);}
 }
 assert.equal(seen.size,walk.size,'rooms lack actual connected circulation');
 for(const room of b.rooms)assert.ok(b.walkable.some(p=>p.every((v,i)=>v>=room.min[i]&&v<room.max[i])),room.id+' inaccessible');
 for(const door of b.portals){const [x,y,z]=door.at;
  assert.ok(walk.has(k(door.at))&&!occ.has(k([x,y,z]))&&!occ.has(k([x,y+1,z])),'blocked two-high portal');}
 const roof=b.placements.filter(p=>p.role==='roof');
 assert.equal(b.architecturalIdentity.roofWings.length,3);
 assert.ok(new Set(roof.map(p=>p.at[1])).size>=3);
 for(const t of roof)assert.ok(occ.has(k([t.at[0],t.at[1]-1,t.at[2]])),'roof floats');
 assert.equal(b.footprintReservations.length,1);
 const bed=b.footprintReservations[0];assert.equal(bed.asset,'pack5:082');assert.equal(bed.approval,'unresolved');
 for(const p of bed.extraCells)assert.ok(active(p[0],p[2])&&!occ.has(k(p))&&!walk.has(k(p)),'Pack5 bed foot overlaps');
 const audit=auditM1PhysicalSources(b);
 assert.deepEqual(audit.errors,[]);assert.deepEqual(audit.unresolved,[]);
 assert.equal(audit.catalog.families,96);assert.equal(audit.catalog.numericVariants,106);
 assert.equal(audit.roofTiles,audit.roofBackingCells);assert.equal(audit.bedHeads,audit.bedFeet);
 assert.equal(audit.worldPlaced,false);assert.equal(audit.productionReady,false);assert.equal(audit.physicalIPhoneTested,false);
});
