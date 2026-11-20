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
import {getRoadmapC1AHousesWave13,ROADMAP_C_1A_WAVE13_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave13-roadmap-c.mjs';
import {getRoadmapC1AHousesWave14,ROADMAP_C_1A_WAVE14_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave14-roadmap-c.mjs';
import {getRoadmapC1AHousesWave15,ROADMAP_C_1A_WAVE15_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave15-roadmap-c.mjs';

import {getBuilderBHomesWave1,BUILDER_B_HOMES_WAVE1_IDS} from '../../../src/building-pool/roadmap-1a/builder-b-homes-wave1.mjs';
import {getBuilderBHospitalityWave2,BUILDER_B_HOSPITALITY_WAVE2_IDS} from '../../../src/building-pool/roadmap-1a/builder-b-hospitality-wave2.mjs';
import {getBuilderBInnsWave3,BUILDER_B_INNS_WAVE3_IDS} from '../../../src/building-pool/roadmap-1a/builder-b-inns-wave3.mjs';
import {getBuilderBHomesWave4,BUILDER_B_HOMES_WAVE4_IDS} from '../../../src/building-pool/roadmap-1a/builder-b-homes-wave4.mjs';
import {getBuilderBHospitalityWave5,BUILDER_B_HOSPITALITY_WAVE5_IDS} from '../../../src/building-pool/roadmap-1a/builder-b-hospitality-wave5.mjs';
import {getBuilderBHomesWave6,BUILDER_B_HOMES_WAVE6_IDS} from '../../../src/building-pool/roadmap-1a/builder-b-homes-wave6.mjs';
const historical=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave4(),...getHospitalityWave5(),...getHospitalityWave6(),...getHospitalityWave7(),...getHospitalityWave8(),...getHospitalityWave9(),...getRoadmapC1AHousesWave10(),...getRoadmapC1AInnWave11(),...getRoadmapC1AHousesWave12(),...getRoadmapC1AHousesWave13(),...getRoadmapC1AHousesWave14()],accepted=getRoadmapC1AHousesWave15(),first=getBuilderBHomesWave1(),tavern=getBuilderBHospitalityWave2(),inn=getBuilderBInnsWave3(),mountain=getBuilderBHomesWave4(),foxglade=getBuilderBHospitalityWave5(),prior=[...historical,...accepted,...first,...tavern,...inn,...mountain,...foxglade],fresh=getBuilderBHomesWave6(),pool=[...prior,...fresh];




const K=p=>p.join(',');
const vox=b=>new Set(b.placements.map(p=>K(p.at)));
const partition=b=>new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));
const outline=b=>{const {width:w,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches??[],u=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){const X=Math.min(w-1,Math.floor((x+.5)*w/16)),Z=Math.min(d-1,Math.floor((z+.5)*d/16));if(cuts.every(c=>X<c[0]||X>c[2]||Z<c[1]||Z>c[3]))u.add(x+','+z);}return u;};
const iou=(a,b)=>{let n=0;for(const v of a)if(b.has(v))n++;return n/(a.size+b.size-n||1)};
test('Willowmere new temperate cottage is 279th unique provisional 1A source preserving full accepted 271',()=>{
 assert.equal(prior.length,278);
 assert.deepEqual(fresh.map(x=>x.id),BUILDER_B_HOMES_WAVE6_IDS);
 assert.deepEqual(BUILDER_B_HOMES_WAVE6_IDS,['r1:house:temperate:small:020']);
 const poolStats=validatePool(pool);assert.deepEqual([poolStats.authored,poolStats.target,poolStats.remaining],[279,450,171]);
 assert.equal(new Set(pool.map(x=>x.id)).size,279);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,279);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
});
test('Willowmere is true six-room, backed temperate split-orchard cottage with real absent-ground orchard courts',()=>{
 const b=fresh[0],v=vox(b);
 assert.equal(validateBlueprint(b),true);
 assert.equal(b.rooms.length,6);assert.equal(b.portals.length,8);
 assert.equal(b.footprintReservations.length,1);
 assert.equal(b.architecturalIdentity.exteriorNotches.length,3);
 assert.equal(b.architecturalIdentity.roofWings.length,5);
 assert.ok(b.walkable.length>500);
 for(const p of b.placements.filter(p=>p.role==='roof'))
  assert.ok(v.has(K([p.at[0],p.at[1]-1,p.at[2]])),'unsupported temperate cottage roof');
 for(const d of b.portals)
  assert.ok(!v.has(K(d.at))&&!v.has(K([d.at[0],d.at[1]+1,d.at[2]])),'blocked source door');
 for(const room of b.rooms)assert.ok(b.walkable.some(p=>p.every((n,i)=>n>=room.min[i]&&n<room.max[i])),room.id);
 const audit=auditM1PhysicalSources(b);assert.deepEqual(audit.errors,[]);assert.deepEqual(audit.unresolved,[]);
 assert.equal(audit.productionReady,false);assert.equal(audit.worldPlaced,false);
});
test('Willowmere differs from all 278 prior candidates in strict normalized partitions and silhouettes',()=>{
 const b=fresh[0],p=partition(b),s=outline(b);
 for(const older of prior){
  assert.ok(iou(p,partition(older))<.88,'reused room partition '+older.id);
  assert.ok(iou(s,outline(older))<.975,'reused outside silhouette '+older.id);
 }
});
