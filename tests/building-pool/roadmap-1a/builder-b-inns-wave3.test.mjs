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
const historical=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave4(),...getHospitalityWave5(),...getHospitalityWave6(),...getHospitalityWave7(),...getHospitalityWave8(),...getHospitalityWave9(),...getRoadmapC1AHousesWave10(),...getRoadmapC1AInnWave11(),...getRoadmapC1AHousesWave12(),...getRoadmapC1AHousesWave13(),...getRoadmapC1AHousesWave14()],accepted=getRoadmapC1AHousesWave15(),first=getBuilderBHomesWave1(),tavern=getBuilderBHospitalityWave2(),prior=[...historical,...accepted,...first,...tavern],fresh=getBuilderBInnsWave3(),pool=[...prior,...fresh];



const key=p=>p.join(',');
const filled=b=>new Set(b.placements.map(p=>key(p.at)));
const P=b=>new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));
const S=b=>{const {width:w,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches??[],r=new Set();for(let x=0;x<16;x++)for(let z=0;z<16;z++){const X=Math.min(w-1,Math.floor((x+.5)*w/16)),Z=Math.min(d-1,Math.floor((z+.5)*d/16));if(cuts.every(n=>X<n[0]||X>n[2]||Z<n[1]||Z>n[3]))r.add(x+','+z);}return r;};
const iou=(a,b)=>{let c=0;for(const x of a)if(b.has(x))c++;return c/(a.size+b.size-c||1);};
test('Dustwillow original desert inn extends frozen accepted 271 plus 4 provisional B buildings to 276 source designs',()=>{
 assert.equal(prior.length,275);
 assert.deepEqual(fresh.map(b=>b.id),BUILDER_B_INNS_WAVE3_IDS);
 assert.deepEqual(BUILDER_B_INNS_WAVE3_IDS,['r1:inn:desert:small:005']);
 const census=validatePool(pool);assert.deepEqual([census.authored,census.target,census.remaining],[276,450,174]);
 assert.equal(new Set(pool.map(b=>b.id)).size,276);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,276);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
});
test('Dustwillow has 7 walkable lodging rooms, 4 genuinely reserved Pack5 two-cell beds and fully supported shaded roofs',()=>{
 const b=fresh[0],v=filled(b);
 assert.equal(validateBlueprint(b),true);
 assert.equal(b.rooms.length,7);assert.equal(b.portals.length,10);
 assert.equal(b.footprintReservations.length,4);
 assert.equal(b.architecturalIdentity.exteriorNotches.length,3);
 assert.equal(b.architecturalIdentity.roofWings.length,5);
 assert.ok(b.walkable.length>700);
 for(const p of b.placements.filter(p=>p.role==='roof'))assert.ok(v.has(key([p.at[0],p.at[1]-1,p.at[2]])),'unsupported skyshade roof');
 for(const p of b.portals)assert.ok(!v.has(key(p.at))&&!v.has(key([p.at[0],p.at[1]+1,p.at[2]])),'blocked physical portal');
 for(const bed of b.footprintReservations)for(const q of bed.extraCells)
  assert.ok(!v.has(key(q))&&!b.walkable.some(p=>key(p)===key(q)),'guest bed foot collision');
 for(const room of b.rooms)assert.ok(b.walkable.some(p=>p.every((x,i)=>x>=room.min[i]&&x<room.max[i])),room.id);
 const audit=auditM1PhysicalSources(b);assert.deepEqual(audit.errors,[]);assert.deepEqual(audit.unresolved,[]);
 assert.equal(audit.productionReady,false);assert.equal(audit.worldPlaced,false);
});
test('Source floor partitions and source silhouette remain strictly original versus prior 275 1A candidates',()=>{
 const b=fresh[0],p=P(b),s=S(b);
 for(const old of prior){assert.ok(iou(p,P(old))<.88,'near-clone interior '+old.id);assert.ok(iou(s,S(old))<.975,'near-clone exterior '+old.id);}
});
